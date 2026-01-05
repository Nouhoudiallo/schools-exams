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

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            enrollments: true,
            exams: true,
          },
        },
      },
    });

    if (!school) {
      return createErrorResponse("École non trouvée", 404);
    }

    // Check ownership
    if (school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    return createSuccessResponse(school);
  } catch (error) {
    console.error("Get school error:", error);
    return createErrorResponse("Erreur lors de la récupération de l'école", 500);
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

    const school = await prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      return createErrorResponse("École non trouvée", 404);
    }

    // Check ownership
    if (school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    await prisma.school.delete({
      where: { id },
    });

    return createSuccessResponse({ message: "École supprimée" });
  } catch (error) {
    console.error("Delete school error:", error);
    return createErrorResponse("Erreur lors de la suppression de l'école", 500);
  }
}
