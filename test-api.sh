#!/bin/bash

# Test script for the API
# This script tests basic API endpoints

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Starting API tests..."

# Test 1: Register a teacher
echo -e "\n${GREEN}Test 1: Register a teacher${NC}"
TEACHER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "PROF"
  }')

echo $TEACHER_RESPONSE | jq .
TEACHER_TOKEN=$(echo $TEACHER_RESPONSE | jq -r '.token')
TEACHER_ID=$(echo $TEACHER_RESPONSE | jq -r '.user.id')

if [ -z "$TEACHER_TOKEN" ] || [ "$TEACHER_TOKEN" = "null" ]; then
  echo -e "${RED}Failed to register teacher${NC}"
  exit 1
fi

echo "Teacher token: $TEACHER_TOKEN"
echo "Teacher ID: $TEACHER_ID"

# Test 2: Create a school
echo -e "\n${GREEN}Test 2: Create a school${NC}"
SCHOOL_RESPONSE=$(curl -s -X POST "$BASE_URL/api/schools" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "name": "Lycée Saint-Paul"
  }')

echo $SCHOOL_RESPONSE | jq .
SCHOOL_ID=$(echo $SCHOOL_RESPONSE | jq -r '.id')

if [ -z "$SCHOOL_ID" ] || [ "$SCHOOL_ID" = "null" ]; then
  echo -e "${RED}Failed to create school${NC}"
  exit 1
fi

echo "School ID: $SCHOOL_ID"

# Test 3: Create a class
echo -e "\n${GREEN}Test 3: Create a class${NC}"
CLASS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"name\": \"3ème A\",
    \"schoolId\": \"$SCHOOL_ID\"
  }")

echo $CLASS_RESPONSE | jq .
CLASS_ID=$(echo $CLASS_RESPONSE | jq -r '.id')

if [ -z "$CLASS_ID" ] || [ "$CLASS_ID" = "null" ]; then
  echo -e "${RED}Failed to create class${NC}"
  exit 1
fi

echo "Class ID: $CLASS_ID"

# Test 4: Register a student
echo -e "\n${GREEN}Test 4: Register a student${NC}"
STUDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Durand",
    "email": "marie@example.com",
    "role": "STUDENT"
  }')

echo $STUDENT_RESPONSE | jq .
STUDENT_TOKEN=$(echo $STUDENT_RESPONSE | jq -r '.token')
STUDENT_ID=$(echo $STUDENT_RESPONSE | jq -r '.user.id')

if [ -z "$STUDENT_TOKEN" ] || [ "$STUDENT_TOKEN" = "null" ]; then
  echo -e "${RED}Failed to register student${NC}"
  exit 1
fi

echo "Student token: $STUDENT_TOKEN"
echo "Student ID: $STUDENT_ID"

# Test 5: Enroll student in class
echo -e "\n${GREEN}Test 5: Enroll student in class${NC}"
ENROLLMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/enrollments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"email\": \"marie@example.com\",
    \"classId\": \"$CLASS_ID\"
  }")

echo $ENROLLMENT_RESPONSE | jq .

# Test 6: Create an exam
echo -e "\n${GREEN}Test 6: Create an exam${NC}"
START_TIME=$(date -u -d "+1 hour" +"%Y-%m-%dT%H:%M:%SZ")
END_TIME=$(date -u -d "+3 hours" +"%Y-%m-%dT%H:%M:%SZ")

EXAM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/exams" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"title\": \"Examen de Mathématiques\",
    \"pdfUrl\": \"https://example.com/exam.pdf\",
    \"classId\": \"$CLASS_ID\",
    \"startsAt\": \"$START_TIME\",
    \"endsAt\": \"$END_TIME\"
  }")

echo $EXAM_RESPONSE | jq .
EXAM_ID=$(echo $EXAM_RESPONSE | jq -r '.id')

if [ -z "$EXAM_ID" ] || [ "$EXAM_ID" = "null" ]; then
  echo -e "${RED}Failed to create exam${NC}"
  exit 1
fi

echo "Exam ID: $EXAM_ID"

# Test 7: Create invitations
echo -e "\n${GREEN}Test 7: Create exam invitations${NC}"
INVITATION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/invitations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d "{
    \"examId\": \"$EXAM_ID\",
    \"studentIds\": [\"$STUDENT_ID\"]
  }")

echo $INVITATION_RESPONSE | jq .
INVITATION_ID=$(echo $INVITATION_RESPONSE | jq -r '.[0].id')
INVITATION_TOKEN=$(echo $INVITATION_RESPONSE | jq -r '.[0].token')

if [ -z "$INVITATION_ID" ] || [ "$INVITATION_ID" = "null" ]; then
  echo -e "${RED}Failed to create invitation${NC}"
  exit 1
fi

echo "Invitation ID: $INVITATION_ID"
echo "Invitation Token: $INVITATION_TOKEN"

# Test 8: Get schools
echo -e "\n${GREEN}Test 8: Get teacher's schools${NC}"
curl -s -X GET "$BASE_URL/api/schools" \
  -H "Authorization: Bearer $TEACHER_TOKEN" | jq .

echo -e "\n${GREEN}✅ All tests passed!${NC}"
