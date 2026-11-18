# DrDiet Admin API — Complete Reference

## Base URL
```
https://dr-dietician-backend.onrender.com/api
```

## Authentication
All admin endpoints require:
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

Get admin token:
```http
POST /auth/login
{ "email": "admin@drdiettherapy.com", "password": "12345678" }
```

---

## Quick Reference — All Admin Endpoints

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/admin/dashboard/summary` | Dashboard summary |
| 2 | POST | `/admin/patients` | Create patient |
| 3 | GET | `/admin/patients` | Get all patients |
| 4 | GET | `/admin/patients/:id` | Get single patient |
| 5 | PUT | `/admin/patients/:id` | Update patient |
| 6 | DELETE | `/admin/patients/:id` | Delete patient |
| 7 | POST | `/admin/doctors` | Create doctor |
| 8 | GET | `/admin/doctors` | Get all doctors |
| 9 | GET | `/admin/doctors/:id` | Get single doctor |
| 10 | PUT | `/admin/doctors/:id` | Update doctor |
| 11 | PATCH | `/admin/doctors/:id/approve` | Approve doctor |
| 12 | PATCH | `/admin/doctors/:id/status` | Enable/disable doctor |
| 13 | DELETE | `/admin/doctors/:id` | Delete doctor |
| 14 | POST | `/admin/interns` | Create intern |
| 15 | GET | `/admin/interns/summary` | Interns summary stats |
| 16 | GET | `/admin/interns` | Get all interns |
| 17 | GET | `/admin/interns/:id` | Get single intern |
| 18 | PUT | `/admin/interns/:id` | Update intern |
| 19 | DELETE | `/admin/interns/:id` | Delete intern |
| 20 | GET | `/admin/appointments/summary` | Appointments summary |
| 21 | GET | `/admin/appointments` | Get all appointments |
| 22 | GET | `/admin/appointments/:id` | Get single appointment |
| 23 | PATCH | `/admin/appointments/:id/status` | Update appointment status |
| 24 | DELETE | `/admin/appointments/:id` | Delete appointment |
| 25 | POST | `/admin/packages` | Create package |
| 26 | GET | `/admin/packages` | Get all packages |
| 27 | GET | `/admin/packages/:id` | Get single package |
| 28 | PUT | `/admin/packages/:id` | Update package |
| 29 | PATCH | `/admin/packages/:id/status` | Toggle package active/inactive |
| 30 | DELETE | `/admin/packages/:id` | Delete package |
| 31 | POST | `/admin/digital-products` | Create digital product |
| 32 | GET | `/admin/digital-products` | Get all digital products |
| 33 | GET | `/admin/digital-products/:id` | Get single digital product |
| 34 | PUT | `/admin/digital-products/:id` | Update digital product |
| 35 | PATCH | `/admin/digital-products/:id/status` | Change product status |
| 36 | DELETE | `/admin/digital-products/:id` | Delete digital product |
| 37 | POST | `/admin/courses` | Create course |
| 38 | GET | `/admin/courses` | Get all courses |
| 39 | GET | `/admin/courses/:id` | Get course with lessons |
| 40 | PUT | `/admin/courses/:id` | Update course |
| 41 | DELETE | `/admin/courses/:id` | Delete course |
| 42 | POST | `/admin/courses/:courseId/lessons` | Add lesson to course |
| 43 | PUT | `/admin/courses/lessons/:lessonId` | Update lesson |
| 44 | DELETE | `/admin/courses/lessons/:lessonId` | Delete lesson |
| 45 | GET | `/admin/courses/:courseId/enrollments` | View course enrollments |
| 46 | GET | `/admin/revenue/summary` | Revenue dashboard |
| 47 | GET | `/admin/revenue/orders` | All orders |

---

# 1. DASHBOARD

## GET /admin/dashboard/summary

```http
GET https://dr-dietician-backend.onrender.com/api/admin/dashboard/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPatients": 12,
    "totalDoctors": 4,
    "pendingDoctors": 2,
    "totalInterns": 6
  }
}
```

---

# 2. PATIENTS

## POST /admin/patients — Create Patient

```json
// Request Body (password auto-generated)
{
  "fullName": "Sarah Jenkins",
  "email": "sarah@example.com",
  "gender": "FEMALE",
  "location": "Chicago",
  "phoneNumber": "9876543210",
  "whatsappNumber": "9876543210",
  "age": 29,
  "heightCm": 165,
  "weightKg": 58,
  "bloodGroup": "A_POS",
  "socialHandle": "@sarah",
  "isDefencePersonnel": false
}

// Response includes generatedPassword — share with patient!
```

## GET /admin/patients — List with Filters

```
?page=1&limit=10
?search=john               (name, email, phone)
?status=ACTIVE             (ACTIVE | INACTIVE | SUSPENDED | PENDING_APPROVAL)
?bloodGroup=A_POS          (A_POS | A_NEG | B_POS | B_NEG | AB_POS | AB_NEG | O_POS | O_NEG)
?gender=MALE               (MALE | FEMALE | OTHER | PREFER_NOT_TO_SAY)
?location=Chicago
?isDefencePersonnel=true
?minAge=18&maxAge=45
```

## GET /admin/patients/:id — Single Patient

## PUT /admin/patients/:id — Update Patient

```json
// All fields optional
{
  "fullName": "Sarah Updated",
  "email": "new@email.com",
  "accountStatus": "ACTIVE",
  "patientProfile": {
    "phoneNumber": "9999999999",
    "location": "New York",
    "age": 30,
    "weightKg": 60,
    "bloodGroup": "O_POS"
  }
}
```

## DELETE /admin/patients/:id — Delete Patient

---

# 3. DOCTORS

## POST /admin/doctors — Create Doctor

```json
{
  "fullName": "Dr. John Smith",
  "email": "dr.smith@example.com",
  "phoneNumber": "9876543210",
  "specialization": "Nutrition",
  "qualification": "MBBS, MD",
  "licenseNumber": "LIC123456",
  "yearsOfExperience": 8,
  "hospitalName": "City Hospital",
  "clinicAddress": "123 Main Street"
}
// Response includes generatedPassword!
```

## GET /admin/doctors — List with Filters

```
?search=smith
?status=ACTIVE
?isApproved=true
?specialization=Nutrition
?hospital=City Hospital
?minExperience=5&maxExperience=15
?page=1&limit=10
```

## GET /admin/doctors/:id — Single Doctor

## PUT /admin/doctors/:id — Update Doctor

```json
{
  "fullName": "Dr. Updated Name",
  "accountStatus": "ACTIVE",
  "doctorProfile": {
    "specialization": "Clinical Nutrition",
    "yearsOfExperience": 10,
    "isApproved": true
  }
}
```

## PATCH /admin/doctors/:id/approve — Approve Doctor

No request body needed.

## PATCH /admin/doctors/:id/status — Enable/Disable

```json
{ "status": "ACTIVE" }      // Enable
{ "status": "INACTIVE" }    // Disable
{ "status": "SUSPENDED" }   // Suspend
```

## DELETE /admin/doctors/:id — Delete Doctor

---

# 4. INTERNS

## GET /admin/interns/summary — Summary Stats

```json
{
  "data": {
    "totalInterns": 5,
    "approved": 2,
    "pending": 2,
    "completedCourses": 0
  }
}
```

## POST /admin/interns — Create Intern

```json
{
  "fullName": "Jane Doe",
  "email": "jane@uni.edu",
  "phoneNumber": "1234567890",
  "universityName": "AIIMS Delhi",
  "specialization": "M.Sc Dietetics",
  "semester": 4,
  "year": 2023
}
// Response includes generatedPassword!
```

## GET /admin/interns — List with Filters

```
?search=neha
?status=ACTIVE
?isApproved=true
?university=AIIMS
?specialization=Dietetics
?semester=4
?year=2023
?minSemester=3&maxSemester=6
?page=1&limit=10
```

## GET /admin/interns/:id — Single Intern

## PUT /admin/interns/:id — Update Intern

```json
{
  "fullName": "Jane Updated",
  "accountStatus": "ACTIVE",
  "internProfile": {
    "semester": 5,
    "isApproved": true
  }
}
```

## DELETE /admin/interns/:id — Delete Intern

---

# 5. APPOINTMENTS

## GET /admin/appointments/summary — Summary Stats

```json
{
  "data": {
    "total": 50,
    "today": 5,
    "pending": 12,
    "confirmed": 18,
    "completed": 15,
    "cancelled": 5
  }
}
```

## GET /admin/appointments — List with Filters

```
?status=CONFIRMED          (PENDING | CONFIRMED | COMPLETED | CANCELLED)
?type=ONLINE               (ONLINE | IN_PERSON)
?search=john               (patient or doctor name)
?doctorId=doctor_id
?patientId=patient_id
?today=true
?fromDate=2026-07-01&toDate=2026-07-31
?page=1&limit=10
```

## GET /admin/appointments/:id — Single Appointment

## PATCH /admin/appointments/:id/status — Update Status

```json
{ "status": "CONFIRMED" }
{ "status": "COMPLETED" }
{ "status": "CANCELLED" }
```

## DELETE /admin/appointments/:id — Delete Appointment

---

# 6. PACKAGES

## POST /admin/packages — Create Package

```json
{
  "name": "Thyroid Management",
  "category": "Thyroid",
  "description": "Specialized diet plan for thyroid health",
  "price1Month": 1299,
  "price3Months": 5499,
  "price6Months": 9999,
  "features": ["Weekly diet plan", "Blood report review", "Monthly consultation"],
  "isActive": true
}
```

## GET /admin/packages — List with Filters

```
?search=thyroid
?category=Diabetes
?isActive=true
?page=1&limit=10
```

## GET /admin/packages/:id — Single Package

## PUT /admin/packages/:id — Update Package

All fields optional — partial update.

## PATCH /admin/packages/:id/status — Toggle Active

```json
{ "isActive": false }   // Deactivate
{ "isActive": true }    // Activate
```

## DELETE /admin/packages/:id — Delete Package

---

# 7. DIGITAL PRODUCTS

## Upload Flow (do this first)

```
1. POST /upload/digital-product/file      → returns fileUrl
2. POST /upload/digital-product/thumbnail → returns thumbnailUrl
3. POST /admin/digital-products           → use both URLs
```

## POST /admin/digital-products — Create

```json
{
  "title": "Thyroid Diet Guide",
  "category": "Thyroid",
  "status": "PUBLISHED",
  "price": 299,
  "description": "Complete guide for thyroid patients",
  "fileUrl": "/uploads/digital-products/files/dp-file-123.pdf",
  "thumbnailUrl": "/uploads/digital-products/thumbnails/dp-thumb-123.png",
  "author": "Dr. Smith",
  "pageCount": 45,
  "language": "English",
  "isFree": false
}
```

## GET /admin/digital-products — List with Filters

```
?search=thyroid
?category=Diabetes
?status=PUBLISHED          (DRAFT | PUBLISHED | UNPUBLISHED)
?isFree=true
?language=Hindi
?minPrice=100&maxPrice=500
?page=1&limit=10
```

## GET /admin/digital-products/:id — Single Product

## PUT /admin/digital-products/:id — Update (all optional)

## PATCH /admin/digital-products/:id/status — Change Status

```json
{ "status": "PUBLISHED" }
{ "status": "DRAFT" }
{ "status": "UNPUBLISHED" }
```

## DELETE /admin/digital-products/:id — Delete

---

# 8. COURSES

## POST /admin/courses — Create Course

```json
{
  "title": "Clinical Nutrition Fundamentals",
  "description": "Comprehensive course for interns",
  "category": "Clinical Nutrition",
  "instructor": "Dr. Smith",
  "duration": "4 weeks",
  "minSemester": 3,
  "minYear": 2022,
  "hasFinalTest": true,
  "isActive": true
}
```

## GET /admin/courses — List with Filters

```
?search=nutrition
?category=Clinical
?isActive=true
?hasFinalTest=true
?page=1&limit=10
```

**Response includes:**
- `totalLessons` — count of lessons
- `completedCount` — interns who completed
- `_count.enrollments` — total enrolled interns

## GET /admin/courses/:id — Course with All Lessons

## PUT /admin/courses/:id — Update Course

## DELETE /admin/courses/:id — Delete Course (cascades lessons + enrollments)

## POST /admin/courses/:courseId/lessons — Add Lesson

```json
{
  "title": "Introduction to Macronutrients",
  "content": "Text or HTML content...",
  "videoUrl": "https://youtube.com/watch?v=example",
  "fileUrl": "/uploads/lesson1.pdf",
  "order": 1,
  "durationMin": 30,
  "isActive": true
}
// order is auto-assigned if not provided
```

## PUT /admin/courses/lessons/:lessonId — Update Lesson

```json
{
  "title": "Updated Title",
  "videoUrl": "https://youtube.com/new-link",
  "durationMin": 35
}
```

## DELETE /admin/courses/lessons/:lessonId — Delete Lesson

Auto-decrements `totalLessons` on the course.

## GET /admin/courses/:courseId/enrollments — View Enrolled Interns

```
?status=IN_PROGRESS        (ENROLLED | IN_PROGRESS | COMPLETED | FAILED)
?page=1&limit=10
```

**Response includes:**
- Intern profile details
- Per-lesson completion status
- Overall progress percentage

---

# 9. REVENUE

## GET /admin/revenue/summary — Revenue Dashboard

```json
{
  "data": {
    "summary": {
      "totalRevenue": 124500,
      "thisMonth": 18200,
      "thisWeek": 4500,
      "totalOrders": 89
    },
    "breakdown": {
      "packages": { "revenue": 68000, "percentage": 54.6 },
      "digitalProducts": { "revenue": 32000, "percentage": 25.7 }
    },
    "recentTransactions": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemName": "Thyroid Management - 1 Month",
        "amount": 1299,
        "paidAt": "2026-07-18T10:00:00.000Z",
        "patient": {
          "fullName": "Sarah Jenkins",
          "email": "sarah@example.com"
        }
      }
    ]
  }
}
```

## GET /admin/revenue/orders — All Transactions

```
?status=PAID               (PENDING | PAID | FAILED | REFUNDED)
?itemType=PACKAGE          (PACKAGE | DIGITAL_PRODUCT)
?fromDate=2026-07-01&toDate=2026-07-31
?page=1&limit=10
```

---

# ENUM REFERENCE

## Account Status
| Value | Description |
|-------|-------------|
| `ACTIVE` | Account is active |
| `INACTIVE` | Account disabled |
| `SUSPENDED` | Account suspended |
| `PENDING_APPROVAL` | Awaiting admin approval |

## Blood Group
`A_POS` `A_NEG` `B_POS` `B_NEG` `AB_POS` `AB_NEG` `O_POS` `O_NEG`

## Gender
`MALE` `FEMALE` `OTHER` `PREFER_NOT_TO_SAY`

## Appointment Status
`PENDING` `CONFIRMED` `COMPLETED` `CANCELLED`

## Appointment Type
`ONLINE` `IN_PERSON`

## Digital Product Status
`DRAFT` `PUBLISHED` `UNPUBLISHED`

## Enrollment Status
`ENROLLED` `IN_PROGRESS` `COMPLETED` `FAILED`

## Order Status
`PENDING` `PAID` `FAILED` `REFUNDED`

## Package Duration
`ONE_MONTH` `THREE_MONTHS` `SIX_MONTHS`

---

# TWO WAYS TO CREATE USERS

| Feature | Self-Registration | Admin Creates |
|---------|------------------|---------------|
| Patient | `POST /auth/register/patient` | `POST /admin/patients` |
| Doctor | `POST /auth/register/doctor` | `POST /admin/doctors` |
| Intern | `POST /auth/register/intern` | `POST /admin/interns` |
| Password | User provides | **Auto-generated** — shown in response once |
| Status | Varies | ACTIVE (auto-approved) |
