import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";
import { z } from "zod";

const SubmitExamSchema = z.object({
  invitationId: z.string(),
  token: z.string(),
  content: z.string().min(1),
  cheatingLog: z.any().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return createErrorResponse("Non authentifié", 401);
    }

    const userId = verifyToken(token);
    if (!userId) {
      return createErrorResponse("Token invalide", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createErrorResponse("Utilisateur non trouvé", 404);
    }

    if (user.role === "PROF") {
      // Teachers see all submissions for their exams
      const submissions = await prisma.examSubmission.findMany({
        where: {
          exam: {
            class: {
              school: {
                ownerId: userId,
              },
            },
          },
        },
        include: {
          exam: true,
          student: true,
        },
      });
      return createSuccessResponse(submissions);
    } else {
      // Students see their own submissions
      const submissions = await prisma.examSubmission.findMany({
        where: {
          studentId: userId,
        },
        include: {
          exam: true,
        },
      });
      return createSuccessResponse(submissions);
    }
  } catch (error) {
    console.error("Get submissions error:", error);
    return createErrorResponse("Erreur lors de la récupération des soumissions", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return createErrorResponse("Non authentifié", 401);
    }

    const userId = verifyToken(token);
    if (!userId) {
      return createErrorResponse("Token invalide", 401);
    }

    const body = await req.json();
    const { invitationId, token: invitationToken, content, cheatingLog } = SubmitExamSchema.parse(
      body
    );

    // Verify invitation
    const invitation = await prisma.examInvitation.findUnique({
      where: { id: invitationId },
      include: {
        exam: true,
        student: true,
      },
    });

    if (!invitation) {
      return createErrorResponse("Invitation non trouvée", 404);
    }

    if (invitation.token !== invitationToken) {
      return createErrorResponse("Token invalide", 401);
    }

    if (invitation.studentId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    // Check if exam is still active
    const now = new Date();
    if (now < invitation.exam.startsAt) {
      return createErrorResponse("L'examen n'a pas encore commencé", 400);
    }

    if (now > invitation.exam.endsAt) {
      return createErrorResponse("L'examen est terminé", 400);
    }

    // Check if already submitted
    const existingSubmission = await prisma.examSubmission.findUnique({
      where: {
        examId_studentId: {
          examId: invitation.examId,
          studentId: userId,
        },
      },
    });

    if (existingSubmission) {
      return createErrorResponse("Vous avez déjà soumis une réponse pour cet examen", 400);
    }

    // Create submission
    const submission = await prisma.examSubmission.create({
      data: {
        examId: invitation.examId,
        studentId: userId,
        content,
        // cheatingLog: cheatingLog ? JSON.stringify(cheatingLog) : null,
      },
      include: {
        exam: true,
        student: true,
      },
    });

    // Update invitation status
    await prisma.examInvitation.update({
      where: { id: invitationId },
      data: { status: "SUBMITTED" },
    });

    return createSuccessResponse(submission, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Submit exam error:", error);
    return createErrorResponse("Erreur lors de la soumission de l'examen", 500);
  }
}
