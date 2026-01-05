import { z } from "zod";

// Common schemas
export const EmailSchema = z.string().email("Email invalide");

export const UserIdSchema = z.string().cuid("ID utilisateur invalide");

export const DateTimeSchema = z.string().datetime("Date invalide");

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Exam validation
export const ExamDateRangeSchema = z.object({
  startsAt: DateTimeSchema,
  endsAt: DateTimeSchema,
}).refine(
  (data) => new Date(data.endsAt) > new Date(data.startsAt),
  {
    message: "La date de fin doit être après la date de début",
    path: ["endsAt"],
  }
);

// Success/Error response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

export function validateExamTiming(startsAt: Date, endsAt: Date): boolean {
  const now = new Date();
  return now >= startsAt && now <= endsAt;
}

export function isExamOngoing(startsAt: Date, endsAt: Date): boolean {
  const now = new Date();
  return now >= startsAt && now <= endsAt;
}

export function hasExamEnded(endsAt: Date): boolean {
  return new Date() > endsAt;
}

export function hasExamStarted(startsAt: Date): boolean {
  return new Date() >= startsAt;
}
