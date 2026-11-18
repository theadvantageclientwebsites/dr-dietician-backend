# Frontend update — Services

Send this to the frontend team.

## What it is

One-time paid services. **Not** a package. Patients can book them again.

| Service | Duration | Price |
|---------|----------|-------|
| One-on-One Diet Consultation | 60 min | ₹799 placeholder — admin can change |
| Lab Report Analysis | — | ₹499 |

Client rules already applied:

- Pay **100% at booking** (dummy checkout)
- Patient picks the **service**, system **assigns a doctor**
- Consult does **not** use the package’s 4 meetings/month

---

# Patient app

## Catalog

```http
GET /patient/services
GET /patient/services/:id
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-111111111111",
  "type": "ONE_ON_ONE_CONSULTATION",
  "name": "One-on-One Diet Consultation",
  "description": "...",
  "price": 799,
  "durationMinutes": 60,
  "isActive": true
}
```

`LAB_REPORT_ANALYSIS` has `durationMinutes: null`.

## Buy (dummy)

```http
POST /patient/payments/dummy-checkout
```

```json
{
  "itemType": "SERVICE",
  "itemId": "service_id",
  "preferredDateTime": "2026-08-20T10:00:00.000Z",
  "appointmentType": "ONLINE",
  "notes": "Thyroid panel attached in chat"
}
```

| Field | Required |
|-------|----------|
| `itemType` / `itemId` | Yes |
| `preferredDateTime` | Optional. Consult only. If omitted, doctor sets the time later |
| `appointmentType` | Optional. `ONLINE` (default) or `IN_PERSON` |
| `notes` | Optional patient notes |

Response includes `serviceBooking` with the assigned doctor.

Can be booked **multiple times**. No “already owned” block.

## My bookings

```http
GET /patient/service-bookings
GET /patient/service-bookings/:id
```

Statuses:

| Status | Meaning |
|--------|---------|
| `PAID` | Lab analysis assigned, doctor has not finished |
| `AWAITING_SCHEDULE` | Consult paid, waiting for doctor to set time |
| `SCHEDULED` | Consult has a calendar appointment |
| `COMPLETED` | Done (`doctorNotes` for lab analysis) |
| `CANCELLED` | Cancelled (no refunds) |

## Dashboard

`GET /patient/dashboard` now has:

- `quickActions.availableServices`
- `serviceBookings` (first 4)

---

# Doctor app

```http
GET  /doctor/service-bookings
GET  /doctor/service-bookings/:id
PATCH /doctor/service-bookings/:id/schedule   { "dateTime": "...", "type": "ONLINE" }
PATCH /doctor/service-bookings/:id/complete   { "doctorNotes": "..." }
```

- **Consult** with `AWAITING_SCHEDULE` → doctor **schedule**s a time (creates an appointment)
- **Lab analysis** → doctor **complete**s with `doctorNotes` (required)
- Completing a consult appointment (`PATCH /doctor/appointments/:id/status` → `COMPLETED`) also completes the booking
- Dashboard `stats.pendingServiceBookings`

---

# Admin

Catalog is seeded. Update consult price when the client sends it:

```http
PUT /admin/services/:id
{ "price": 999 }
```

```http
GET  /admin/services
POST /admin/services
PUT  /admin/services/:id
PATCH /admin/services/:id/status
GET  /admin/services/bookings
PATCH /admin/services/bookings/:id/assign-doctor   { "doctorId": "..." }
```

---

# UI rules

1. Services screen: two cards from `GET /patient/services`
2. **Buy** → dummy checkout `itemType: SERVICE` (full amount)
3. Do **not** let the patient pick a doctor
4. After pay → My bookings + assigned doctor name
5. Consult without time → “Doctor will schedule”
6. Lab → show `doctorNotes` when `COMPLETED`
7. Package meetings counter ignores service consults

---

# Endpoints

```text
GET    /patient/services
GET    /patient/services/:id
GET    /patient/service-bookings
GET    /patient/service-bookings/:id
POST   /patient/payments/dummy-checkout   (itemType: SERVICE)

GET    /doctor/service-bookings
PATCH  /doctor/service-bookings/:id/schedule
PATCH  /doctor/service-bookings/:id/complete

GET    /admin/services
PUT    /admin/services/:id
GET    /admin/services/bookings
PATCH  /admin/services/bookings/:id/assign-doctor
```
