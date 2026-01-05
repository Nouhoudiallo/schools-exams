import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";
import { z } from "zod";

const CreateExamSchema = z.object({
  title: z.string().min(2),
  pdfUrl: z.string().url(),
  classId: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
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

    // Get all exams for classes owned by this teacher
    const exams = await prisma.exam.findMany({
      where: {
        class: {
          school: {
            ownerId: userId,
          },
        },
      },
      include: {
        class: true,
        invitations: true,
        submissions: true,
      },
    });

    return createSuccessResponse(exams);
  } catch (error) {
    console.error("Get exams error:", error);
    return createErrorResponse("Erreur lors de la récupération des examens", 500);
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
    const { title, pdfUrl, classId, startsAt, endsAt } = CreateExamSchema.parse(body);

    // Verify class and ownership
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { school: true },
    });

    if (!classData) {
      return createErrorResponse("Classe non trouvée", 404);
    }

    if (classData.school.ownerId !== userId) {
      return createErrorResponse("Non autorisé", 403);
    }

    // Validate dates
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (endDate <= startDate) {
      return createErrorResponse("La date de fin doit être après la date de début", 400);
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        pdfUrl,
        classId,
        startsAt: startDate,
        endsAt: endDate,
      },
      include: {
        class: true,
        invitations: true,
        submissions: true,
      },
    });

    return createSuccessResponse(exam, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Create exam error:", error);
    return createErrorResponse("Erreur lors de la création de l'examen", 500);
  }
}
