import { NextRequest } from "next/server";
import prisma  from "@/src/lib/prisma";
import { createErrorResponse, createSuccessResponse, generateToken } from "@/src/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = LoginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return createErrorResponse("Email ou mot de passe incorrect", 401);
    }

    // Generate token
    const token = generateToken(user.id);

    return createSuccessResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse("Données invalides", 400);
    }
    console.error("Login error:", error);
    return createErrorResponse("Erreur lors de la connexion", 500);
  }
}
