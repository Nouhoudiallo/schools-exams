import { NextRequest, NextResponse } from "next/server";
import { ErrorMessages, StatusCodes } from "./constants";

// Simple JWT-like token management for demo (should use proper JWT in production)
export function generateToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString("base64");
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");
    return userId;
  } catch {
    return null;
  }
}

export function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

export function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: any, status: number = StatusCodes.OK) {
  return NextResponse.json(data, { status });
}

export function createUnauthorizedResponse() {
  return createErrorResponse(ErrorMessages.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
}

export function createForbiddenResponse() {
  return createErrorResponse(ErrorMessages.FORBIDDEN, StatusCodes.FORBIDDEN);
}

export function createNotFoundResponse(resource: string = "Ressource") {
  return createErrorResponse(`${resource} non trouvée`, StatusCodes.NOT_FOUND);
}

export function createBadRequestResponse(message: string = ErrorMessages.INVALID_DATA) {
  return createErrorResponse(message, StatusCodes.BAD_REQUEST);
}

export function createInternalErrorResponse(message: string = ErrorMessages.INTERNAL_ERROR) {
  return createErrorResponse(message, StatusCodes.INTERNAL_ERROR);
}
