# Appointments API

Complete reference for appointment booking and management across **Patient**, **Doctor**, and **Admin** roles.

## Base URL

```text
https://dr-dietician-backend.onrender.com/api
```

Local development:

```text
http://localhost:5000/api
```

## Related Docs

- Patient portal (profile, packages, payments): `PATIENT_PORTAL_API.md`
- Doctor panel (dashboard, patients, blood reports): `DOCTOR_PANEL_API.md`
- Admin appointments oversight: `ADMIN_API_COMPLETE.md` (section 5)

---

## Appointment Lifecycle

```text
Patient books appointment
        ↓
     PENDING  ←── waiting for doctor confirmation
        ↓
   CONFIRMED  ←── doctor accepts (PATCH .../status)
        ↓
   COMPLETED  ←── after visit (PATCH .../status)

At any point before COMPLETED:
  • Patient can cancel  → PATCH /patient/appointments/:id/cancel
  • Doctor can cancel   → PATCH /doctor/appointments/:id/status  { "status": "CANCELLED" }

While PENDING or CONFIRMED:
  • Doctor can reschedule / edit → PATCH /doctor/appointments/:id
```

---

## Enums

### Status

| Value | Meaning |
|-------|---------|
| `PENDING` | Booked by patient, not yet confirmed by doctor |
| `CONFIRMED` | Doctor confirmed the appointment |
| `COMPLETED` | Visit/consultation finished |
| `CANCELLED` | Cancelled by patient or doctor |

### Type

| Value | Meaning |
|-------|---------|
| `ONLINE` | Video / online consultation |
| `IN_PERSON` | Physical clinic visit |

---

## Endpoints Overview

### Patient (requires patient token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/patient/appointments/doctors` | Browse doctors for booking |
| `POST` | `/patient/appointments` | Book appointment |
| `GET` | `/patient/appointments` | My appointments list |
| `GET` | `/patient/appointments/:id` | Single appointment detail |
| `PATCH` | `/patient/appointments/:id/cancel` | Cancel my appointment |

### Doctor (requires doctor token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/doctor/appointments` | My appointments list |
| `GET` | `/doctor/appointments/:id` | Single appointment detail |
| `PATCH` | `/doctor/appointments/:id` | **Reschedule / update** (dateTime, type, notes) |
| `PATCH` | `/doctor/appointments/:id/status` | Confirm / complete / cancel |

### Admin (requires admin token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/appointments/summary` | Summary stats |
| `GET` | `/admin/appointments` | All appointments |
| `GET` | `/admin/appointments/:id` | Single appointment |
| `PATCH` | `/admin/appointments/:id/status` | Update status |
| `DELETE` | `/admin/appointments/:id` | Delete appointment |

---

# Patient APIs

Authentication:

```http
Authorization: Bearer <patient_token>
Content-Type: application/json
```

## Browse Available Doctors

```http
GET /patient/appointments/doctors
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by doctor name or specialization |
| `specialization` | string | Filter by specialization |

### Example

```text
GET /patient/appointments/doctors?specialization=Nutrition
GET /patient/appointments/doctors?search=smith
```

### Success Response

```json
{
  "success": true,
  "message": "Available doctors fetched successfully",
  "data": [
    {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "profilePhotoUrl": null,
      "doctorProfile": {
        "specialization": "Nutrition",
        "qualification": "MBBS, MD",
        "hospitalName": "City Hospital",
        "yearsOfExperience": 8,
        "phoneNumber": "9876543210"
      }
    }
  ]
}
```

---

## Book Appointment

```http
POST /patient/appointments
```

### Request Body

```json
{
  "doctorId": "doctor_id",
  "dateTime": "2026-07-25T10:00:00.000Z",
  "type": "ONLINE",
  "notes": "First consultation for thyroid issue"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `doctorId` | Yes | From browse doctors endpoint |
| `dateTime` | Yes | ISO 8601, must be in the future |
| `type` | No | `ONLINE` (default) or `IN_PERSON` |
| `notes` | No | Optional patient notes |

### Success Response (201)

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": "appointment_id",
    "dateTime": "2026-07-25T10:00:00.000Z",
    "type": "ONLINE",
    "status": "PENDING",
    "notes": "First consultation for thyroid issue",
    "createdAt": "2026-07-18T00:00:00.000Z",
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "profilePhotoUrl": null,
      "doctorProfile": {
        "specialization": "Nutrition",
        "hospitalName": "City Hospital",
        "phoneNumber": "9876543210"
      }
    }
  }
}
```

### Error Responses

```json
{ "success": false, "message": "doctorId and dateTime are required" }
{ "success": false, "message": "Doctor not found or not available" }
{ "success": false, "message": "Doctor is not approved yet" }
{ "success": false, "message": "Appointment date must be in the future" }
{ "success": false, "message": "Doctor already has an appointment at this time. Please choose another slot." }
```

---

## My Appointments List

```http
GET /patient/appointments
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` |
| `type` | string | `ONLINE` or `IN_PERSON` |
| `upcoming` | boolean | Only future PENDING/CONFIRMED |
| `past` | boolean | Only past appointments |

---

## Single Appointment Detail

```http
GET /patient/appointments/:id
```

Returns full appointment with complete doctor profile.

---

## Cancel Appointment

```http
PATCH /patient/appointments/:id/cancel
```

No request body required.

### Reschedule indicator (doctor changed time)

If the doctor rescheduled the appointment, list/detail/dashboard responses include:

| Field | Description |
|-------|-------------|
| `rescheduledByDoctor` | `true` if doctor changed the time |
| `previousDateTime` | Original time before reschedule |
| `rescheduledAt` | When the doctor rescheduled |
| `rescheduleInfo` | Ready-to-display object with `message` for UI |

Example UI: show badge **"Rescheduled by Dr. John Smith"** and strikethrough the old time.

### Rules

- Can cancel `PENDING` or `CONFIRMED` appointments
- Cannot cancel `COMPLETED` or already `CANCELLED` appointments

### Error Responses

```json
{ "success": false, "message": "Appointment is already cancelled" }
{ "success": false, "message": "Cannot cancel a completed appointment" }
{ "success": false, "message": "Appointment not found" }
```

---

# Doctor APIs

Authentication:

```http
Authorization: Bearer <doctor_token>
Content-Type: application/json
```

Doctors only see and manage appointments assigned to them.

---

## My Appointments List

```http
GET /doctor/appointments
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `type` | string | `ONLINE` or `IN_PERSON` |
| `upcoming` | boolean | Future PENDING/CONFIRMED only |
| `today` | boolean | Today's appointments only |
| `search` | string | Search by patient name |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

---

## Single Appointment Detail

```http
GET /doctor/appointments/:id
```

Returns full appointment with complete patient profile.

---

## Update Appointment (Reschedule / Edit)

Use this when a patient-created appointment needs a new time, type, or notes.

```http
PATCH /doctor/appointments/:id
```

### Request Body

At least **one** field is required:

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
| `type` | string | `ONLINE` or `IN_PERSON` |
| `notes` | string | Appointment notes |

### Rules

- Only `PENDING` or `CONFIRMED` appointments can be updated
- Cannot update `COMPLETED` or `CANCELLED` appointments
- Reschedule checks for doctor time conflicts (same slot validation as patient booking)
- Does **not** change status — use the status endpoint for that
- When `dateTime` is changed, patient APIs automatically expose reschedule info (see below)

### Patient-visible reschedule info

When a doctor changes the appointment time, patient-facing responses include:

```json
{
  "dateTime": "2026-08-20T14:00:00.000Z",
  "previousDateTime": "2026-08-14T10:00:00.000Z",
  "rescheduledByDoctor": true,
  "rescheduledAt": "2026-08-13T12:30:00.000Z",
  "rescheduleInfo": {
    "rescheduledByDoctor": true,
    "rescheduledAt": "2026-08-13T12:30:00.000Z",
    "previousDateTime": "2026-08-14T10:00:00.000Z",
    "message": "Rescheduled by Dr. John Smith"
  }
}
```

Show this in the patient app as a badge or banner, e.g. **"Rescheduled by your doctor"** with the previous time crossed out.

Returned on:
- `GET /patient/appointments`
- `GET /patient/appointments/:id`
- `GET /patient/dashboard` (`upcomingAppointment`)

When `rescheduleInfo` is `null`, the appointment was not rescheduled by the doctor.

### Success Response

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

### Error Responses

```json
{ "success": false, "message": "At least one field is required: dateTime, type, or notes" }
{ "success": false, "message": "Appointment not found" }
{ "success": false, "message": "Cannot update a completed appointment" }
{ "success": false, "message": "Cannot update a cancelled appointment" }
{ "success": false, "message": "Invalid dateTime format. Use ISO 8601" }
{ "success": false, "message": "Appointment date must be in the future" }
{ "success": false, "message": "Doctor already has an appointment at this time. Please choose another slot." }
{ "success": false, "message": "Invalid type. Use ONLINE or IN_PERSON" }
```

### Use Cases

- Patient asks to move appointment to another day/time
- Switch from online to in-person (or vice versa)
- Add or update doctor notes without changing status

---

## Update Appointment Status

```http
PATCH /doctor/appointments/:id/status
```

### Request Body

```json
{
  "status": "CONFIRMED",
  "notes": "Patient completed diet goals this week"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `status` | Yes | `CONFIRMED`, `COMPLETED`, or `CANCELLED` |
| `notes` | No | Optional notes update |

### Success Response

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

# Admin APIs (Summary)

Full admin docs: `ADMIN_API_COMPLETE.md`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/appointments/summary` | Total, today, by-status counts |
| `GET` | `/admin/appointments` | List all with filters |
| `GET` | `/admin/appointments/:id` | Single appointment |
| `PATCH` | `/admin/appointments/:id/status` | Update any appointment status |
| `DELETE` | `/admin/appointments/:id` | Delete appointment |

---

# Complete Endpoint List

```text
# Patient
GET   /api/patient/appointments/doctors
POST  /api/patient/appointments
GET   /api/patient/appointments
GET   /api/patient/appointments/:id
PATCH /api/patient/appointments/:id/cancel

# Doctor
GET   /api/doctor/appointments
GET   /api/doctor/appointments/:id
PATCH /api/doctor/appointments/:id
PATCH /api/doctor/appointments/:id/status

# Admin
GET    /api/admin/appointments/summary
GET    /api/admin/appointments
GET    /api/admin/appointments/:id
PATCH  /api/admin/appointments/:id/status
DELETE /api/admin/appointments/:id
```

---

# Frontend Integration Guide

## Patient booking flow

```js
// 1. Browse doctors
const { data: doctors } = await fetch("/api/patient/appointments/doctors", {
  headers: { Authorization: `Bearer ${patientToken}` }
}).then(r => r.json());

// 2. Book appointment
const { data: booking } = await fetch("/api/patient/appointments", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${patientToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    doctorId: "selected_doctor_id",
    dateTime: "2026-07-25T10:00:00.000Z",
    type: "ONLINE",
    notes: "Thyroid consultation"
  })
}).then(r => r.json());
// booking.status === "PENDING"
```

## Doctor management flow

```js
// 1. View pending appointments
const { data } = await fetch("/api/doctor/appointments?status=PENDING", {
  headers: { Authorization: `Bearer ${doctorToken}` }
}).then(r => r.json());

// 2. Confirm appointment
await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${doctorToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ status: "CONFIRMED" })
});

// 3. Reschedule if needed
await fetch(`/api/doctor/appointments/${appointmentId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${doctorToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    dateTime: "2026-08-20T14:00:00.000Z",
    type: "IN_PERSON",
    notes: "Moved to clinic"
  })
});

// 4. Mark complete after visit
await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${doctorToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ status: "COMPLETED" })
});
```

## Who can do what

| Action | Patient | Doctor | Admin |
|--------|---------|--------|-------|
| Book appointment | Yes | No | No |
| View own appointments | Yes | Yes (assigned) | Yes (all) |
| Cancel | Yes (`/cancel`) | Yes (`status: CANCELLED`) | Yes (status/delete) |
| Confirm | No | Yes | Yes |
| Reschedule (dateTime/type) | No | Yes (`PATCH /:id`) | No |
| Mark completed | No | Yes | Yes |
| Update notes | On book only | Yes (both endpoints) | No |

---

# Key Notes

- Appointments are always created by **patients** — doctors manage them after booking
- `dateTime` must be ISO 8601 and in the future when booking or rescheduling
- No available-slots API yet — patient/doctor picks time manually; backend rejects conflicts
- Patient reschedule API is not built yet — only doctor can reschedule for now
- Dashboard widgets (`/patient/dashboard`, `/doctor/dashboard`) show upcoming appointment summaries

## Coming Soon

- Doctor availability / time slots API
- Patient-side appointment reschedule
- Appointment payment / consultation fee (if required by client)
