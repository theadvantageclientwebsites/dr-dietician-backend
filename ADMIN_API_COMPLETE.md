# Admin Panel — Frontend API Reference

> **Base URL (Production):** `https://dr-dietician-backend.onrender.com/api`
> **Base URL (Local):** `http://localhost:5000/api`
> **Swagger UI:** `/api/docs`

## Authentication

```http
POST /auth/login
Content-Type: application/json

{ "email": "admin@drdiettherapy.com", "password": "12345678" }
```

All admin requests need:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Quick Reference — All Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard/summary` | Dashboard summary stats |
| POST | `/admin/patients` | Create patient |
| GET | `/admin/patients` | List patients |
| GET | `/admin/patients/:id` | Single patient |
| PUT | `/admin/patients/:id` | Update patient |
| DELETE | `/admin/patients/:id` | Delete patient |
| POST | `/admin/doctors` | Create doctor |
| GET | `/admin/doctors` | List doctors |
| GET | `/admin/doctors/:id` | Single doctor |
| PUT | `/admin/doctors/:id` | Update doctor |
| PATCH | `/admin/doctors/:id/approve` | Approve doctor |
| PATCH | `/admin/doctors/:id/status` | Enable / disable doctor |
| DELETE | `/admin/doctors/:id` | Delete doctor |
| GET | `/admin/interns/summary` | Interns summary stats |
| POST | `/admin/interns` | Create intern |
| GET | `/admin/interns` | List interns |
| GET | `/admin/interns/:id` | Single intern |
| PUT | `/admin/interns/:id` | Update intern |
| DELETE | `/admin/interns/:id` | Delete intern |
| GET | `/admin/appointments/summary` | Appointments summary |
| GET | `/admin/appointments` | List appointments |
| GET | `/admin/appointments/:id` | Single appointment |
| PATCH | `/admin/appointments/:id/status` | Update appointment status |
| DELETE | `/admin/appointments/:id` | Delete appointment |
| POST | `/admin/packages` | Create package |
| GET | `/admin/packages` | List packages |
| GET | `/admin/packages/:id` | Single package |
| PUT | `/admin/packages/:id` | Update package |
| PATCH | `/admin/packages/:id/status` | Toggle active/inactive |
| DELETE | `/admin/packages/:id` | Delete package |
| GET | `/admin/subscriptions` | List package subscriptions |
| GET | `/admin/subscriptions/:id` | Single subscription |
| PATCH | `/admin/subscriptions/:id/assign-doctor` | Assign doctor to subscription |
| GET | `/admin/diet-plans` | List diet plans |
| GET | `/admin/diet-plans/:id` | Single diet plan |
| PATCH | `/admin/diet-plans/:id/approve` | Approve diet plan |
| PATCH | `/admin/diet-plans/:id/reject` | Reject diet plan |
| POST | `/admin/services` | Create service |
| GET | `/admin/services` | List services |
| GET | `/admin/services/:id` | Single service |
| PUT | `/admin/services/:id` | Update service (price, name, etc.) |
| PATCH | `/admin/services/:id/status` | Toggle active/inactive |
| DELETE | `/admin/services/:id` | Delete service |
| GET | `/admin/services/bookings` | List service bookings |
| GET | `/admin/services/bookings/:id` | Single service booking |
| PATCH | `/admin/services/bookings/:id/assign-doctor` | Reassign doctor |
| POST | `/admin/digital-products` | Create digital product |
| GET | `/admin/digital-products` | List digital products |
| GET | `/admin/digital-products/:id` | Single product |
| PUT | `/admin/digital-products/:id` | Update product |
| PATCH | `/admin/digital-products/:id/status` | Change publish status |
| DELETE | `/admin/digital-products/:id` | Delete product |
| POST | `/admin/courses` | Create course |
| GET | `/admin/courses` | List courses |
| GET | `/admin/courses/:id` | Course with all lessons |
| PUT | `/admin/courses/:id` | Update course |
| DELETE | `/admin/courses/:id` | Delete course |
| POST | `/admin/courses/:courseId/lessons` | Add lesson |
| PUT | `/admin/courses/lessons/:lessonId` | Update lesson |
| DELETE | `/admin/courses/lessons/:lessonId` | Delete lesson |
| GET | `/admin/courses/:courseId/enrollments` | View enrolled interns |
| GET | `/admin/revenue/summary` | Revenue dashboard |
| GET | `/admin/revenue/orders` | All orders |

---

## 1. Dashboard

### GET `/admin/dashboard/summary`

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

## 2. Patients

### POST `/admin/patients`

Password is auto-generated — share it with the patient.

**Request Body:**
```json
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
```

**Response includes `generatedPassword` — show it once and tell admin to share it.**

---

### GET `/admin/patients`

**Query Params:**

| Param | Description |
|---|---|
| `search` | Name, email, or phone |
| `status` | `ACTIVE` \| `INACTIVE` \| `SUSPENDED` \| `PENDING_APPROVAL` |
| `bloodGroup` | `A_POS` \| `A_NEG` \| `B_POS` \| `B_NEG` \| `AB_POS` \| `AB_NEG` \| `O_POS` \| `O_NEG` |
| `gender` | `MALE` \| `FEMALE` \| `OTHER` \| `PREFER_NOT_TO_SAY` |
| `location` | Filter by city |
| `isDefencePersonnel` | `true` \| `false` |
| `minAge` / `maxAge` | Age range |
| `page` / `limit` | Pagination |

---

### GET `/admin/patients/:id` — Single patient

### PUT `/admin/patients/:id` — Update patient

```json
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

### DELETE `/admin/patients/:id`

---

## 3. Doctors

### POST `/admin/doctors`

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
```

**Response includes `generatedPassword`.**

---

### GET `/admin/doctors`

**Query Params:** `search`, `status`, `isApproved` (`true`/`false`), `specialization`, `hospital`, `minExperience`, `maxExperience`, `page`, `limit`

---

### GET `/admin/doctors/:id` — Single doctor

### PUT `/admin/doctors/:id` — Update doctor

```json
{
  "fullName": "Dr. Updated",
  "accountStatus": "ACTIVE",
  "doctorProfile": {
    "specialization": "Clinical Nutrition",
    "yearsOfExperience": 10
  }
}
```

### PATCH `/admin/doctors/:id/approve` — No request body needed

### PATCH `/admin/doctors/:id/status`

```json
{ "status": "ACTIVE" }
{ "status": "INACTIVE" }
{ "status": "SUSPENDED" }
```

### DELETE `/admin/doctors/:id`

---

## 4. Interns

### GET `/admin/interns/summary`

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

### POST `/admin/interns`

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
```

**Response includes `generatedPassword`.**

### GET `/admin/interns`

**Query Params:** `search`, `status`, `isApproved`, `university`, `specialization`, `semester`, `year`, `minSemester`, `maxSemester`, `page`, `limit`

### GET `/admin/interns/:id` — Single intern

### PUT `/admin/interns/:id`

```json
{
  "fullName": "Jane Updated",
  "accountStatus": "ACTIVE",
  "internProfile": { "semester": 5, "isApproved": true }
}
```

### DELETE `/admin/interns/:id`

---

## 5. Appointments

### GET `/admin/appointments/summary`

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

### GET `/admin/appointments`

**Query Params:** `status`, `type`, `search` (patient or doctor name), `doctorId`, `patientId`, `today` (`true`), `fromDate`, `toDate`, `page`, `limit`

### GET `/admin/appointments/:id` — Single appointment

### PATCH `/admin/appointments/:id/status`

```json
{ "status": "CONFIRMED" }
{ "status": "COMPLETED" }
{ "status": "CANCELLED" }
```

### DELETE `/admin/appointments/:id`

---

## 6. Packages

### POST `/admin/packages`

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

### GET `/admin/packages`

**Query Params:** `search`, `category`, `isActive`, `page`, `limit`

### GET `/admin/packages/:id` — Single package

### PUT `/admin/packages/:id` — Update (all fields optional)

### PATCH `/admin/packages/:id/status`

```json
{ "isActive": false }
{ "isActive": true }
```

### DELETE `/admin/packages/:id`

---

## 7. Subscriptions (Package Purchases)

A subscription is created when a patient buys a package. Admin must assign a doctor before the patient's diet plan can be prepared.

### GET `/admin/subscriptions`

**Query Params:**

| Param | Description |
|---|---|
| `status` | `PENDING_ASSIGNMENT` \| `ACTIVE` \| `EXPIRED` \| `CANCELLED` |
| `packageId` | Filter by package |
| `doctorId` | Filter by assigned doctor |
| `search` | Patient name, email, or package name |
| `page` / `limit` | Pagination |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sub_id",
        "status": "PENDING_ASSIGNMENT",
        "duration": "THREE_MONTHS",
        "paidAmount": 5499,
        "assignedAt": null,
        "endsAt": "2026-11-13T00:00:00.000Z",
        "createdAt": "2026-08-13T10:00:00.000Z",
        "patient": {
          "id": "patient_id",
          "fullName": "John Doe",
          "email": "john@example.com",
          "profilePhotoUrl": null,
          "patientProfile": { "phoneNumber": "9876543210", "age": 25, "gender": "MALE" }
        },
        "package": { "id": "pkg_id", "name": "Thyroid Management", "category": "Thyroid" },
        "doctor": null
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 5, "totalPages": 1 }
  }
}
```

---

### GET `/admin/subscriptions/:id` — Single subscription with full patient details

---

### PATCH `/admin/subscriptions/:id/assign-doctor`

Assigns a doctor and activates the subscription. This triggers the diet plan countdown (doctor has 24 hours to submit).

**Request Body:**
```json
{ "doctorId": "doctor_id" }
```

**Response:** Updated subscription with `status: "ACTIVE"` and `assignedAt` set.

**Errors:**
- `400` — doctorId is required
- `400` — Doctor is not approved yet
- `400` — Cannot assign to a cancelled / expired package

---

## 8. Diet Plans

Admin approves or rejects diet plans submitted by doctors. Patients can only see their plan after admin approves.

### GET `/admin/diet-plans`

**Query Params:**

| Param | Description |
|---|---|
| `status` | `DRAFT` \| `PENDING_APPROVAL` \| `APPROVED` \| `REJECTED` |
| `doctorId` | Filter by doctor |
| `patientId` | Filter by patient |
| `search` | Patient or doctor name |
| `page` / `limit` | Pagination |

> Use `status=PENDING_APPROVAL` for the approval queue.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "plan_id",
        "duration": "SEVEN_DAYS",
        "durationDays": 7,
        "calorieTarget": 1800,
        "foodsToEat": ["Oats", "Brown rice"],
        "foodsToAvoid": ["Refined sugar"],
        "breakfast": { "time": "8:00 AM", "items": ["Oatmeal"], "calories": 350 },
        "lunch": { "time": "1:00 PM", "items": ["Brown rice", "Dal"], "calories": 600 },
        "dinner": { "time": "7:30 PM", "items": ["Roti", "Sabzi"], "calories": 500 },
        "snacks": { "morning": ["Almonds"], "evening": ["Fruit"] },
        "notes": "Avoid eating after 8 PM",
        "status": "PENDING_APPROVAL",
        "submittedAt": "2026-08-13T11:00:00.000Z",
        "approvedAt": null,
        "rejectedAt": null,
        "rejectionReason": null,
        "dueAt": "2026-08-14T10:00:00.000Z",
        "isOverdue": false,
        "patient": { "id": "patient_id", "fullName": "John Doe", "email": "john@example.com" },
        "doctor": { "id": "doctor_id", "fullName": "Dr. John Smith", "doctorProfile": { "specialization": "Nutrition" } },
        "subscription": {
          "id": "sub_id",
          "status": "ACTIVE",
          "assignedAt": "2026-08-13T10:00:00.000Z",
          "endsAt": "2026-11-13T00:00:00.000Z",
          "package": { "name": "Thyroid Management", "category": "Thyroid" }
        }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 3, "totalPages": 1 }
  }
}
```

---

### GET `/admin/diet-plans/:id` — Single plan (same shape)

---

### PATCH `/admin/diet-plans/:id/approve`

No request body needed. Patient will immediately be able to see the plan.

**Response:** Plan with `status: "APPROVED"` and `approvedAt` set.

---

### PATCH `/admin/diet-plans/:id/reject`

Doctor can edit and resubmit after rejection.

**Request Body:**
```json
{ "reason": "Calorie target is too low for this patient's weight. Please revise." }
```

> `reason` optional — defaults to "Please update the plan".

**Response:** Plan with `status: "REJECTED"` and `rejectionReason` set.

---

## 9. Services

Two service types: `ONE_ON_ONE_CONSULTATION` (60 min, ₹799) and `LAB_REPORT_ANALYSIS` (₹499). These are pre-seeded — admin can update prices here.

### POST `/admin/services`

```json
{
  "type": "ONE_ON_ONE_CONSULTATION",
  "name": "One-on-One Diet Consultation",
  "description": "60-minute 1:1 consultation with a dietitian",
  "price": 799,
  "durationMinutes": 60
}
```

> `type`, `name`, `price` required. Types: `ONE_ON_ONE_CONSULTATION` | `LAB_REPORT_ANALYSIS`

---

### GET `/admin/services`

**Query Params:** `type`, `isActive`, `search`, `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "service_id",
        "type": "ONE_ON_ONE_CONSULTATION",
        "name": "One-on-One Diet Consultation",
        "description": "...",
        "price": 799,
        "durationMinutes": 60,
        "isActive": true
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 2, "totalPages": 1 }
  }
}
```

---

### GET `/admin/services/:id` — Single service

### PUT `/admin/services/:id` — Update service (price, name, description, durationMinutes)

```json
{
  "price": 999,
  "name": "Premium One-on-One Consultation",
  "durationMinutes": 90
}
```

### PATCH `/admin/services/:id/status`

```json
{ "isActive": false }
{ "isActive": true }
```

### DELETE `/admin/services/:id`

> Cannot delete if the service has existing bookings. Deactivate instead.

---

### GET `/admin/services/bookings`

All paid service bookings across all patients.

**Query Params:**

| Param | Description |
|---|---|
| `status` | `PAID` \| `AWAITING_SCHEDULE` \| `SCHEDULED` \| `COMPLETED` \| `CANCELLED` |
| `doctorId` | Filter by assigned doctor |
| `patientId` | Filter by patient |
| `type` | `ONE_ON_ONE_CONSULTATION` \| `LAB_REPORT_ANALYSIS` |
| `page` / `limit` | Pagination |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "booking_id",
        "status": "AWAITING_SCHEDULE",
        "patientNotes": "Prefer morning",
        "doctorNotes": null,
        "preferredDateTime": null,
        "appointmentType": "ONLINE",
        "completedAt": null,
        "createdAt": "2026-08-13T10:00:00.000Z",
        "service": { "id": "service_id", "type": "ONE_ON_ONE_CONSULTATION", "name": "One-on-One Diet Consultation", "price": 799 },
        "doctor": { "id": "doctor_id", "fullName": "Dr. John Smith", "profilePhotoUrl": null },
        "patient": { "id": "patient_id", "fullName": "John Doe", "email": "john@example.com" },
        "appointment": { "id": "appointment_id", "dateTime": "2026-08-20T10:00:00.000Z", "type": "ONLINE", "status": "PENDING" },
        "order": { "id": "order_id", "amount": 799, "status": "PAID", "paidAt": "2026-08-13T10:00:00.000Z" }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 5, "totalPages": 1 }
  }
}
```

---

### GET `/admin/services/bookings/:id` — Single booking (same shape)

---

### PATCH `/admin/services/bookings/:id/assign-doctor`

Reassign a booking to a different doctor (must be approved).

**Request Body:**
```json
{ "doctorId": "new_doctor_id" }
```

---

## 10. Digital Products

### Upload Flow (do this first)

```
1. POST /upload/digital-product/file       → returns fileUrl (PDF, max 50MB)
2. POST /upload/digital-product/thumbnail  → returns thumbnailUrl (image, max 5MB)
3. POST /admin/digital-products            → use both URLs
```

### POST `/admin/digital-products`

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

### GET `/admin/digital-products`

**Query Params:** `search`, `category`, `status` (`DRAFT` | `PUBLISHED` | `UNPUBLISHED`), `isFree`, `language`, `minPrice`, `maxPrice`, `page`, `limit`

### GET `/admin/digital-products/:id` — Single product

### PUT `/admin/digital-products/:id` — Update (all optional)

### PATCH `/admin/digital-products/:id/status`

```json
{ "status": "PUBLISHED" }
{ "status": "DRAFT" }
{ "status": "UNPUBLISHED" }
```

### DELETE `/admin/digital-products/:id`

---

## 11. Courses

### POST `/admin/courses`

```json
{
  "title": "Clinical Nutrition Fundamentals",
  "description": "Comprehensive course for interns",
  "category": "Clinical Nutrition",
  "instructor": "Dr. Smith",
  "duration": "4 weeks",
  "minSemester": 3,
  "minYear": 2,
  "hasFinalTest": true,
  "isActive": true
}
```

### GET `/admin/courses`

**Query Params:** `search`, `category`, `isActive`, `hasFinalTest`, `page`, `limit`

**Response includes:** `totalLessons`, `_count.enrollments`

### GET `/admin/courses/:id` — Course with all lessons

### PUT `/admin/courses/:id` — Update (all optional)

### DELETE `/admin/courses/:id` — Cascades lessons + enrollments

### POST `/admin/courses/:courseId/lessons`

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
```

> `order` auto-assigned if not provided.

### PUT `/admin/courses/lessons/:lessonId` — Update lesson (all optional)

### DELETE `/admin/courses/lessons/:lessonId` — Auto-decrements `totalLessons`

### GET `/admin/courses/:courseId/enrollments`

**Query Params:** `status` (`ENROLLED` | `IN_PROGRESS` | `COMPLETED` | `FAILED`), `page`, `limit`

**Response includes:** Intern profile + per-lesson completion + overall progress %

---

## 12. Revenue

### GET `/admin/revenue/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 124500,
      "thisMonth": 18200,
      "thisWeek": 4500,
      "totalOrders": 89
    },
    "breakdown": {
      "packages": { "revenue": 68000, "percentage": 54.6 },
      "digitalProducts": { "revenue": 32000, "percentage": 25.7 },
      "services": { "revenue": 24500, "percentage": 19.7 }
    },
    "recentTransactions": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemName": "Thyroid Management - 3 Months",
        "amount": 5499,
        "paidAt": "2026-08-13T10:00:00.000Z",
        "patient": { "fullName": "Sarah Jenkins", "email": "sarah@example.com" }
      }
    ]
  }
}
```

### GET `/admin/revenue/orders`

**Query Params:** `status` (`PENDING` | `PAID` | `FAILED` | `REFUNDED`), `itemType` (`PACKAGE` | `DIGITAL_PRODUCT` | `SERVICE`), `fromDate`, `toDate`, `page`, `limit`

---

## Enum Reference

### Account Status
`ACTIVE` | `INACTIVE` | `SUSPENDED` | `PENDING_APPROVAL`

### Gender
`MALE` | `FEMALE` | `OTHER` | `PREFER_NOT_TO_SAY`

### Blood Group
`A_POS` | `A_NEG` | `B_POS` | `B_NEG` | `AB_POS` | `AB_NEG` | `O_POS` | `O_NEG`

### Appointment Status
`PENDING` | `CONFIRMED` | `COMPLETED` | `CANCELLED`

### Appointment Type
`ONLINE` | `IN_PERSON`

### Subscription Status
`PENDING_ASSIGNMENT` | `ACTIVE` | `EXPIRED` | `CANCELLED`

### Package Duration
`ONE_MONTH` | `THREE_MONTHS` | `SIX_MONTHS`

### Diet Plan Status
`DRAFT` | `PENDING_APPROVAL` | `APPROVED` | `REJECTED`

### Service Type
`ONE_ON_ONE_CONSULTATION` | `LAB_REPORT_ANALYSIS`

### Service Booking Status
`PAID` | `AWAITING_SCHEDULE` | `SCHEDULED` | `COMPLETED` | `CANCELLED`

### Digital Product Status
`DRAFT` | `PUBLISHED` | `UNPUBLISHED`

### Enrollment Status
`ENROLLED` | `IN_PROGRESS` | `COMPLETED` | `FAILED`

### Order Status
`PENDING` | `PAID` | `FAILED` | `REFUNDED`

---

## Error Format

```json
{ "success": false, "message": "Error description" }
```

| Code | Meaning |
|---|---|
| `400` | Validation / business rule |
| `401` | Missing or invalid token |
| `403` | Not an admin |
| `404` | Not found |
| `500` | Server error |

---

## User Creation — Two Ways

| Feature | Self-Registration | Admin Creates |
|---|---|---|
| Patient | `POST /auth/register/patient` | `POST /admin/patients` |
| Doctor | `POST /auth/register/doctor` | `POST /admin/doctors` |
| Intern | `POST /auth/register/intern` | `POST /admin/interns` |
| Password | User provides | Auto-generated — shown once in response |
