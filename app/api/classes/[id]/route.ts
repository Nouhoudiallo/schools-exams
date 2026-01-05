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

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        school: true,
        enrollments: {
          include: {
            user: true,
          },
        },
        exams: true,
      },
    });

    if (!classData) {
      return createErrorResponse("Classe non trouvée", 404);
    }

    // Verify ownership
    if (classData.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    return createSuccessResponse(classData);
  } catch (error) {
    console.error("Get class error:", error);
    return createErrorResponse("Erreur lors de la récupération de la classe", 500);
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

    const classData = await prisma.class.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!classData) {
      return createErrorResponse("Classe non trouvée", 404);
    }

    if (classData.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    await prisma.class.delete({
      where: { id },
    });

    return createSuccessResponse({ message: "Classe supprimée" });
  } catch (error) {
    console.error("Delete class error:", error);
    return createErrorResponse("Erreur lors de la suppression de la classe", 500);
  }
}
