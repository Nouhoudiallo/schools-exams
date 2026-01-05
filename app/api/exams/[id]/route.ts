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

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        class: {
          include: { school: true },
        },
        invitations: {
          include: { student: true },
        },
        submissions: {
          include: { student: true },
        },
      },
    });

    if (!exam) {
      return createErrorResponse("Examen non trouvé", 404);
    }

    // Verify ownership (teacher only)
    if (exam.class.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    return createSuccessResponse(exam);
  } catch (error) {
    console.error("Get exam error:", error);
    return createErrorResponse("Erreur lors de la récupération de l'examen", 500);
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

    const exam = await prisma.exam.findUnique({
      where: { id },
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

    await prisma.exam.delete({
      where: { id },
    });

    return createSuccessResponse({ message: "Examen supprimé" });
  } catch (error) {
    console.error("Delete exam error:", error);
    return createErrorResponse("Erreur lors de la suppression de l'examen", 500);
  }
}
