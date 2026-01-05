import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";
import { z } from "zod";

const CreateSchoolSchema = z.object({
  name: z.string().min(2),
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

    const schools = await prisma.school.findMany({
      where: { ownerId: userId },
      include: {
        classes: true,
      },
    });

    return createSuccessResponse(schools);
  } catch (error) {
    console.error("Get schools error:", error);
    return createErrorResponse("Erreur lors de la récupération des écoles", 500);
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
    const { name } = CreateSchoolSchema.parse(body);

    const school = await prisma.school.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    return createSuccessResponse(school, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Create school error:", error);
    return createErrorResponse("Erreur lors de la création de l'école", 500);
  }
}
