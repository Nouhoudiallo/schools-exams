import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const CreateInvitationSchema = z.object({
  examId: z.string(),
  studentIds: z.array(z.string()),
});

function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

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

    // Get user's invitations
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createErrorResponse("Utilisateur non trouvé", 404);
    }

    if (user.role === "PROF") {
      // Teachers see invitations for their exams
      const invitations = await prisma.examInvitation.findMany({
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
      return createSuccessResponse(invitations);
    } else {
      // Students see their own invitations
      const invitations = await prisma.examInvitation.findMany({
        where: {
          studentId: userId,
        },
        include: {
          exam: true,
        },
      });
      return createSuccessResponse(invitations);
    }
  } catch (error) {
    console.error("Get invitations error:", error);
    return createErrorResponse("Erreur lors de la récupération des invitations", 500);
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
    const { examId, studentIds } = CreateInvitationSchema.parse(body);

    // Verify exam and ownership
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        class: {
          include: { school: true },
        },
      },
    });

    if (!exam) {
      return createErrorResponse("Examen non trouvé", 404);
    }

    if (exam.class.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    // Create invitations
    const invitations = await Promise.all(
      studentIds.map((studentId) =>
        prisma.examInvitation.create({
          data: {
            examId,
            studentId,
            token: generateInvitationToken(),
          },
          include: {
            student: true,
            exam: true,
          },
        })
      )
    );

    return createSuccessResponse(invitations, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Create invitation error:", error);
    return createErrorResponse("Erreur lors de la création des invitations", 500);
  }
}
