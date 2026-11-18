# Intern Panel — Frontend Integration Guide

> **Base URL:** `https://dr-dietician-backend.onrender.com/api`  
> **Local URL:** `http://localhost:5000/api`  
> **Auth:** All intern routes require `Authorization: Bearer <token>` header  
> **Swagger UI:** `/api/docs`

---

## Authentication

All requests to `/intern/*` routes must include the JWT token received after login.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1. Browse Available Courses

### GET `/intern/courses`

Browse all active courses. Response includes eligibility and enrollment status for the logged-in intern.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Search by title or category |
| `category` | string | Filter by category |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "Courses fetched successfully",
  "data": {
    "items": [
      {
        "id": "course_id",
        "title": "Clinical Nutrition Fundamentals",
        "description": "Learn core nutrition concepts",
        "thumbnailUrl": null,
        "category": "Nutrition",
        "instructor": "Dr. Smith",
        "duration": "4 weeks",
        "minSemester": 3,
        "minYear": 2,
        "hasFinalTest": true,
        "isActive": true,
        "totalLessons": 8,
        "createdAt": "2026-07-01T00:00:00.000Z",
        "updatedAt": "2026-07-01T00:00:00.000Z",
        "_count": {
          "lessons": 8,
          "enrollments": 12
        },
        "isEnrolled": false,
        "enrollmentStatus": null,
        "progress": 0,
        "isEligible": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 5,
      "totalPages": 1
    }
  }
}
```

**Key fields:**
- `isEligible` — `false` if intern's semester/year is below the course minimum. Show a lock or disabled state.
- `isEnrolled` — `true` if already enrolled. Show "Continue" instead of "Enroll".
- `enrollmentStatus` — `ENROLLED` | `IN_PROGRESS` | `COMPLETED` | `FAILED` | `null`
- `progress` — 0–100 percentage

---

## 2. Enroll in Course

### POST `/intern/courses/:courseId/enroll`

Enroll in a course. Automatically creates lesson progress records for every active lesson.

**No request body needed.**

**Response:**
```json
{
  "success": true,
  "message": "Enrolled in course successfully",
  "data": {
    "id": "enrollment_id",
    "internId": "intern_id",
    "courseId": "course_id",
    "status": "ENROLLED",
    "progress": 0,
    "enrolledAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T10:00:00.000Z",
    "course": {
      "id": "course_id",
      "title": "Clinical Nutrition Fundamentals",
      "totalLessons": 8
    },
    "lessonProgress": [
      { "id": "lp_id", "lessonId": "lesson_id_1", "isCompleted": false, "completedAt": null },
      { "id": "lp_id", "lessonId": "lesson_id_2", "isCompleted": false, "completedAt": null }
    ]
  }
}
```

**Errors:**
- `400` — Already enrolled in this course
- `400` — Minimum semester/year requirement not met

---

## 3. My Enrollments

### GET `/intern/courses/my-enrollments`

Get all courses the intern has enrolled in.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | string | `ENROLLED` \| `IN_PROGRESS` \| `COMPLETED` \| `FAILED` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "My enrollments fetched successfully",
  "data": {
    "items": [
      {
        "id": "enrollment_id",
        "internId": "intern_id",
        "courseId": "course_id",
        "status": "IN_PROGRESS",
        "progress": 62,
        "enrolledAt": "2026-07-10T00:00:00.000Z",
        "completedAt": null,
        "updatedAt": "2026-08-13T00:00:00.000Z",
        "course": {
          "id": "course_id",
          "title": "Clinical Nutrition Fundamentals",
          "description": "...",
          "category": "Nutrition",
          "instructor": "Dr. Smith",
          "duration": "4 weeks",
          "hasFinalTest": true,
          "totalLessons": 8,
          "lessons": [
            {
              "id": "lesson_id_1",
              "title": "Introduction to Macronutrients",
              "order": 1,
              "durationMin": 15,
              "isActive": true
            }
          ]
        },
        "lessonProgress": [
          { "lessonId": "lesson_id_1", "isCompleted": true, "completedAt": "2026-07-11T00:00:00.000Z" },
          { "lessonId": "lesson_id_2", "isCompleted": false, "completedAt": null }
        ]
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 2, "totalPages": 1 }
  }
}
```

---

## 4. Course Detail with My Progress

### GET `/intern/courses/:courseId/progress`

Get full course content with the intern's lesson-by-lesson progress merged in.

**Response:**
```json
{
  "success": true,
  "message": "Course progress fetched successfully",
  "data": {
    "id": "enrollment_id",
    "status": "IN_PROGRESS",
    "progress": 50,
    "enrolledAt": "2026-07-10T00:00:00.000Z",
    "completedAt": null,
    "course": {
      "id": "course_id",
      "title": "Clinical Nutrition Fundamentals",
      "description": "...",
      "hasFinalTest": true,
      "totalLessons": 8,
      "lessons": [
        {
          "id": "lesson_id_1",
          "title": "Introduction to Macronutrients",
          "content": "Full lesson text content here...",
          "videoUrl": "https://youtube.com/...",
          "fileUrl": "/uploads/digital-products/files/lesson1.pdf",
          "order": 1,
          "durationMin": 15,
          "isCompleted": true,
          "completedAt": "2026-07-11T10:00:00.000Z"
        },
        {
          "id": "lesson_id_2",
          "title": "Understanding Micronutrients",
          "content": "...",
          "videoUrl": null,
          "fileUrl": null,
          "order": 2,
          "durationMin": 20,
          "isCompleted": false,
          "completedAt": null
        }
      ]
    },
    "lessonProgress": [...]
  }
}
```

**Key fields per lesson:**
- `isCompleted` — already merged, use this directly to show tick/lock
- `content` — text/HTML content of the lesson
- `videoUrl` — optional video link
- `fileUrl` — optional downloadable file

---

## 5. Mark Lesson Complete

### PATCH `/intern/courses/:courseId/lessons/:lessonId/complete`

Mark a single lesson as done. Progress percentage auto-recalculates.

**No request body needed.**

**Response:**
```json
{
  "success": true,
  "message": "Lesson marked as completed",
  "data": {
    "lessonId": "lesson_id_2",
    "isCompleted": true,
    "progress": 62,
    "status": "IN_PROGRESS"
  }
}
```

**Status transitions:**
- `ENROLLED` → `IN_PROGRESS` (first lesson completed)
- `IN_PROGRESS` → `COMPLETED` (all lessons done + no final test)
- `IN_PROGRESS` → stays `IN_PROGRESS` (all lessons done + has final test, until test submitted)

---

## 6. Submit Final Test Result

### PATCH `/intern/courses/:courseId/final-test`

Submit pass/fail result for the course final test. Only available after progress reaches 100%.

**Request Body:**
```json
{
  "passed": true
}
```

> `passed` is required — `true` or `false`.

**Response:**
```json
{
  "success": true,
  "message": "Final test passed",
  "data": {
    "courseId": "course_id",
    "passed": true,
    "status": "COMPLETED",
    "completedAt": "2026-08-13T12:00:00.000Z"
  }
}
```

**Errors:**
- `400` — `passed` field missing
- `400` — This course has no final test
- `400` — Complete all lessons before taking the final test

---

## Enrollment Status Reference

| Status | Meaning | UI hint |
|---|---|---|
| `ENROLLED` | Enrolled, not started | Show "Start Course" |
| `IN_PROGRESS` | At least one lesson done | Show progress bar |
| `COMPLETED` | All done (and test passed if applicable) | Show certificate/badge |
| `FAILED` | Final test failed | Show "Retry Test" |

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status | Meaning |
|---|---|
| `400` | Validation error / business rule violation |
| `401` | Missing or invalid JWT token |
| `403` | Access denied (not an intern) |
| `404` | Course not found |
