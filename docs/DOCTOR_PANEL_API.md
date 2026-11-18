# Doctor Panel — Frontend API Reference

> **Base URL (Production):** `https://dr-dietician-backend.onrender.com/api`
> **Base URL (Local):** `http://localhost:5000/api`
> **Swagger UI:** `/api/docs`

## Authentication

Every request must include the JWT token from login:

```
Authorization: Bearer <token>
```

---

## Quick Reference — All Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctor/dashboard` | Home dashboard with stats |
| GET | `/doctor/profile` | My profile |
| PUT | `/doctor/profile` | Update my profile |
| POST | `/upload/profile-photo` | Upload profile photo |
| GET | `/doctor/appointments` | List appointments (with filters) |
| GET | `/doctor/appointments/:id` | Single appointment detail |
| PATCH | `/doctor/appointments/:id` | Reschedule / update appointment |
| PATCH | `/doctor/appointments/:id/status` | Confirm / Complete / Cancel |
| GET | `/doctor/patients` | List my patients |
| GET | `/doctor/patients/:id` | Patient profile + history |
| GET | `/doctor/patients/:patientId/diet-plan` | Patient's current diet plan |
| POST | `/upload/blood-report` | Upload PDF file |
| POST | `/doctor/blood-reports` | Create blood report record |
| GET | `/doctor/blood-reports` | List blood reports I uploaded |
| GET | `/doctor/blood-reports/:id` | Single blood report |
| PUT | `/doctor/blood-reports/:id` | Update blood report |
| DELETE | `/doctor/blood-reports/:id` | Delete blood report |
| POST | `/doctor/diet-plans` | Create / update draft diet plan |
| GET | `/doctor/diet-plans` | List my diet plans |
| GET | `/doctor/diet-plans/:id` | Single diet plan |
| PATCH | `/doctor/diet-plans/:id/submit` | Submit plan for admin approval |
| GET | `/doctor/service-bookings` | List my service bookings |
| GET | `/doctor/service-bookings/:id` | Single service booking |
| PATCH | `/doctor/service-bookings/:id/schedule` | Schedule consultation time |
| PATCH | `/doctor/service-bookings/:id/complete` | Complete service booking |

---

## 1. Dashboard

### GET `/doctor/dashboard`

Home screen — doctor info, stats, next upcoming appointment.

**Response:**
```json
{
  "success": true,
  "message": "Doctor dashboard fetched successfully",
  "data": {
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "email": "dr.smith@example.com",
      "profilePhotoUrl": null,
      "lastLoginAt": "2026-08-13T10:00:00.000Z",
      "doctorProfile": {
        "phoneNumber": "9876543210",
        "specialization": "Nutrition",
        "qualification": "MBBS, MD",
        "licenseNumber": "LIC123456",
        "yearsOfExperience": 8,
        "hospitalName": "City Hospital",
        "clinicAddress": "123 Main Street",
        "isApproved": true
      }
    },
    "stats": {
      "todayAppointments": 3,
      "totalPatients": 15,
      "pendingAppointments": 5,
      "completedAppointments": 42
    },
    "upcomingAppointment": {
      "id": "appointment_id",
      "dateTime": "2026-08-14T10:00:00.000Z",
      "type": "ONLINE",
      "status": "CONFIRMED",
      "notes": "Follow-up",
      "patient": {
        "id": "patient_id",
        "fullName": "John Doe",
        "profilePhotoUrl": null,
        "patientProfile": {
          "phoneNumber": "9876543210",
          "age": 25,
          "gender": "MALE",
          "bloodGroup": "O_POS"
        }
      }
    }
  }
}
```

> `upcomingAppointment` is `null` when no upcoming appointments exist.

---

## 2. Profile

### GET `/doctor/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doctor_id",
    "fullName": "Dr. John Smith",
    "email": "dr.smith@example.com",
    "profilePhotoUrl": null,
    "isEmailVerified": false,
    "lastLoginAt": "2026-08-13T10:00:00.000Z",
    "createdAt": "2026-06-28T00:00:00.000Z",
    "updatedAt": "2026-08-13T00:00:00.000Z",
    "doctorProfile": {
      "phoneNumber": "9876543210",
      "specialization": "Nutrition",
      "qualification": "MBBS, MD",
      "licenseNumber": "LIC123456",
      "yearsOfExperience": 8,
      "hospitalName": "City Hospital",
      "clinicAddress": "123 Main Street",
      "isApproved": true
    }
  }
}
```

---

### PUT `/doctor/profile`

All fields optional — send only what changes.

**Request Body:**
```json
{
  "fullName": "Dr. John Updated",
  "profilePhotoUrl": "/uploads/1720000000000.png",
  "doctorProfile": {
    "phoneNumber": "9876543210",
    "specialization": "Nutrition & Dietetics",
    "qualification": "MBBS, MD",
    "yearsOfExperience": 9,
    "hospitalName": "New Hospital",
    "clinicAddress": "456 New Street"
  }
}
```

> `licenseNumber` cannot be changed here.

---

### POST `/upload/profile-photo`

Upload photo first, then use the returned URL in `PUT /doctor/profile`.

- **Request:** `multipart/form-data`
- **Field name:** `photo`
- **Allowed:** JPEG, PNG, WebP

**Response:**
```json
{
  "success": true,
  "data": { "profilePhotoUrl": "/uploads/1720000000000.png" }
}
```

---

## 3. Appointments

### GET `/doctor/appointments`

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | string | `PENDING` \| `CONFIRMED` \| `COMPLETED` \| `CANCELLED` |
| `type` | string | `ONLINE` \| `IN_PERSON` |
| `upcoming` | boolean | `true` → future PENDING/CONFIRMED only |
| `today` | boolean | `true` → today only |
| `search` | string | Patient name |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "appointment_id",
        "dateTime": "2026-08-14T10:00:00.000Z",
        "type": "ONLINE",
        "status": "CONFIRMED",
        "notes": "Follow-up on diet plan",
        "createdAt": "2026-08-01T00:00:00.000Z",
        "patient": {
          "id": "patient_id",
          "fullName": "John Doe",
          "profilePhotoUrl": null,
          "patientProfile": {
            "phoneNumber": "9876543210",
            "age": 25,
            "gender": "MALE",
            "bloodGroup": "O_POS",
            "location": "Delhi",
            "heightCm": 175,
            "weightKg": 70
          }
        }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 20, "totalPages": 2 }
  }
}
```

---

### GET `/doctor/appointments/:id`

Full detail including all patient profile fields.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "appointment_id",
    "dateTime": "2026-08-14T10:00:00.000Z",
    "type": "ONLINE",
    "status": "CONFIRMED",
    "notes": "Follow-up",
    "createdAt": "2026-08-01T00:00:00.000Z",
    "updatedAt": "2026-08-13T00:00:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": null,
      "patientProfile": {
        "phoneNumber": "9876543210",
        "whatsappNumber": "9876543210",
        "age": 25,
        "gender": "MALE",
        "bloodGroup": "O_POS",
        "location": "Delhi",
        "heightCm": 175,
        "weightKg": 70,
        "socialHandle": "@johndoe",
        "isDefencePersonnel": false
      }
    }
  }
}
```

---

### PATCH `/doctor/appointments/:id`

Reschedule date/time, change type, or update notes. Only `PENDING` or `CONFIRMED` appointments.

**Request Body** (at least one field required):
```json
{
  "dateTime": "2026-08-20T14:00:00.000Z",
  "type": "IN_PERSON",
  "notes": "Rescheduled to clinic visit"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "id": "appointment_id",
    "dateTime": "2026-08-20T14:00:00.000Z",
    "type": "IN_PERSON",
    "status": "CONFIRMED",
    "notes": "Rescheduled to clinic visit",
    "updatedAt": "2026-08-13T12:30:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": null,
      "patientProfile": { "phoneNumber": "9876543210", "age": 25, "gender": "MALE" }
    }
  }
}
```

---

### PATCH `/doctor/appointments/:id/status`

Confirm, complete, or cancel an appointment.

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Patient completed diet goals this week"
}
```

> `status` required. `notes` optional. Allowed: `CONFIRMED` | `COMPLETED` | `CANCELLED`

**Response:**
```json
{
  "success": true,
  "message": "Appointment status updated",
  "data": {
    "id": "appointment_id",
    "status": "CONFIRMED",
    "dateTime": "2026-08-14T10:00:00.000Z",
    "type": "ONLINE",
    "notes": "Patient completed diet goals",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "patient": { "id": "patient_id", "fullName": "John Doe", "email": "john@example.com" }
  }
}
```

---

## 4. Patients

### GET `/doctor/patients`

Patients who had at least one appointment with this doctor.

**Query Params:** `search`, `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "patient_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "profilePhotoUrl": null,
        "patientProfile": {
          "phoneNumber": "9876543210",
          "age": 25,
          "gender": "MALE",
          "bloodGroup": "O_POS",
          "location": "Delhi",
          "heightCm": 175,
          "weightKg": 70
        },
        "lastAppointment": {
          "id": "appointment_id",
          "dateTime": "2026-07-20T10:00:00.000Z",
          "status": "COMPLETED",
          "type": "ONLINE"
        }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 15, "totalPages": 2 }
  }
}
```

---

### GET `/doctor/patients/:id`

Full patient profile + all appointment history with this doctor.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "patient_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePhotoUrl": null,
    "createdAt": "2026-06-01T00:00:00.000Z",
    "patientProfile": {
      "phoneNumber": "9876543210",
      "whatsappNumber": "9876543210",
      "age": 25,
      "gender": "MALE",
      "bloodGroup": "O_POS",
      "location": "Delhi",
      "heightCm": 175,
      "weightKg": 70,
      "socialHandle": "@johndoe",
      "isDefencePersonnel": false
    },
    "appointmentHistory": [
      { "id": "apt_id_1", "dateTime": "2026-07-20T10:00:00.000Z", "type": "ONLINE", "status": "COMPLETED", "notes": "Initial consultation" },
      { "id": "apt_id_2", "dateTime": "2026-08-14T10:00:00.000Z", "type": "ONLINE", "status": "CONFIRMED", "notes": "Follow-up" }
    ]
  }
}
```

---

## 5. Blood Reports

Two-step: upload the PDF first → then create the record.

### Step 1 — POST `/upload/blood-report`

- **Request:** `multipart/form-data`, field name: `file`
- **Allowed:** PDF only, max 20MB

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "/uploads/blood-reports/blood-report-1720000000000.pdf",
    "originalName": "cbc-report.pdf",
    "size": 204800
  }
}
```

---

### Step 2 — POST `/doctor/blood-reports`

**Request Body:**
```json
{
  "patientId": "patient_id",
  "title": "CBC Report July 2026",
  "fileUrl": "/uploads/blood-reports/blood-report-1720000000000.pdf",
  "notes": "All values within normal range. Vitamin D slightly low."
}
```

> `patientId`, `title`, `fileUrl` required. `notes` optional.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "title": "CBC Report July 2026",
    "fileUrl": "/uploads/blood-reports/blood-report-1720000000000.pdf",
    "notes": "All values within normal range. Vitamin D slightly low.",
    "uploadedAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T10:00:00.000Z",
    "patient": { "id": "patient_id", "fullName": "John Doe", "email": "john@example.com", "profilePhotoUrl": null }
  }
}
```

---

### GET `/doctor/blood-reports`

**Query Params:** `patientId`, `search` (title), `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "report_id",
        "title": "CBC Report July 2026",
        "fileUrl": "/uploads/blood-reports/blood-report-123.pdf",
        "notes": "All values within normal range",
        "uploadedAt": "2026-08-13T10:00:00.000Z",
        "updatedAt": "2026-08-13T10:00:00.000Z",
        "patient": { "id": "patient_id", "fullName": "John Doe", "profilePhotoUrl": null }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 5, "totalPages": 1 }
  }
}
```

---

### GET `/doctor/blood-reports/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "title": "CBC Report July 2026",
    "fileUrl": "/uploads/blood-reports/blood-report-123.pdf",
    "notes": "All values within normal range",
    "uploadedAt": "2026-08-13T10:00:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": null,
      "patientProfile": { "age": 25, "gender": "MALE", "bloodGroup": "O_POS", "phoneNumber": "9876543210" }
    }
  }
}
```

---

### PUT `/doctor/blood-reports/:id`

All fields optional.

**Request Body:**
```json
{
  "title": "Updated CBC Report",
  "notes": "Vitamin D normal now",
  "fileUrl": "/uploads/blood-reports/new-file.pdf"
}
```

---

### DELETE `/doctor/blood-reports/:id`

**Response:**
```json
{ "success": true, "message": "Blood report deleted successfully" }
```

---

## 6. Diet Plans

Doctor creates a diet plan for a patient who has an **active package subscription** assigned to them. Admin must approve before the patient can see it.

### POST `/doctor/diet-plans`

Create or update a draft plan. If a plan already exists for this patient's current subscription it updates it; otherwise creates a new one.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "duration": "SEVEN_DAYS",
  "calorieTarget": 1800,
  "foodsToEat": ["Oats", "Brown rice", "Leafy greens"],
  "foodsToAvoid": ["Refined sugar", "Fried food"],
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
    "items": ["Roti x2", "Paneer curry"],
    "calories": 500
  },
  "snacks": {
    "morning": ["Almonds", "Green tea"],
    "evening": ["Fruit bowl", "Buttermilk"]
  },
  "notes": "Avoid eating after 8 PM. Drink 3L water daily."
}
```

| Field | Required | Notes |
|---|---|---|
| `patientId` | ✅ | Must be assigned to you on active package |
| `duration` | ✅ | `SEVEN_DAYS` \| `TEN_DAYS` \| `FIFTEEN_DAYS` |
| `calorieTarget` | ❌ | Daily calorie goal |
| `foodsToEat` | ❌ | String array |
| `foodsToAvoid` | ❌ | String array |
| `breakfast` | ❌ | Free-form JSON |
| `lunch` | ❌ | Free-form JSON |
| `dinner` | ❌ | Free-form JSON |
| `snacks` | ❌ | Free-form JSON |
| `notes` | ❌ | General instructions |

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
    "dueAt": "2026-08-14T10:00:00.000Z",
    "isOverdue": false,
    "hoursRemaining": 23,
    "patient": { "id": "patient_id", "fullName": "John Doe", "email": "john@example.com", "profilePhotoUrl": null },
    "doctor": { "id": "doctor_id", "fullName": "Dr. John Smith", "profilePhotoUrl": null },
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
- `durationDays` — 7, 10, or 15
- `dueAt` — 24 hours after doctor was assigned. Submit before this.
- `isOverdue` — `true` if past due and not yet submitted
- `hoursRemaining` — countdown in hours (`null` after submission)

---

### GET `/doctor/diet-plans`

**Query Params:** `status` (`DRAFT` | `PENDING_APPROVAL` | `APPROVED` | `REJECTED`), `patientId`, `page`, `limit`

**Response:** Paginated list of plan objects (same shape as above).

---

### GET `/doctor/diet-plans/:id`

Single plan — same shape as above.

---

### PATCH `/doctor/diet-plans/:id/submit`

Submit draft for admin approval. Plan becomes read-only after this.

> Requires at least one of `breakfast`, `lunch`, or `dinner` to be filled. Status must be `DRAFT` or `REJECTED`.

**No request body needed.**

**Response:**
```json
{
  "success": true,
  "message": "Diet plan submitted for admin approval",
  "data": { "...plan with status: PENDING_APPROVAL..." }
}
```

---

### GET `/doctor/patients/:patientId/diet-plan`

View the current diet plan status for a specific patient.

**Response:**
```json
{
  "success": true,
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

---

## 7. Service Bookings

Patients pay for one-time services (Consultation or Lab Report Analysis). They are auto-assigned to a doctor. Doctor then schedules / completes the booking.

### GET `/doctor/service-bookings`

**Query Params:** `status`, `type` (`ONE_ON_ONE_CONSULTATION` | `LAB_REPORT_ANALYSIS`), `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "booking_id",
        "status": "AWAITING_SCHEDULE",
        "patientNotes": "I prefer morning slots",
        "doctorNotes": null,
        "preferredDateTime": null,
        "appointmentType": "ONLINE",
        "completedAt": null,
        "createdAt": "2026-08-13T10:00:00.000Z",
        "service": {
          "id": "service_id",
          "type": "ONE_ON_ONE_CONSULTATION",
          "name": "One-on-One Diet Consultation",
          "price": 799,
          "durationMinutes": 60
        },
        "doctor": {
          "id": "doctor_id",
          "fullName": "Dr. John Smith",
          "profilePhotoUrl": null,
          "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
        },
        "appointment": {
          "id": "appointment_id",
          "dateTime": "2026-08-20T10:00:00.000Z",
          "type": "ONLINE",
          "status": "PENDING"
        },
        "order": { "id": "order_id", "amount": 799, "status": "PAID", "paidAt": "2026-08-13T10:00:00.000Z" }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 3, "totalPages": 1 }
  }
}
```

> `appointment` is `null` for `LAB_REPORT_ANALYSIS` type bookings.

---

### GET `/doctor/service-bookings/:id`

Single booking — same shape as list item.

---

### PATCH `/doctor/service-bookings/:id/schedule`

Set the time slot for a **consultation** booking.

**Request Body:**
```json
{
  "dateTime": "2026-08-20T10:00:00.000Z",
  "type": "ONLINE"
}
```

> `dateTime` required (ISO 8601, must be future). `type` optional (`ONLINE` | `IN_PERSON`).

**Response:** Updated booking with appointment details.

---

### PATCH `/doctor/service-bookings/:id/complete`

Mark booking as completed and add notes.

**Request Body:**
```json
{
  "doctorNotes": "Blood sugar slightly elevated. Recommended low-carb diet for 30 days."
}
```

> `doctorNotes` required for `LAB_REPORT_ANALYSIS`, optional for consultation.

**Response:** Updated booking with `status: "COMPLETED"`.

---

## Enum Reference

### Appointment Status
| Value | Meaning |
|---|---|
| `PENDING` | Booked, not yet confirmed |
| `CONFIRMED` | Doctor confirmed |
| `COMPLETED` | Session done |
| `CANCELLED` | Cancelled |

### Service Booking Status
| Value | Meaning |
|---|---|
| `PAID` | Paid (lab analysis type — no schedule needed) |
| `AWAITING_SCHEDULE` | Consultation paid, awaiting time slot |
| `SCHEDULED` | Time slot confirmed |
| `COMPLETED` | Done |
| `CANCELLED` | Cancelled |

### Diet Plan Status
| Value | Meaning |
|---|---|
| `DRAFT` | Being worked on |
| `PENDING_APPROVAL` | Submitted, waiting for admin |
| `APPROVED` | Patient can see it |
| `REJECTED` | Sent back — edit `rejectionReason` and resubmit |

### Duration
| Value | Days |
|---|---|
| `SEVEN_DAYS` | 7 |
| `TEN_DAYS` | 10 |
| `FIFTEEN_DAYS` | 15 |

---

## Error Format

```json
{ "success": false, "message": "Error description" }
```

| Code | Meaning |
|---|---|
| `400` | Validation / business rule |
| `401` | Missing or invalid token |
| `403` | Not a doctor |
| `404` | Not found |
| `500` | Server error |
