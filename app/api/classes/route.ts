import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";
import { z } from "zod";

const CreateClassSchema = z.object({
  name: z.string().min(2),
  schoolId: z.string(),
});

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
    const { name, schoolId } = CreateClassSchema.parse(body);

    // Verify school ownership
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      return createErrorResponse("École non trouvée", 404);
    }

    if (school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    const classData = await prisma.class.create({
      data: {
        name,
        schoolId,
      },
      include: {
        enrollments: true,
      },
    });

    return createSuccessResponse(classData, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Create class error:", error);
    return createErrorResponse("Erreur lors de la création de la classe", 500);
  }
}
