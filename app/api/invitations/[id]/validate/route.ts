import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse } from "@/src/lib/auth";
import { z } from "zod";

const ValidateTokenSchema = z.object({
  token: z.string(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { token } = ValidateTokenSchema.parse(body);

    const { id } = await params;

    const invitation = await prisma.examInvitation.findUnique({
      where: { id },
      include: {
        exam: true,
        student: true,
      },
    });

    if (!invitation) {
      return createErrorResponse("Invitation non trouvée", 404);
    }

    if (invitation.token !== token) {
      return createErrorResponse("Token invalide", 401);
    }

    // Check if exam is still active
    const now = new Date();
    if (now < invitation.exam.startsAt) {
      return createErrorResponse("L'examen n'a pas encore commencé", 400);
    }

    if (now > invitation.exam.endsAt) {
      return createErrorResponse("L'examen est terminé", 400);
    }

    return createSuccessResponse({
      invitation,
      valid: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Validate token error:", error);
    return createErrorResponse("Erreur lors de la validation du token", 500);
  }
}
