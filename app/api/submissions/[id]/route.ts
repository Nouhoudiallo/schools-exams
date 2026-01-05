import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return createErrorResponse("Non authentifié", 401);
    }

    const userId = verifyToken(token);
    if (!userId) {
      return createErrorResponse("Token invalide", 401);
    }

    const { id } = await params;

    const submission = await prisma.examSubmission.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            class: {
              include: { school: true },
            },
          },
        },
        student: true,
      },
    });

    if (!submission) {
      return createErrorResponse("Soumission non trouvée", 404);
    }

    // Check authorization: student can view their own, teacher can view for their exams
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === "STUDENT" && submission.studentId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    if (user?.role === "PROF" && submission.exam.class.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    return createSuccessResponse(submission);
  } catch (error) {
    console.error("Get submission error:", error);
    return createErrorResponse("Erreur lors de la récupération de la soumission", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return createErrorResponse("Non authentifié", 401);
    }

    const userId = verifyToken(token);
    if (!userId) {
      return createErrorResponse("Token invalide", 401);
    }

    const { id } = await params;

    const submission = await prisma.examSubmission.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            class: {
              include: { school: true },
            },
          },
        },
      },
    });

    if (!submission) {
      return createErrorResponse("Soumission non trouvée", 404);
    }

    // Only teacher can delete
    if (submission.exam.class.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    await prisma.examSubmission.delete({
      where: { id },
    });

    return createSuccessResponse({ message: "Soumission supprimée" });
  } catch (error) {
    console.error("Delete submission error:", error);
    return createErrorResponse("Erreur lors de la suppression de la soumission", 500);
  }
}
