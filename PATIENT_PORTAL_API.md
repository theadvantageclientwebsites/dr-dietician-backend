# Patient Portal — Frontend API Reference

> **Base URL (Production):** `https://dr-dietician-backend.onrender.com/api`
> **Base URL (Local):** `http://localhost:5000/api`
> **Swagger UI:** `/api/docs`

## Authentication

```http
POST /auth/login
{ "email": "patient@example.com", "password": "12345678" }
```

All patient requests need:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Quick Reference — All Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient/dashboard` | Home dashboard |
| GET | `/patient/profile` | My profile |
| PUT | `/patient/profile` | Update profile |
| POST | `/upload/profile-photo` | Upload profile photo |
| GET | `/patient/appointments/doctors` | Browse available doctors |
| GET | `/patient/appointments` | My appointments |
| POST | `/patient/appointments` | Book appointment |
| GET | `/patient/appointments/:id` | Single appointment detail |
| PATCH | `/patient/appointments/:id/cancel` | Cancel appointment |
| GET | `/patient/packages` | Browse packages |
| GET | `/patient/packages/:id` | Package detail |
| GET | `/patient/subscriptions/active` | My current active package |
| GET | `/patient/subscriptions` | My package purchase history |
| GET | `/patient/services` | Browse one-time services |
| GET | `/patient/services/:id` | Service detail |
| GET | `/patient/service-bookings` | My paid service bookings |
| GET | `/patient/service-bookings/:id` | Single service booking |
| GET | `/patient/digital-products` | Browse digital products |
| GET | `/patient/digital-products/:id` | Digital product detail |
| GET | `/patient/library` | My owned products (purchased + freebies) |
| POST | `/patient/payments/dummy-checkout` | Buy (use this — Razorpay not live yet) |
| POST | `/patient/payments/create-order` | Create Razorpay order (save for later) |
| POST | `/patient/payments/verify` | Verify Razorpay payment |
| GET | `/patient/payments/my-orders` | Purchase history |
| GET | `/patient/diet-plan` | My diet plan |
| GET | `/patient/blood-reports` | My blood reports |

---

## 1. Dashboard

### GET `/patient/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "patient_id",
      "fullName": "Ayush Butola",
      "email": "ayush@example.com",
      "profilePhotoUrl": null,
      "memberSince": "2026-06-28T00:00:00.000Z",
      "vitals": {
        "gender": "MALE",
        "age": 25,
        "heightCm": 175,
        "weightKg": 70,
        "bloodGroup": "O_POS",
        "location": "Delhi",
        "bmi": 22.9,
        "bmiStatus": "Normal",
        "vitalsStatus": "Normal"
      }
    },
    "upcomingAppointment": {
      "id": "appointment_id",
      "dateTime": "2026-07-20T10:00:00.000Z",
      "type": "ONLINE",
      "status": "CONFIRMED",
      "notes": "Follow-up",
      "rescheduledByDoctor": false,
      "rescheduleInfo": null,
      "doctor": {
        "id": "doctor_id",
        "fullName": "Dr. Smith",
        "profilePhotoUrl": null,
        "doctorProfile": {
          "specialization": "Nutrition",
          "hospitalName": "City Hospital",
          "phoneNumber": "9876543210"
        }
      }
    },
    "nextCheckup": { "days": 2, "label": "2 days" },
    "stats": { "totalAppointments": 5 },
    "activePackage": {
      "id": "sub_id",
      "status": "ACTIVE",
      "duration": "THREE_MONTHS",
      "meetingsPerMonth": 4,
      "meetingsUsedThisMonth": 1,
      "meetingsRemainingThisMonth": 3,
      "meetingsLabel": "3 of 4 meetings left this month",
      "endsAt": "2026-11-14T00:00:00.000Z",
      "package": { "name": "Thyroid Management", "category": "Thyroid" },
      "doctor": { "id": "doctor_id", "fullName": "Dr. John Smith", "doctorProfile": { "specialization": "Nutrition" } }
    },
    "dietPlan": {
      "visible": false,
      "patientStatus": "IN_PROGRESS",
      "message": "Your dietitian is preparing your plan",
      "plan": null
    },
    "quickActions": {
      "availablePackages": 4,
      "availableDigitalProducts": 8,
      "availableServices": 2
    },
    "library": {
      "items": [],
      "pagination": { "totalItems": 0, "page": 1, "limit": 4, "totalPages": 0 }
    }
  }
}
```

**Key notes:**
- `upcomingAppointment` → `null` if none
- `activePackage` → `null` if no package purchased
- `nextCheckup.label` → `"Today"` / `"Tomorrow"` / `"X days"` / `null`
- `vitals.bmiStatus` → `"Underweight"` / `"Normal"` / `"Overweight"` / `"Obese"`
- `vitals.vitalsStatus` → `"Normal"` if height/weight/bloodGroup all filled, else `"Incomplete"`
- `dietPlan.visible` → show meal content only when `true`
- When doctor rescheduled: `rescheduleInfo.message` = `"Rescheduled by Dr. John Smith"` — show as banner

---

## 2. Profile

### GET `/patient/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "patient_id",
    "fullName": "Ananya Sharma",
    "email": "ananya@example.com",
    "profilePhotoUrl": null,
    "isEmailVerified": false,
    "lastLoginAt": "2026-07-18T00:00:00.000Z",
    "createdAt": "2026-06-28T00:00:00.000Z",
    "patientProfile": {
      "gender": "FEMALE",
      "location": "Hyderabad",
      "phoneNumber": "9876543210",
      "whatsappNumber": "9876543210",
      "age": 28,
      "heightCm": 162,
      "weightKg": 65,
      "bloodGroup": "B_POS",
      "socialHandle": "@ananya",
      "isDefencePersonnel": false,
      "bmi": 24.8,
      "bmiStatus": "Normal"
    }
  }
}
```

---

### PUT `/patient/profile`

All fields optional.

**Request Body:**
```json
{
  "fullName": "Ananya Updated",
  "patientProfile": {
    "phoneNumber": "9999999999",
    "whatsappNumber": "9999999999",
    "location": "Hyderabad",
    "age": 29,
    "heightCm": 163,
    "weightKg": 63,
    "bloodGroup": "B_POS",
    "gender": "FEMALE",
    "socialHandle": "@ananya_new",
    "isDefencePersonnel": false
  }
}
```

> Email cannot be changed by patient.

---

### POST `/upload/profile-photo`

- **Request:** `multipart/form-data`, field: `photo`
- Photo is automatically saved to profile — no second call needed.

**Response:**
```json
{ "success": true, "data": { "profilePhotoUrl": "/uploads/1720000000000.png" } }
```

---

## 3. Appointments

### GET `/patient/appointments/doctors`

Browse approved doctors for booking.

**Query Params:** `search` (name/specialization), `specialization`

**Response:**
```json
{
  "success": true,
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

> **Important:** If patient has an active package with an assigned doctor, this endpoint returns **only that doctor** (pre-select them). If waiting for assignment → empty list.

---

### POST `/patient/appointments`

**Request Body:**
```json
{
  "doctorId": "doctor_id",
  "dateTime": "2026-07-25T10:00:00.000Z",
  "type": "ONLINE",
  "notes": "First consultation for thyroid issue"
}
```

> `doctorId` and `dateTime` required. `type` defaults to `ONLINE`. `dateTime` must be future ISO 8601.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "appointment_id",
    "dateTime": "2026-07-25T10:00:00.000Z",
    "type": "ONLINE",
    "status": "PENDING",
    "notes": "First consultation for thyroid issue",
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "profilePhotoUrl": null,
      "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
    }
  }
}
```

**Package-related errors (handle in UI):**

| Error message | What to show |
|---|---|
| `An active package is required to book an appointment` | CTA: buy a package |
| `Your package is waiting for admin to assign a doctor` | Show waiting state |
| `You can only book appointments with your assigned package doctor` | Use `activePackage.doctor.id` |
| `Monthly appointment limit reached (4 meetings). Try again next month.` | Disable book button |

---

### GET `/patient/appointments`

**Query Params:**

| Param | Description |
|---|---|
| `status` | `PENDING` \| `CONFIRMED` \| `COMPLETED` \| `CANCELLED` |
| `type` | `ONLINE` \| `IN_PERSON` |
| `upcoming` | `true` → future only |
| `past` | `true` → past only |
| `page` / `limit` | Pagination |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "appointment_id",
        "dateTime": "2026-07-25T10:00:00.000Z",
        "type": "ONLINE",
        "status": "CONFIRMED",
        "notes": "Thyroid consultation",
        "rescheduledByDoctor": true,
        "rescheduledAt": "2026-08-13T12:30:00.000Z",
        "previousDateTime": "2026-07-20T10:00:00.000Z",
        "rescheduleInfo": {
          "rescheduledByDoctor": true,
          "rescheduledAt": "2026-08-13T12:30:00.000Z",
          "previousDateTime": "2026-07-20T10:00:00.000Z",
          "message": "Rescheduled by Dr. John Smith"
        },
        "doctor": {
          "id": "doctor_id",
          "fullName": "Dr. John Smith",
          "profilePhotoUrl": null,
          "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital", "phoneNumber": "9876543210" }
        }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 5, "totalPages": 1 }
  }
}
```

> When `rescheduleInfo` is not null → show banner: **"Rescheduled by Dr. John Smith"** with old time crossed out.

---

### GET `/patient/appointments/:id`

Full detail with complete doctor profile. Same shape as list item.

---

### PATCH `/patient/appointments/:id/cancel`

No request body. Can cancel `PENDING` or `CONFIRMED` only.

**Errors:**
```json
{ "success": false, "message": "Appointment is already cancelled" }
{ "success": false, "message": "Cannot cancel a completed appointment" }
```

---

## 4. Packages

### GET `/patient/packages`

**Query Params:** `search`, `category`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "package_id",
      "name": "Thyroid Management",
      "category": "Thyroid",
      "description": "Specialized diet plan for thyroid health",
      "price3Months": 5499,
      "price6Months": 9999,
      "price12Months": 17999,
      "features": ["Weekly diet plan", "Blood report review", "Monthly consultation"],
      "isActive": true
    }
  ]
}
```

> Show **3 / 6 / 12 month** pricing tabs. No 1-month option.

---

### GET `/patient/packages/:id`

Single active package with `freebies` for 12-month tier:

```json
{
  "id": "package_id",
  "name": "Thyroid Management",
  "price3Months": 5499,
  "price6Months": 9999,
  "price12Months": 17999,
  "freebies": [
    { "id": "product_id", "title": "Thyroid Diet Guide", "thumbnailUrl": "...", "previewUrl": "..." }
  ]
}
```

> Show "Includes free: Thyroid Guide, Recipe Book" on the 12-month card.

---

## 5. Subscriptions (Package Purchases)

### GET `/patient/subscriptions/active`

Returns current package or `null`.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sub_id",
    "status": "ACTIVE",
    "duration": "THREE_MONTHS",
    "meetingsPerMonth": 4,
    "meetingsUsedThisMonth": 1,
    "meetingsRemainingThisMonth": 3,
    "meetingsLabel": "3 of 4 meetings left this month",
    "startsAt": "2026-08-14T03:30:00.000Z",
    "endsAt": "2026-11-14T03:30:00.000Z",
    "assignedAt": "2026-08-14T04:00:00.000Z",
    "package": { "id": "pkg_id", "name": "Thyroid Management", "category": "Thyroid" },
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "profilePhotoUrl": null,
      "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
    }
  }
}
```

> Always use `meetingsLabel` or `meetingsRemainingThisMonth` for display — **never** `meetingsUsedThisMonth`.

**Status values:**

| Status | Show |
|---|---|
| `PENDING_ASSIGNMENT` | "Waiting for doctor assignment" |
| `ACTIVE` | Show doctor + meetings |
| `EXPIRED` | Expired |
| `CANCELLED` | Cancelled |

---

### GET `/patient/subscriptions`

All past and present subscriptions. **Query Params:** `status`, `page`, `limit`

---

## 6. Services (One-Time Bookings)

Two service types:

| Type | Name | Price | Notes |
|---|---|---|---|
| `ONE_ON_ONE_CONSULTATION` | One-on-One Diet Consultation | ₹799 | 60 min, doctor auto-assigned |
| `LAB_REPORT_ANALYSIS` | Lab Report Analysis | ₹499 | Doctor reviews reports |

**Flow:** Browse → Pay (`dummy-checkout` with `itemType: SERVICE`) → Booking auto-created → Doctor schedules/completes

---

### GET `/patient/services`

**Query Params:** `type`

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
        "description": "60-minute 1:1 consultation. Pay in full at booking. A doctor is assigned automatically.",
        "price": 799,
        "durationMinutes": 60,
        "isActive": true
      },
      {
        "id": "service_id_2",
        "type": "LAB_REPORT_ANALYSIS",
        "name": "Lab Report Analysis",
        "description": "Dietitian reviews your lab/blood reports and shares notes.",
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

Single service — same shape as above.

---

### GET `/patient/service-bookings`

**Query Params:** `status`, `type`, `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "booking_id",
        "status": "AWAITING_SCHEDULE",
        "patientNotes": "Prefer morning slots",
        "doctorNotes": null,
        "preferredDateTime": null,
        "appointmentType": "ONLINE",
        "completedAt": null,
        "createdAt": "2026-08-13T10:00:00.000Z",
        "service": { "type": "ONE_ON_ONE_CONSULTATION", "name": "One-on-One Diet Consultation", "price": 799 },
        "doctor": {
          "id": "doctor_id",
          "fullName": "Dr. John Smith",
          "profilePhotoUrl": null,
          "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
        },
        "appointment": { "id": "appointment_id", "dateTime": "2026-08-20T10:00:00.000Z", "type": "ONLINE", "status": "PENDING" },
        "order": { "amount": 799, "status": "PAID", "paidAt": "2026-08-13T10:00:00.000Z" }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 2, "totalPages": 1 }
  }
}
```

> `appointment` is `null` for `LAB_REPORT_ANALYSIS`.

**Booking status UI:**

| Status | Show |
|---|---|
| `PAID` | Lab analysis — doctor will review |
| `AWAITING_SCHEDULE` | "Doctor will schedule your appointment soon" |
| `SCHEDULED` | Show appointment date/time |
| `COMPLETED` | Show `doctorNotes` if present |
| `CANCELLED` | — |

---

### GET `/patient/service-bookings/:id`

Single booking — same shape as list item.

---

## 7. Digital Products

### GET `/patient/digital-products`

**Query Params:** `search`, `category`, `isFree`, `language`, `minPrice`, `maxPrice`, `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "product_id",
        "title": "Thyroid Diet Guide",
        "category": "Thyroid",
        "price": 299,
        "description": "Complete guide for thyroid patients",
        "thumbnailUrl": "/uploads/digital-products/thumbnails/dp-thumb-123.png",
        "previewUrl": "/uploads/digital-products/previews/preview-123.pdf",
        "fileUrl": null,
        "author": "Dr. Smith",
        "pageCount": 45,
        "language": "English",
        "isFree": false,
        "hasAccess": false,
        "accessType": null,
        "totalSales": 12
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 8, "totalPages": 1 }
  }
}
```

**Key fields:**

| Field | Use |
|---|---|
| `previewUrl` | Always show **Preview (2 pages)** — even before buy |
| `fileUrl` | Full PDF. `null` until owned |
| `hasAccess` | `true` → show **Download / Read** |
| `accessType` | `PURCHASED` \| `PACKAGE_FREEBIE` \| `FREE` \| `null` |

> Buy only if `hasAccess === false` and `isFree === false`. Free products (`isFree: true`) have `hasAccess: true` and `fileUrl` already set.

---

### GET `/patient/digital-products/:id`

Same fields as above. `fileUrl` present if `hasAccess: true`.

---

### GET `/patient/library`

Owned products — purchases + 12-month package freebies. All items have `fileUrl`.

**Query Params:** `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "product_id",
        "title": "Thyroid Diet Guide",
        "fileUrl": "/uploads/digital-products/files/dp-file-123.pdf",
        "previewUrl": "...",
        "thumbnailUrl": "...",
        "accessType": "PURCHASED"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 3, "totalPages": 1 }
  }
}
```

---

## 8. Payments

> **Razorpay is not live yet. Use `dummy-checkout` for all purchases.**

### POST `/patient/payments/dummy-checkout`  ← USE THIS NOW

Instantly marks order as PAID without Razorpay.

**Buy a Package:**
```json
{
  "itemType": "PACKAGE",
  "itemId": "package_id",
  "duration": "THREE_MONTHS"
}
```

**Buy a Digital Product:**
```json
{
  "itemType": "DIGITAL_PRODUCT",
  "itemId": "product_id"
}
```

**Buy a Service:**
```json
{
  "itemType": "SERVICE",
  "itemId": "service_id",
  "preferredDateTime": "2026-08-20T10:00:00.000Z",
  "appointmentType": "ONLINE",
  "notes": "Prefer morning slots"
}
```

> For SERVICE: `preferredDateTime` optional (consultation only). If omitted, doctor sets time later.

**Duration values for PACKAGE:**

| UI label | `duration` value |
|---|---|
| 3 Months | `THREE_MONTHS` |
| 6 Months | `SIX_MONTHS` |
| 12 Months | `TWELVE_MONTHS` |

**Response (package):**
```json
{
  "success": true,
  "data": {
    "dummy": true,
    "orderId": "order_uuid",
    "itemType": "PACKAGE",
    "itemName": "Thyroid Management - 3 Months",
    "amount": 5499,
    "paidAt": "2026-08-14T03:30:00.000Z",
    "subscription": {
      "id": "sub_id",
      "status": "PENDING_ASSIGNMENT",
      "duration": "THREE_MONTHS",
      "meetingsPerMonth": 4,
      "endsAt": "2026-11-14T03:30:00.000Z",
      "doctor": null,
      "package": { "id": "pkg_id", "name": "Thyroid Management", "category": "Thyroid" }
    }
  }
}
```

After package buy: show **"Payment successful. Admin will assign a doctor shortly."**

**Errors:**
```json
{ "success": false, "message": "You already have an active package. Wait until it expires before buying another." }
{ "success": false, "message": "You already have access to this product" }
{ "success": false, "message": "duration is required for package purchase (THREE_MONTHS, SIX_MONTHS, TWELVE_MONTHS)" }
```

---

### POST `/patient/payments/create-order`  ← FOR LATER (Razorpay)

**Request Body:**
```json
{
  "itemType": "PACKAGE",
  "itemId": "package_id",
  "duration": "THREE_MONTHS"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_QzXvYz123456",
    "amount": 549900,
    "currency": "INR",
    "keyId": "rzp_test_xxx",
    "itemName": "Thyroid Management - 3 Months",
    "dbOrderId": "internal_order_id"
  }
}
```

> `amount` is in **paise** (₹5499 = 549900 paise).

**Razorpay JS integration:**
```js
const options = {
  key: orderData.keyId,
  amount: orderData.amount,
  currency: orderData.currency,
  order_id: orderData.orderId,
  name: "DrDiet Therapy",
  description: orderData.itemName,
  handler: async (response) => {
    await fetch("/api/patient/payments/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      }),
    });
  },
  theme: { color: "#0d9488" },
};
new window.Razorpay(options).open();
```

**Test card:** `4111 1111 1111 1111`, any future expiry, CVV `123`, OTP `1234`

---

### POST `/patient/payments/verify`  ← FOR LATER (Razorpay)

```json
{
  "razorpayOrderId": "order_QzXvYz123456",
  "razorpayPaymentId": "pay_QzXvYz789012",
  "razorpaySignature": "abc123def456..."
}
```

---

### GET `/patient/payments/my-orders`

**Query Params:** `status` (`PENDING` | `PAID` | `FAILED` | `REFUNDED`), `itemType` (`PACKAGE` | `DIGITAL_PRODUCT` | `SERVICE`), `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemName": "Thyroid Management - 3 Months",
        "amount": 5499,
        "currency": "INR",
        "duration": "THREE_MONTHS",
        "status": "PAID",
        "paidAt": "2026-08-14T03:30:00.000Z",
        "createdAt": "2026-08-14T03:28:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 3, "totalPages": 1 }
  }
}
```

> `amount` here is in ₹ (rupees), not paise. Use for display.

---

## 9. Diet Plan

### GET `/patient/diet-plan`

Full meal content only visible after admin approves.

**Case 1 — No package:**
```json
{ "visible": false, "patientStatus": "NO_PACKAGE", "message": "Buy a package to get a personal diet plan", "plan": null }
```

**Case 2 — Waiting for doctor assignment:**
```json
{ "visible": false, "patientStatus": "WAITING_FOR_DOCTOR_ASSIGNMENT", "message": "Admin will assign a doctor, then your diet plan will be prepared", "plan": null }
```

**Case 3 — Doctor working on plan:**
```json
{ "visible": false, "patientStatus": "IN_PROGRESS", "message": "Your dietitian is preparing your plan", "plan": null }
```

**Case 4 — Under admin review:**
```json
{ "visible": false, "patientStatus": "PENDING_APPROVAL", "message": "Your diet plan is being reviewed", "plan": null }
```

**Case 5 — Approved ✅ (show full content):**
```json
{
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
    "doctor": { "fullName": "Dr. John Smith", "doctorProfile": { "specialization": "Nutrition" } }
  }
}
```

**UI rule:** `visible === false` → show message/status screen only. `visible === true` → show full diet plan.

**`patientStatus` values:**

| Value | Show |
|---|---|
| `NO_PACKAGE` | "Buy a package" CTA |
| `WAITING_FOR_DOCTOR_ASSIGNMENT` | Waiting banner |
| `IN_PROGRESS` | "Dietitian is preparing your plan" |
| `PENDING_APPROVAL` | "Being reviewed" |
| `APPROVED` | Full plan |

> Do NOT show overdue or rejected status to the patient.

---

## 10. Blood Reports

### GET `/patient/blood-reports`

**Query Params:** `page`, `limit`

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
        "doctor": {
          "id": "doctor_id",
          "fullName": "Dr. John Smith",
          "profilePhotoUrl": null,
          "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
        }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "totalItems": 2, "totalPages": 1 }
  }
}
```

> Read-only for patients. Upload/delete is done by doctors.

---

## Enum Reference

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
`THREE_MONTHS` | `SIX_MONTHS` | `TWELVE_MONTHS`

### Service Booking Status
`PAID` | `AWAITING_SCHEDULE` | `SCHEDULED` | `COMPLETED` | `CANCELLED`

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
| `403` | Not a patient |
| `404` | Not found |
| `500` | Server error |
