# Doctor Panel — Frontend Integration Guide

> **Base URL:** `https://dr-dietician-backend.onrender.com/api`  
> **Local URL:** `http://localhost:5000/api`  
> **Auth:** All doctor routes require `Authorization: Bearer <token>` header  
> **Swagger UI:** `/api/docs`

## Related Docs

- **Appointments** (confirm, reschedule, complete, cancel): [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md)
- **Patient portal:** [`PATIENT_PORTAL_API.md`](./PATIENT_PORTAL_API.md)

---

## Authentication

All requests to `/doctor/*` routes must include the JWT token received after login.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1. Dashboard

### GET `/doctor/dashboard`

Fetch the doctor's home screen data — profile summary, stats, and next upcoming appointment.

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

> `upcomingAppointment` can be `null` if no upcoming appointments exist.

---

## 2. Profile

### GET `/doctor/profile`

Fetch logged-in doctor's full profile.

**Response:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
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

Update doctor's profile. All fields are optional — send only what needs to change.

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

> `licenseNumber` cannot be updated via this endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "doctor_id",
    "fullName": "Dr. John Updated",
    "email": "dr.smith@example.com",
    "profilePhotoUrl": "/uploads/1720000000000.png",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "doctorProfile": { "...updated fields..." }
  }
}
```

---

### POST `/upload/profile-photo`

Upload a profile photo. Use the returned URL in `PUT /doctor/profile`.

**Request:** `multipart/form-data`  
**Field name:** `photo`  
**Allowed types:** JPEG, PNG, WebP

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/1720000000000.png"
  }
}
```

---

## 3. Appointments

> **Full appointment lifecycle docs** (booking, reschedule, status flow): see [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md)

### GET `/doctor/appointments`

Get doctor's appointments with optional filters.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `status` | string | `PENDING` \| `CONFIRMED` \| `COMPLETED` \| `CANCELLED` |
| `type` | string | `ONLINE` \| `IN_PERSON` |
| `upcoming` | boolean | `true` → only future PENDING/CONFIRMED |
| `today` | boolean | `true` → only today's appointments |
| `search` | string | Search by patient name |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "Appointments fetched successfully",
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
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 20,
      "totalPages": 2
    }
  }
}
```

---

### GET `/doctor/appointments/:id`

Get full detail of a single appointment.

**Response:**
```json
{
  "success": true,
  "message": "Appointment fetched successfully",
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

Update an appointment created by a patient — reschedule date/time, change type, or update notes.

Only `PENDING` or `CONFIRMED` appointments can be updated.

**Request Body** (at least one field required):

```json
{
  "dateTime": "2026-08-20T14:00:00.000Z",
  "type": "IN_PERSON",
  "notes": "Rescheduled to clinic visit"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `dateTime` | string | ISO 8601 — must be a future date/time |
| `type` | string | `ONLINE` \| `IN_PERSON` |
| `notes` | string | Appointment notes |

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
      "patientProfile": {
        "phoneNumber": "9876543210",
        "age": 25,
        "gender": "MALE"
      }
    }
  }
}
```

**Error Responses:**

```json
{ "success": false, "message": "At least one field is required: dateTime, type, or notes" }
{ "success": false, "message": "Appointment not found" }
{ "success": false, "message": "Cannot update a completed appointment" }
{ "success": false, "message": "Cannot update a cancelled appointment" }
{ "success": false, "message": "Appointment date must be in the future" }
{ "success": false, "message": "Doctor already has an appointment at this time. Please choose another slot." }
{ "success": false, "message": "Invalid type. Use ONLINE or IN_PERSON" }
```

**Use cases:**
- Reschedule when patient requests a different time
- Switch from online to in-person (or vice versa)
- Add/update doctor notes without changing status

> For status changes only (confirm / complete / cancel), use `PATCH /doctor/appointments/:id/status`.  
> See [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md) for the full doctor + patient appointment guide.

---

### PATCH `/doctor/appointments/:id/status`

Update appointment status. Doctor can confirm, complete, or cancel an appointment.

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Patient completed diet goals this week"
}
```

> `status` is required. `notes` is optional.  
> Allowed values: `CONFIRMED` | `COMPLETED` | `CANCELLED`

**Response:**
```json
{
  "success": true,
  "message": "Appointment status updated",
  "data": {
    "id": "appointment_id",
    "dateTime": "2026-08-14T10:00:00.000Z",
    "type": "ONLINE",
    "status": "CONFIRMED",
    "notes": "Patient completed diet goals",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## 4. Patients

### GET `/doctor/patients`

Get all patients who have had at least one appointment with this doctor.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Search by patient name or email |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "Patients fetched successfully",
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
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 15,
      "totalPages": 2
    }
  }
}
```

---

### GET `/doctor/patients/:id`

Get a single patient's full profile + their complete appointment history with this doctor.

**Response:**
```json
{
  "success": true,
  "message": "Patient fetched successfully",
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
      {
        "id": "apt_id_1",
        "dateTime": "2026-07-20T10:00:00.000Z",
        "type": "ONLINE",
        "status": "COMPLETED",
        "notes": "Initial consultation"
      },
      {
        "id": "apt_id_2",
        "dateTime": "2026-08-14T10:00:00.000Z",
        "type": "ONLINE",
        "status": "CONFIRMED",
        "notes": "Follow-up"
      }
    ]
  }
}
```

> Returns 400 error if the patient is not associated with this doctor.

---

## 5. Blood Reports

Two-step process:
1. Upload PDF → get `fileUrl`
2. Create blood report record → use that `fileUrl`

---

### POST `/upload/blood-report`

Upload the blood report PDF file first.

**Request:** `multipart/form-data`  
**Field name:** `file`  
**Allowed types:** PDF only  
**Max size:** 20MB

**Response:**
```json
{
  "success": true,
  "message": "Blood report uploaded successfully",
  "data": {
    "fileUrl": "/uploads/blood-reports/blood-report-1720000000000.pdf",
    "originalName": "cbc-report.pdf",
    "size": 204800
  }
}
```

---

### POST `/doctor/blood-reports`

Create a blood report record for a patient using the uploaded file URL.

> Works for patients who have had an appointment **or** have an **active package assigned** to this doctor. You can upload labs as soon as admin assigns the patient — no first visit required.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "title": "CBC Report July 2026",
  "fileUrl": "/uploads/blood-reports/blood-report-1720000000000.pdf",
  "notes": "All values within normal range. Vitamin D slightly low."
}
```

> `patientId`, `title`, `fileUrl` are required. `notes` is optional.

**Response:**
```json
{
  "success": true,
  "message": "Blood report uploaded successfully",
  "data": {
    "id": "report_id",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "title": "CBC Report July 2026",
    "fileUrl": "/uploads/blood-reports/blood-report-1720000000000.pdf",
    "notes": "All values within normal range. Vitamin D slightly low.",
    "uploadedAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T10:00:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": null
    }
  }
}
```

---

### GET `/doctor/blood-reports`

Get all blood reports uploaded by this doctor.

**Query Params:**

| Param | Type | Description |
|---|---|---|
| `patientId` | string | Filter by specific patient |
| `search` | string | Search by report title |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Response:**
```json
{
  "success": true,
  "message": "Blood reports fetched successfully",
  "data": {
    "items": [
      {
        "id": "report_id",
        "title": "CBC Report July 2026",
        "fileUrl": "/uploads/blood-reports/blood-report-123.pdf",
        "notes": "All values within normal range",
        "uploadedAt": "2026-08-13T10:00:00.000Z",
        "updatedAt": "2026-08-13T10:00:00.000Z",
        "patient": {
          "id": "patient_id",
          "fullName": "John Doe",
          "profilePhotoUrl": null
        }
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

---

### GET `/doctor/blood-reports/:id`

Get a single blood report with full patient details.

**Response:**
```json
{
  "success": true,
  "message": "Blood report fetched successfully",
  "data": {
    "id": "report_id",
    "title": "CBC Report July 2026",
    "fileUrl": "/uploads/blood-reports/blood-report-123.pdf",
    "notes": "All values within normal range",
    "uploadedAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T10:00:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": null,
      "patientProfile": {
        "age": 25,
        "gender": "MALE",
        "bloodGroup": "O_POS",
        "phoneNumber": "9876543210"
      }
    }
  }
}
```

---

### PUT `/doctor/blood-reports/:id`

Update a blood report (title, notes, or replace file).

**Request Body:** (all optional)
```json
{
  "title": "Updated CBC Report",
  "notes": "Reviewed again — Vitamin D normal now",
  "fileUrl": "/uploads/blood-reports/blood-report-new.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blood report updated successfully",
  "data": {
    "id": "report_id",
    "title": "Updated CBC Report",
    "fileUrl": "/uploads/blood-reports/blood-report-new.pdf",
    "notes": "Reviewed again — Vitamin D normal now",
    "uploadedAt": "2026-08-13T10:00:00.000Z",
    "updatedAt": "2026-08-13T13:00:00.000Z",
    "patient": {
      "id": "patient_id",
      "fullName": "John Doe",
      "profilePhotoUrl": null
    }
  }
}
```

---

### DELETE `/doctor/blood-reports/:id`

Delete a blood report.

**Response:**
```json
{
  "success": true,
  "message": "Blood report deleted successfully",
  "data": {
    "message": "Blood report deleted successfully"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request / validation error / invalid status |
| `401` | Missing or invalid JWT token |
| `403` | Access denied (not a doctor) |
| `404` | Resource not found |
| `500` | Server error |

---

## Enum Values Reference

### Appointment Status
| Value | Meaning |
|---|---|
| `PENDING` | Booked by patient, not yet confirmed |
| `CONFIRMED` | Doctor confirmed |
| `COMPLETED` | Session done |
| `CANCELLED` | Cancelled by doctor or patient |

### Appointment Type
| Value | Meaning |
|---|---|
| `ONLINE` | Video/online consultation |
| `IN_PERSON` | Physical visit |

### Gender
`MALE` | `FEMALE` | `OTHER` | `PREFER_NOT_TO_SAY`

### Blood Group
`A_POS` | `A_NEG` | `B_POS` | `B_NEG` | `AB_POS` | `AB_NEG` | `O_POS` | `O_NEG`

---

## 6. Diet Plans

See **`SERVICES_AND_DIET_PLAN_API.md`** — Part 2 for full details.

**Routes:**

| Method | Route | Description |
|---|---|---|
| `POST` | `/doctor/diet-plans` | Create / update draft plan |
| `GET` | `/doctor/diet-plans` | List my plans (filter by status, patientId) |
| `GET` | `/doctor/diet-plans/:id` | Single plan |
| `PATCH` | `/doctor/diet-plans/:id/submit` | Submit for admin approval |
| `GET` | `/doctor/patients/:patientId/diet-plan` | View current plan for a patient |

---

## 7. Service Bookings

See **`SERVICES_AND_DIET_PLAN_API.md`** — Part 1 for full details.

**Routes:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/doctor/service-bookings` | List assigned service bookings |
| `GET` | `/doctor/service-bookings/:id` | Single booking detail |
| `PATCH` | `/doctor/service-bookings/:id/schedule` | Set consultation time slot |
| `PATCH` | `/doctor/service-bookings/:id/complete` | Mark booking done + add notes |

---

## Coming Soon

| Feature | Status |
|---|---|
| Chat (WebSocket) | 📋 Scope to be defined |
