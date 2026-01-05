# API Documentation - Je cours l'exam

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user (teacher or student).

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PROF" | "STUDENT"
}
```

**Response:**
```json
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PROF"
  },
  "token": "eyJ..."
}
```

#### POST `/api/auth/login`
Login with email.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PROF"
  },
  "token": "eyJ..."
}
```

---

### Schools (Teachers only)

#### GET `/api/schools`
Get all schools owned by the authenticated teacher.

**Response:**
```json
[
  {
    "id": "school123",
    "name": "Lycée Saint-Paul",
    "ownerId": "user123",
    "createdAt": "2025-01-05T12:00:00Z",
    "classes": []
  }
]
```

#### POST `/api/schools`
Create a new school.

**Request:**
```json
{
  "name": "Lycée Saint-Paul"
}
```

**Response:** School object with status 201

#### GET `/api/schools/{id}`
Get a specific school with its classes and enrollments.

#### DELETE `/api/schools/{id}`
Delete a school.

---

### Classes

#### POST `/api/classes`
Create a new class in a school.

**Request:**
```json
{
  "name": "3ème A",
  "schoolId": "school123"
}
```

**Response:** Class object with status 201

#### GET `/api/classes/{id}`
Get class details with enrollments and exams.

#### DELETE `/api/classes/{id}`
Delete a class.

---

### Enrollments (Students)

#### POST `/api/enrollments`
Add a student to a class by email.

**Request:**
```json
{
  "email": "student@example.com",
  "classId": "class123"
}
```

**Response:** Enrollment object with status 201

#### DELETE `/api/enrollments/{id}`
Remove a student from a class.

---

### Exams

#### GET `/api/exams`
Get all exams (teachers see their exams, students see their invitations).

#### POST `/api/exams`
Create a new exam in a class.

**Request:**
```json
{
  "title": "Examen de Mathématiques",
  "pdfUrl": "https://example.com/exam.pdf",
  "classId": "class123",
  "startsAt": "2025-01-10T08:00:00Z",
  "endsAt": "2025-01-10T10:00:00Z"
}
```

**Response:** Exam object with status 201

#### GET `/api/exams/{id}`
Get exam details with invitations and submissions.

#### DELETE `/api/exams/{id}`
Delete an exam.

---

### Exam Invitations

#### GET `/api/invitations`
Get invitations (teachers see all for their exams, students see their invitations).

#### POST `/api/invitations`
Create exam invitations for students.

**Request:**
```json
{
  "examId": "exam123",
  "studentIds": ["student1", "student2", "student3"]
}
```

**Response:** Array of invitation objects with status 201

#### POST `/api/invitations/{id}/validate`
Validate an exam invitation token.

**Request:**
```json
{
  "token": "abc123..."
}
```

**Response:**
```json
{
  "invitation": { /* invitation object */ },
  "valid": true
}
```

---

### Exam Submissions

#### GET `/api/submissions`
Get submissions (teachers see all for their exams, students see their submissions).

#### POST `/api/submissions`
Submit exam answers.

**Request:**
```json
{
  "invitationId": "invitation123",
  "token": "abc123...",
  "content": "Réponses écrites par l'élève...",
  "cheatingLog": { /* optional cheating detection log */ }
}
```

**Response:** Submission object with status 201

#### GET `/api/submissions/{id}`
Get submission details.

#### DELETE `/api/submissions/{id}`
Delete a submission (teacher only).

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Description du problème"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

---

## Security Notes

1. **Token Validation**: All protected endpoints validate the Bearer token.
2. **Ownership Verification**: Teachers can only manage their own schools, classes, and exams.
3. **Role-based Access**: Some endpoints restrict access based on user role (PROF/STUDENT).
4. **Exam Time Validation**: Submissions are only accepted during the exam window.

---

## Workflow Example

### Teacher Workflow

1. **Register**: POST `/api/auth/register` (role: PROF)
2. **Create School**: POST `/api/schools`
3. **Create Class**: POST `/api/classes`
4. **Enroll Students**: POST `/api/enrollments` (multiple times)
5. **Create Exam**: POST `/api/exams`
6. **Send Invitations**: POST `/api/invitations`
7. **View Results**: GET `/api/submissions`

### Student Workflow

1. **Register or Get Invited**: POST `/api/auth/register` (role: STUDENT)
2. **View Invitations**: GET `/api/invitations`
3. **Validate Invitation**: POST `/api/invitations/{id}/validate`
4. **Submit Exam**: POST `/api/submissions`
5. **View Submission**: GET `/api/submissions/{id}`
