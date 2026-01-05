import { NextRequest } from "next/server";
import  prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, getAuthToken, verifyToken } from "@/src/lib/auth";
import { z } from "zod";

const EnrollStudentSchema = z.object({
  email: z.string().email(),
  classId: z.string(),
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
    const { email, classId } = EnrollStudentSchema.parse(body);

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

    // Find or create student user
    let student = await prisma.user.findUnique({
      where: { email },
    });

    if (!student) {
      // Create student user
      const nameParts = email.split("@");
      student = await prisma.user.create({
        data: {
          email,
          name: nameParts[0],
          role: "STUDENT",
        },
      });
    } else if (student.role !== "STUDENT") {
      return createErrorResponse("Cet utilisateur n'est pas un élève", 400);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId: student.id,
          classId,
        },
      },
    });

    if (existingEnrollment) {
      return createErrorResponse("Cet élève est déjà inscrit à cette classe", 400);
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        classId,
      },
      include: {
        user: true,
        class: true,
      },
    });

    return createSuccessResponse(enrollment, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Enroll student error:", error);
    return createErrorResponse("Erreur lors de l'inscription de l'élève", 500);
  }
}
