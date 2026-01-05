

// API Request/Response types

import { Enrollment, Exam, ExamInvitation, ExamSubmission, School } from "@/src/generated/prisma/browser";
import { Class } from "@/src/generated/prisma/client";

export interface RegisterRequest {
  name: string;
  email: string;
  role: "PROF" | "STUDENT";
}

export interface LoginRequest {
  email: string;
}

export interface AuthResponse {
  user: UserDto;
  token: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: "PROF" | "STUDENT";
}

// School
export interface CreateSchoolRequest {
  name: string;
}

export interface SchoolDto extends School {
  classes?: ClassDto[];
}

// Class
export interface CreateClassRequest {
  name: string;
  schoolId: string;
}

export interface ClassDto extends Class {
  school?: SchoolDto;
  enrollments?: EnrollmentDto[];
  exams?: ExamDto[];
}

// Enrollment
export interface EnrollStudentRequest {
  email: string;
  classId: string;
}

export interface EnrollmentDto extends Enrollment {
  user?: UserDto;
  class?: ClassDto;
}

// Exam
export interface CreateExamRequest {
  title: string;
  pdfUrl: string;
  classId: string;
  startsAt: string; // ISO datetime
  endsAt: string; // ISO datetime
}

export interface ExamDto extends Exam {
  class?: ClassDto;
  invitations?: ExamInvitationDto[];
  submissions?: ExamSubmissionDto[];
}

// Exam Invitation
export interface CreateInvitationRequest {
  examId: string;
  studentIds: string[];
}

export interface ExamInvitationDto extends ExamInvitation {
  exam?: ExamDto;
  student?: UserDto;
}

// Exam Submission
export interface SubmitExamRequest {
  invitationId: string;
  token: string;
  content: string;
  cheatingLog?: Record<string, any>;
}

export interface ExamSubmissionDto extends ExamSubmission {
  exam?: ExamDto;
  student?: UserDto;
}

// Error Response
export interface ErrorResponse {
  error: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Teacher Dashboard
export interface TeacherDashboard {
  schools: SchoolDto[];
  upcomingExams: ExamDto[];
  recentSubmissions: ExamSubmissionDto[];
  studentsEnrolled: number;
}

// Student Dashboard
export interface StudentDashboard {
  invitations: ExamInvitationDto[];
  submissions: ExamSubmissionDto[];
  enrollments: EnrollmentDto[];
}
