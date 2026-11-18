# Services & Diet Plan — Frontend Integration Guide

> **Base URL:** `https://dr-dietician-backend.onrender.com/api`  
> **Local URL:** `http://localhost:5000/api`  
> **Auth:** All routes require `Authorization: Bearer <token>` header  
> **Swagger UI:** `/api/docs`

---

# PART 1 — Services (One-Time Bookings)

Two service types are available:

| Type | Name | Price | Notes |
|---|---|---|---|
| `ONE_ON_ONE_CONSULTATION` | One-on-One Diet Consultation | ₹799 | 60-min session, doctor auto-assigned |
| `LAB_REPORT_ANALYSIS` | Lab Report Analysis | ₹499 | Doctor reviews your blood reports |

**Flow:**
1. Patient browses services → `GET /patient/services`
2. Patient pays → `POST /patient/payments/create-order` with `itemType: "SERVICE"`
3. After payment verified → booking is auto-created, doctor auto-assigned
4. For consultation → doctor schedules a time slot
5. Patient views their booking → `GET /patient/service-bookings`

---

## Patient — Browse & Book Services

### GET `/patient/services`

Browse all active services.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `type` | string | `ONE_ON_ONE_CONSULTATION` \| `LAB_REPORT_ANALYSIS` |

**Response:**
```json
{
  "success": true,
  "message": "Services fetched successfully",
  "data": {
    "items": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-111111111111",
        "type": "ONE_ON_ONE_CONSULTATION",
        "name": "One-on-One Diet Consultation",
        "description": "60-minute 1:1 consultation. Pay in full at booking. A doctor is assigned automatically.",
        "price": 799,
        "durationMinutes": 60,
        "isActive": true
      },
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-222222222222",
        "type": "LAB_REPORT_ANALYSIS",
        "name": "Lab Report Analysis",
        "description": "Dietitian reviews your lab/blood reports and shares notes. Pay in full at booking.",
        "price": 499,
        "durationMinutes": null,
        "isActive": true
      }
    ]
  }
}
```

---

### GET `/patient/services/:id`

Get single service detail.

**Response:** Same shape as a single item above.

---

### POST `/patient/payments/create-order` — Book a Service

To book a service, create a payment order with `itemType: "SERVICE"`.

**Request Body:**
```json
{
  "itemType": "SERVICE",
  "itemId": "a1b2c3d4-e5f6-7890-abcd-111111111111",
  "preferredDateTime": "2026-08-20T10:00:00.000Z",
  "notes": "I prefer morning slots",
  "appointmentType": "ONLINE"
}
```

> - `preferredDateTime` — optional for consultation. If provided, doctor will confirm that slot.
> - `appointmentType` — `ONLINE` (default) or `IN_PERSON`
> - `duration` is NOT needed for services (only for packages)

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_QzXvYz123456",
    "amount": 79900,
    "currency": "INR",
    "keyId": "rzp_test_xxx",
    "itemName": "One-on-One Diet Consultation"
  }
}
```

After Razorpay popup success, call `POST /patient/payments/verify`. On success, the booking is auto-created with a doctor auto-assigned.

---

## Patient — View My Service Bookings

### GET `/patient/service-bookings`

Get all paid service bookings.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | string | See booking status table below |
| `type` | string | `ONE_ON_ONE_CONSULTATION` \| `LAB_REPORT_ANALYSIS` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "Service bookings fetched successfully",
  "data": {
    "items": [
      {
        "id": "booking_id",
        "patientId": "patient_id",
        "serviceId": "service_id",
        "orderId": "order_id",
        "doctorId": "doctor_id",
        "status": "AWAITING_SCHEDULE",
        "patientNotes": "I prefer morning slots",
        "doctorNotes": null,
        "preferredDateTime": null,
        "appointmentType": "ONLINE",
        "completedAt": null,
        "createdAt": "2026-08-13T10:00:00.000Z",
        "updatedAt": "2026-08-13T10:00:00.000Z",
        "service": {
          "id": "service_id",
          "type": "ONE_ON_ONE_CONSULTATION",
          "name": "One-on-One Diet Consultation",
          "price": 799,
          "durationMinutes": 60,
          "isActive": true
        },
        "doctor": {
          "id": "doctor_id",
          "fullName": "Dr. John Smith",
          "profilePhotoUrl": null,
          "doctorProfile": {
            "specialization": "Nutrition",
            "qualification": "MBBS, MD",
            "hospitalName": "City Hospital",
            "phoneNumber": "9876543210"
          }
        },
        "appointment": {
          "id": "appointment_id",
          "dateTime": "2026-08-20T10:00:00.000Z",
          "type": "ONLINE",
          "status": "PENDING"
        },
        "order": {
          "id": "order_id",
          "amount": 799,
          "status": "PAID",
          "isDummy": false,
          "paidAt": "2026-08-13T10:00:00.000Z"
        }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 2, "totalPages": 1 }
  }
}
```

> `appointment` is `null` for `LAB_REPORT_ANALYSIS` bookings.

---

### GET `/patient/service-bookings/:id`

Single booking detail — same shape as above.

---

## Service Booking Status Reference (Patient View)

| Status | Meaning | What to show |
|---|---|---|
| `PAID` | Payment done, lab report type | Doctor will review and add notes |
| `AWAITING_SCHEDULE` | Consultation paid, no time set yet | "Doctor will schedule your appointment soon" |
| `SCHEDULED` | Doctor confirmed a time slot | Show appointment date/time |
| `COMPLETED` | Session done | Show doctor's notes if any |
| `CANCELLED` | Booking cancelled | — |

---

## Doctor — Service Bookings

### GET `/doctor/service-bookings`

Get all service bookings assigned to this doctor.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | string | See booking status table |
| `type` | string | `ONE_ON_ONE_CONSULTATION` \| `LAB_REPORT_ANALYSIS` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:** Same shape as patient's service bookings list.

---

### GET `/doctor/service-bookings/:id`

Single service booking detail — same shape.

---

### PATCH `/doctor/service-bookings/:id/schedule`

Schedule a time slot for a consultation booking. Only for `ONE_ON_ONE_CONSULTATION` type.

**Request Body:**
```json
{
  "dateTime": "2026-08-20T10:00:00.000Z",
  "type": "ONLINE"
}
```

> - `dateTime` — required, must be in the future (ISO 8601)
> - `type` — `ONLINE` or `IN_PERSON` (optional, defaults to booking's existing type)

**Response:** Updated booking with the appointment details.

**Errors:**
- `400` — This service does not use a time slot (lab report type)
- `400` — dateTime must be in the future
- `400` — Doctor already has an appointment at this time

---

### PATCH `/doctor/service-bookings/:id/complete`

Mark a service booking as completed.

**Request Body:**
```json
{
  "doctorNotes": "Blood sugar levels are slightly elevated. Recommended low-carb diet for 30 days."
}
```

> - `doctorNotes` — required for `LAB_REPORT_ANALYSIS`, optional for consultation

**Response:** Updated booking with `status: "COMPLETED"`.

---

---

# PART 2 — Diet Plans

Diet plans are created by doctors for patients who have an **active package subscription**. Admin must approve before the patient can see the content.

**Full flow:**
1. Admin assigns doctor to patient's package subscription
2. Doctor creates/edits a draft plan → `POST /doctor/diet-plans`
3. Doctor submits for review → `PATCH /doctor/diet-plans/:id/submit`
4. Admin approves → `PATCH /admin/diet-plans/:id/approve`
5. Patient can now see their plan → `GET /patient/diet-plan`

---

## Doctor — Diet Plans

### POST `/doctor/diet-plans`

Create or update a draft diet plan for a patient. If a plan already exists for this patient's current subscription, it updates it. If not, creates a new one.

> Only works for patients with an active package subscription assigned to this doctor.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "duration": "SEVEN_DAYS",
  "calorieTarget": 1800,
  "foodsToEat": ["Oats", "Brown rice", "Leafy greens", "Lentils"],
  "foodsToAvoid": ["Refined sugar", "Fried food", "White bread"],
  "breakfast": {
    "time": "8:00 AM",
    "items": ["Oatmeal with banana", "1 glass warm water"],
    "calories": 350
  },
  "lunch": {
    "time": "1:00 PM",
    "items": ["Brown rice", "Dal", "Sabzi", "Salad"],
    "calories": 600
  },
  "dinner": {
    "time": "7:30 PM",
    "items": ["Roti x2", "Paneer curry", "Cucumber salad"],
    "calories": 500
  },
  "snacks": {
    "morning": ["Handful of almonds", "Green tea"],
    "evening": ["Fruit bowl", "Buttermilk"]
  },
  "notes": "Avoid eating after 8 PM. Drink 3L water daily."
}
```

**Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `patientId` | string | ✅ | Must be assigned to you on active package |
| `duration` | string | ✅ | `SEVEN_DAYS` \| `TEN_DAYS` \| `FIFTEEN_DAYS` |
| `calorieTarget` | number | ❌ | Daily calorie goal |
| `foodsToEat` | string[] | ❌ | List of recommended foods |
| `foodsToAvoid` | string[] | ❌ | List of foods to avoid |
| `breakfast` | object | ❌ | Free-form JSON |
| `lunch` | object | ❌ | Free-form JSON |
| `dinner` | object | ❌ | Free-form JSON |
| `snacks` | object | ❌ | Free-form JSON |
| `notes` | string | ❌ | General instructions |

**Response:**
```json
{
  "success": true,
  "message": "Diet plan saved as draft",
  "data": {
    "id": "plan_id",
    "duration": "SEVEN_DAYS",
    "durationDays": 7,
    "calorieTarget": 1800,
    "foodsToEat": ["Oats", "Brown rice"],
    "foodsToAvoid": ["Refined sugar"],
    "breakfast": { "time": "8:00 AM", "items": ["Oatmeal with banana"], "calories": 350 },
    "lunch": { "time": "1:00 PM", "items": ["Brown rice", "Dal"], "calories": 600 },
    "dinner": { "time": "7:30 PM", "items": ["Roti x2"], "calories": 500 },
    "snacks": { "morning": ["Almonds"], "evening": ["Fruit bowl"] },
    "notes": "Avoid eating after 8 PM.",
    "status": "DRAFT",
    "submittedAt": null,
    "approvedAt": null,
    "rejectedAt": null,
    "rejectionReason": null,
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "subscriptionId": "sub_id",
    "createdAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T10:00:00.000Z",
    "dueAt": "2026-08-14T10:00:00.000Z",
    "isOverdue": false,
    "hoursRemaining": 23,
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": null
    },
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "profilePhotoUrl": null,
      "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
    },
    "subscription": {
      "id": "sub_id",
      "status": "ACTIVE",
      "assignedAt": "2026-08-13T10:00:00.000Z",
      "endsAt": "2026-11-13T10:00:00.000Z",
      "package": { "id": "pkg_id", "name": "Thyroid Management", "category": "Thyroid" }
    }
  }
}
```

**Key response fields:**
- `durationDays` — number of days (7, 10, or 15)
- `dueAt` — 24 hours after doctor was assigned. Submit before this.
- `isOverdue` — `true` if past due and not yet submitted
- `hoursRemaining` — countdown in hours (null after submission)

**Errors:**
- `400` — Patient is not assigned to you on an active package
- `400` — Plan is waiting for admin approval and cannot be edited
- `400` — Approved plan cannot be edited

---

### GET `/doctor/diet-plans`

List all diet plans created by this doctor.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | string | `DRAFT` \| `PENDING_APPROVAL` \| `APPROVED` \| `REJECTED` |
| `patientId` | string | Filter by patient |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "Diet plans fetched successfully",
  "data": {
    "items": [ "...array of plan objects (same shape as above)..." ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 3, "totalPages": 1 }
  }
}
```

---

### GET `/doctor/diet-plans/:id`

Get a single diet plan by ID.

**Response:** Same shape as the create response.

---

### GET `/doctor/patients/:patientId/diet-plan`

Get the current diet plan for a specific patient (via their active subscription).

**Response:**
```json
{
  "success": true,
  "message": "Patient diet plan fetched successfully",
  "data": {
    "subscriptionId": "sub_id",
    "assignedAt": "2026-08-13T10:00:00.000Z",
    "plan": { "...full plan object or null if not created yet..." },
    "dueAt": "2026-08-14T10:00:00.000Z",
    "isOverdue": false,
    "hoursRemaining": 18
  }
}
```

> `plan` is `null` if no plan has been created for this subscription yet.

---

### PATCH `/doctor/diet-plans/:id/submit`

Submit a draft plan for admin approval. Cannot edit after submitting.

**No request body needed.**

**Requirements before submitting:**
- Plan must have at least one of: `breakfast`, `lunch`, or `dinner`
- Status must be `DRAFT` or `REJECTED`

**Response:**
```json
{
  "success": true,
  "message": "Diet plan submitted for admin approval",
  "data": {
    "...plan object with status: 'PENDING_APPROVAL'..."
  }
}
```

---

## Patient — Diet Plan

### GET `/patient/diet-plan`

Get the patient's current diet plan. The full meal content is only visible after admin approval.

**Response varies by status:**

**Case 1 — No package purchased:**
```json
{
  "success": true,
  "message": "Buy a package to get a personal diet plan",
  "data": {
    "visible": false,
    "patientStatus": "NO_PACKAGE",
    "message": "Buy a package to get a personal diet plan",
    "plan": null
  }
}
```

**Case 2 — Package bought, doctor not yet assigned:**
```json
{
  "data": {
    "visible": false,
    "patientStatus": "WAITING_FOR_DOCTOR_ASSIGNMENT",
    "message": "Admin will assign a doctor, then your diet plan will be prepared",
    "plan": null
  }
}
```

**Case 3 — Doctor assigned, plan being prepared:**
```json
{
  "data": {
    "visible": false,
    "patientStatus": "IN_PROGRESS",
    "message": "Your dietitian is preparing your plan",
    "plan": null
  }
}
```

**Case 4 — Plan submitted, under admin review:**
```json
{
  "data": {
    "visible": false,
    "patientStatus": "PENDING_APPROVAL",
    "message": "Your diet plan is being reviewed",
    "plan": null
  }
}
```

**Case 5 — Plan approved ✅ (show full content):**
```json
{
  "data": {
    "visible": true,
    "patientStatus": "APPROVED",
    "message": "Your diet plan is ready",
    "plan": {
      "id": "plan_id",
      "duration": "SEVEN_DAYS",
      "durationDays": 7,
      "calorieTarget": 1800,
      "foodsToEat": ["Oats", "Brown rice", "Leafy greens"],
      "foodsToAvoid": ["Refined sugar", "Fried food"],
      "breakfast": { "time": "8:00 AM", "items": ["Oatmeal with banana"], "calories": 350 },
      "lunch": { "time": "1:00 PM", "items": ["Brown rice", "Dal", "Sabzi"], "calories": 600 },
      "dinner": { "time": "7:30 PM", "items": ["Roti x2", "Paneer curry"], "calories": 500 },
      "snacks": { "morning": ["Almonds", "Green tea"], "evening": ["Fruit bowl"] },
      "notes": "Avoid eating after 8 PM. Drink 3L water daily.",
      "status": "APPROVED",
      "approvedAt": "2026-08-14T08:00:00.000Z",
      "doctor": {
        "id": "doctor_id",
        "fullName": "Dr. John Smith",
        "profilePhotoUrl": null,
        "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
      },
      "subscription": {
        "package": { "name": "Thyroid Management", "category": "Thyroid" }
      }
    }
  }
}
```

**UI Logic:**
```
visible === false → show message only (status screen)
visible === true  → show full diet plan UI
```

---

## Diet Plan Status Reference

| Status | Who sees it | Meaning |
|---|---|---|
| `DRAFT` | Doctor only | Being worked on, not submitted yet |
| `PENDING_APPROVAL` | Doctor only | Submitted, waiting for admin |
| `APPROVED` | Doctor + Patient | Patient can now view full plan |
| `REJECTED` | Doctor only | Admin sent back, doctor must edit and resubmit. `rejectionReason` has the reason. |

---

## Duration Values

| Value | Days |
|---|---|
| `SEVEN_DAYS` | 7 |
| `TEN_DAYS` | 10 |
| `FIFTEEN_DAYS` | 15 |

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
| `400` | Validation error / business rule |
| `401` | Missing or invalid token |
| `403` | Access denied (wrong role) |
| `404` | Resource not found |
