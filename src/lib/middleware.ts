import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, verifyToken, createUnauthorizedResponse } from "@/src/lib/auth";
import  prisma  from "@/src/lib/prisma";

export type AuthenticatedRequest = NextRequest & {
  userId?: string;
  user?: any;
};

/**
 * Middleware to verify authentication token
 * Attaches userId to request if valid
 */
export async function withAuth(handler: Function) {
  return async (req: NextRequest, context?: any) => {
    const token = getAuthToken(req);
    
    if (!token) {
      return createUnauthorizedResponse();
    }

    const userId = verifyToken(token);
    if (!userId) {
      return createUnauthorizedResponse();
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return createUnauthorizedResponse();
    }

    // Attach user info to request
    (req as any).userId = userId;
    (req as any).user = user;

    return handler(req, context);
  };
}

/**
 * Middleware to verify user is a teacher (PROF)
 */
export async function withTeacher(handler: Function) {
  return withAuth(async (req: NextRequest, context?: any) => {
    const user = (req as any).user;
    
    if (user.role !== "PROF") {
      return new NextResponse(
        JSON.stringify({ error: "Seuls les professeurs peuvent accéder à cette ressource" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return handler(req, context);
  });
}

/**
 * Middleware to verify user is a student (STUDENT)
 */
export async function withStudent(handler: Function) {
  return withAuth(async (req: NextRequest, context?: any) => {
    const user = (req as any).user;
    
    if (user.role !== "STUDENT") {
      return new NextResponse(
        JSON.stringify({ error: "Seuls les élèves peuvent accéder à cette ressource" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return handler(req, context);
  });
}
