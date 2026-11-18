# Intern Panel — Frontend API Reference

> **Base URL (Production):** `https://dr-dietician-backend.onrender.com/api`
> **Base URL (Local):** `http://localhost:5000/api`
> **Swagger UI:** `/api/docs`

## Authentication

Every request must include the JWT token from login:

```
Authorization: Bearer <token>
```

---

## Quick Reference — All Intern Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/intern/courses` | Browse all available courses |
| GET | `/intern/courses/my-enrollments` | My enrolled courses |
| POST | `/intern/courses/:courseId/enroll` | Enroll in a course |
| GET | `/intern/courses/:courseId/progress` | Course detail with my progress |
| PATCH | `/intern/courses/:courseId/lessons/:lessonId/complete` | Mark lesson complete |
| PATCH | `/intern/courses/:courseId/final-test` | Submit final test result |

---

## 1. Browse Available Courses

### GET `/intern/courses`

All active courses with eligibility and enrollment status merged for the logged-in intern.

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
    "pagination": { "page": 1, "limit": 10, "totalItems": 5, "totalPages": 1 }
  }
}
```

**Key fields:**
- `isEligible` — `false` if intern's semester/year is below the minimum. Show lock/disabled state.
- `isEnrolled` — `true` if already enrolled. Show "Continue" instead of "Enroll".
- `enrollmentStatus` — `ENROLLED` | `IN_PROGRESS` | `COMPLETED` | `FAILED` | `null`
- `progress` — 0–100 percentage
- `hasFinalTest` — `true` means a final test must be passed to complete the course

---

## 2. Enroll in a Course

### POST `/intern/courses/:courseId/enroll`

No request body needed. Automatically creates progress records for every active lesson.

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
      { "id": "lp_1", "lessonId": "lesson_id_1", "isCompleted": false, "completedAt": null },
      { "id": "lp_2", "lessonId": "lesson_id_2", "isCompleted": false, "completedAt": null }
    ]
  }
}
```

**Errors:**
- `400` — Already enrolled in this course
- `400` — Minimum semester X required / Minimum year X required

---

## 3. My Enrolled Courses

### GET `/intern/courses/my-enrollments`

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
            { "id": "lesson_id_1", "title": "Introduction to Macronutrients", "order": 1, "durationMin": 15 },
            { "id": "lesson_id_2", "title": "Understanding Micronutrients", "order": 2, "durationMin": 20 }
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

Full course content with lesson completion merged in. Use this for the course player screen.

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
          "content": "Full lesson text or HTML here...",
          "videoUrl": "https://youtube.com/watch?v=example",
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
    }
  }
}
```

**Key lesson fields:**
- `isCompleted` — already merged, use directly for tick / lock UI
- `content` — lesson text or HTML
- `videoUrl` — optional embed link
- `fileUrl` — optional downloadable PDF

> Returns `400` if intern is not enrolled in this course.

---

## 5. Mark Lesson Complete

### PATCH `/intern/courses/:courseId/lessons/:lessonId/complete`

No request body needed. Progress recalculates automatically.

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

**Progress → Status transitions:**
- First lesson done → `ENROLLED` becomes `IN_PROGRESS`
- All lessons done + no final test → `IN_PROGRESS` becomes `COMPLETED`
- All lessons done + has final test → stays `IN_PROGRESS` until final test submitted

---

## 6. Submit Final Test Result

### PATCH `/intern/courses/:courseId/final-test`

Must complete all lessons first. Only for courses where `hasFinalTest: true`.

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
- `400` — `passed` field is required
- `400` — This course has no final test
- `400` — Complete all lessons before taking the final test

---

## Enrollment Status Reference

| Status | Meaning | UI hint |
|---|---|---|
| `ENROLLED` | Enrolled, not started | Show "Start Course" button |
| `IN_PROGRESS` | At least one lesson done | Show progress bar + "Continue" |
| `COMPLETED` | All done (and test passed if applicable) | Show badge / certificate |
| `FAILED` | Final test failed | Show "Retry Test" |

---

## Error Format

```json
{ "success": false, "message": "Error description" }
```

| Code | Meaning |
|---|---|
| `400` | Validation / business rule |
| `401` | Missing or invalid token |
| `403` | Not an intern |
| `404` | Course not found |
