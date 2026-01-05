import { NextRequest } from "next/server";
import  prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        class: {
          include: { school: true },
        },
      },
    });

    if (!enrollment) {
      return createErrorResponse("Inscription non trouvée", 404);
    }

    if (enrollment.class.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    await prisma.enrollment.delete({
      where: { id },
    });

    return createSuccessResponse({ message: "Inscription supprimée" });
  } catch (error) {
    console.error("Delete enrollment error:", error);
    return createErrorResponse("Erreur lors de la suppression de l'inscription", 500);
  }
}
