import { NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, generateToken } from "@/src/lib/auth";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["PROF", "STUDENT"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role } = RegisterSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return createErrorResponse("Cet email est déjà utilisé", 400);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return createSuccessResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Register error:", error);
    return createErrorResponse("Erreur lors de l'inscription", 500);
  }
}
