# Patient Portal API

## Base URL

```text
https://dr-dietician-backend.onrender.com/api
```

Local development:

```text
http://localhost:5000/api
```

## Authentication

All patient endpoints require patient authentication.

```http
Authorization: Bearer <patient_token>
Content-Type: application/json
```

Get your token by logging in:

```http
POST /api/auth/login
{ "email": "patient@example.com", "password": "12345678" }
```

## Related Docs

- **Appointments** (booking, cancel, doctor reschedule): [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md)
- **Packages + dummy payment (frontend)**: [`FRONTEND_PACKAGES_UPDATE.md`](./FRONTEND_PACKAGES_UPDATE.md)
- **Diet plans (frontend)**: [`FRONTEND_DIET_PLAN.md`](./FRONTEND_DIET_PLAN.md)
- **Digital products (library + preview)**: [`FRONTEND_DIGITAL_PRODUCTS.md`](./FRONTEND_DIGITAL_PRODUCTS.md)
- **Services (1:1 consult + lab analysis)**: [`FRONTEND_SERVICES.md`](./FRONTEND_SERVICES.md)
- **Payments** (Razorpay): [`PAYMENTS_AND_REVENUE_API.md`](./PAYMENTS_AND_REVENUE_API.md)

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/patient/dashboard` | Home dashboard |
| `GET` | `/patient/profile` | Get my profile |
| `PUT` | `/patient/profile` | Update my profile |
| `POST` | `/upload/profile-photo` | Update profile photo |
| `GET` | `/patient/appointments/doctors` | Browse doctors for booking |
| `GET` | `/patient/appointments` | My appointments |
| `POST` | `/patient/appointments` | Book appointment |
| `GET` | `/patient/appointments/:id` | Single appointment detail |
| `PATCH` | `/patient/appointments/:id/cancel` | Cancel appointment |
| `GET` | `/patient/packages` | Browse packages |
| `GET` | `/patient/packages/:id` | Package detail |
| `GET` | `/patient/digital-products` | Browse digital products |
| `GET` | `/patient/digital-products/:id` | Digital product detail |
| `GET` | `/patient/services` | Browse one-time services |
| `GET` | `/patient/service-bookings` | My paid service bookings |
| `POST` | `/patient/payments/create-order` | Create Razorpay order |
| `POST` | `/patient/payments/verify` | Verify payment after success |
| `GET` | `/patient/payments/my-orders` | My purchase history |
| `GET` | `/patient/blood-reports` | My blood reports (uploaded by doctors) |

---

# 1) Patient Dashboard

### Endpoint

```http
GET /patient/dashboard
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/patient/dashboard
```

### Success Response

```json
{
  "success": true,
  "message": "Patient dashboard fetched successfully",
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
      "notes": "Follow-up consultation",
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
    "nextCheckup": {
      "days": 2,
      "label": "2 days"
    },
    "stats": {
      "totalAppointments": 5
    },
    "quickActions": {
      "availablePackages": 4,
      "availableDigitalProducts": 8
    },
    "dietPlan": null,
    "recentActivity": []
  }
}
```

### Field Notes

- `upcomingAppointment` → `null` if no upcoming appointments
- `nextCheckup.label` → `"Today"` / `"Tomorrow"` / `"X days"` / `null`
- `vitals.bmiStatus` → `"Underweight"` / `"Normal"` / `"Overweight"` / `"Obese"`
- `vitals.vitalsStatus` → `"Normal"` if height, weight, bloodGroup all filled; else `"Incomplete"`
- `dietPlan` → currently `null` (coming soon)
- `recentActivity` → currently `[]` (coming soon)

---

# 2) Patient Profile

## Get Profile

### Endpoint

```http
GET /patient/profile
```

### Full URL

```text
https://dr-dietician-backend.onrender.com/api/patient/profile
```

### Success Response

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "patient_id",
    "fullName": "Ananya Sharma",
    "email": "ananya.sharma@email.com",
    "profilePhotoUrl": null,
    "isEmailVerified": false,
    "lastLoginAt": "2026-07-18T00:00:00.000Z",
    "createdAt": "2026-06-28T00:00:00.000Z",
    "patientProfile": {
      "gender": "FEMALE",
      "location": "Banjara Hills, Hyderabad",
      "phoneNumber": "+91 98765 43210",
      "whatsappNumber": "+91 98765 43210",
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

## Update Profile

### Endpoint

```http
PUT /patient/profile
```

All fields are optional — only send what needs to change.

### Request Body

```json
{
  "fullName": "Ananya Sharma Updated",
  "patientProfile": {
    "phoneNumber": "+91 99999 99999",
    "whatsappNumber": "+91 99999 99999",
    "location": "Jubilee Hills, Hyderabad",
    "age": 29,
    "heightCm": 163,
    "weightKg": 63,
    "bloodGroup": "B_POS",
    "gender": "FEMALE",
    "socialHandle": "@ananya_updated",
    "isDefencePersonnel": false
  }
}
```

### Field Notes

**User Level (optional):**
- `fullName` → string
- `profilePhotoUrl` → string (use upload endpoint instead)

**Patient Profile (optional, inside `patientProfile`):**
- `gender` → `MALE` | `FEMALE` | `OTHER` | `PREFER_NOT_TO_SAY`
- `location` → string
- `phoneNumber` → string
- `whatsappNumber` → string
- `age` → number
- `heightCm` → number
- `weightKg` → number
- `bloodGroup` → `A_POS` | `A_NEG` | `B_POS` | `B_NEG` | `AB_POS` | `AB_NEG` | `O_POS` | `O_NEG`
- `socialHandle` → string
- `isDefencePersonnel` → boolean

**Note:** Email cannot be changed by the patient.

---

## Update Profile Photo

Use the upload endpoint — it automatically saves to the patient's profile:

```http
POST /upload/profile-photo
Authorization: Bearer <patient_token>
Content-Type: multipart/form-data
```

Form field: `photo` (image file)

```js
const formData = new FormData();
formData.append("photo", imageFile);

fetch("https://dr-dietician-backend.onrender.com/api/upload/profile-photo", {
  method: "POST",
  headers: { Authorization: `Bearer ${patientToken}` },
  body: formData
});
```

---

# 3) Appointments

> **Full appointment lifecycle docs** (patient booking, doctor reschedule, admin oversight): see [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md)

## Browse Available Doctors

### Endpoint

```http
GET /patient/appointments/doctors
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by doctor name or specialization |
| `specialization` | string | Filter by specialization |

### Example URLs

```text
GET /patient/appointments/doctors
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

### Endpoint

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

### Field Notes

- `doctorId` → string (required, get from browse doctors endpoint)
- `dateTime` → ISO 8601 format (required, must be future date)
- `type` → `ONLINE` | `IN_PERSON` (default: `ONLINE`)
- `notes` → string (optional)

### Success Response

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

### Frontend Booking Flow

```js
// 1. Browse doctors
const doctors = await fetch("/api/patient/appointments/doctors", {
  headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json());

// 2. Patient selects doctor and picks date/time

// 3. Book appointment
const booking = await fetch("/api/patient/appointments", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    doctorId: "selected_doctor_id",
    dateTime: "2026-07-25T10:00:00.000Z",
    type: "ONLINE",
    notes: "Thyroid consultation"
  })
}).then(r => r.json());
```

**Note:** There is no available-slots API yet. The patient picks a date/time manually; the backend rejects conflicting times on book. Doctors can reschedule via `PATCH /doctor/appointments/:id` — see [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md).

---

## My Appointments List

### Endpoint

```http
GET /patient/appointments
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number | `1` |
| `limit` | number | Items per page | `10` |
| `status` | string | Filter by status | `CONFIRMED` |
| `type` | string | Filter by type | `ONLINE` |
| `upcoming` | boolean | Only future appointments | `true` |
| `past` | boolean | Only past appointments | `true` |

### Status Values

- `PENDING` — Waiting for doctor confirmation
- `CONFIRMED` — Doctor confirmed
- `COMPLETED` — Appointment done
- `CANCELLED` — Cancelled

### Example URLs

```text
GET /patient/appointments
GET /patient/appointments?upcoming=true
GET /patient/appointments?past=true
GET /patient/appointments?status=CONFIRMED
GET /patient/appointments?type=ONLINE&page=1&limit=10
```

### Success Response

```json
{
  "success": true,
  "message": "Appointments fetched successfully",
  "data": {
    "items": [
      {
        "id": "appointment_id",
        "dateTime": "2026-07-25T10:00:00.000Z",
        "type": "ONLINE",
        "status": "CONFIRMED",
        "notes": "Thyroid consultation",
        "createdAt": "2026-07-18T00:00:00.000Z",
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
          "doctorProfile": {
            "specialization": "Nutrition",
            "hospitalName": "City Hospital",
            "clinicAddress": "123 Main Street",
            "phoneNumber": "9876543210"
          }
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

## Single Appointment Detail

### Endpoint

```http
GET /patient/appointments/:id
```

Returns full appointment with complete doctor profile.

### Success Response

```json
{
  "success": true,
  "message": "Appointment fetched successfully",
  "data": {
    "id": "appointment_id",
    "dateTime": "2026-07-25T10:00:00.000Z",
    "type": "ONLINE",
    "status": "CONFIRMED",
    "notes": "Thyroid consultation",
    "createdAt": "2026-07-18T00:00:00.000Z",
    "updatedAt": "2026-07-19T00:00:00.000Z",
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "email": "doctor@example.com",
      "profilePhotoUrl": null,
      "doctorProfile": {
        "specialization": "Nutrition",
        "qualification": "MBBS, MD",
        "hospitalName": "City Hospital",
        "clinicAddress": "123 Main Street",
        "phoneNumber": "9876543210",
        "yearsOfExperience": 8
      }
    }
  }
}
```

---

## Cancel Appointment

### Endpoint

```http
PATCH /patient/appointments/:id/cancel
```

### Request Body

No body required.

### Success Response

```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": "appointment_id",
    "status": "CANCELLED",
    "dateTime": "2026-07-25T10:00:00.000Z",
    "type": "ONLINE",
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "doctorProfile": { "specialization": "Nutrition" }
    }
  }
}
```

### Error Responses

```json
{ "success": false, "message": "Appointment is already cancelled" }
{ "success": false, "message": "Cannot cancel a completed appointment" }
{ "success": false, "message": "Appointment not found" }
```

---

# 4) Packages

## Browse Packages

### Endpoint

```http
GET /patient/packages
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in name, category, description |
| `category` | string | Filter by category |

### Example URLs

```text
GET /patient/packages
GET /patient/packages?category=Thyroid
GET /patient/packages?search=diabetes
```

### Success Response

```json
{
  "success": true,
  "message": "Packages fetched successfully",
  "data": [
    {
      "id": "package_id",
      "name": "Thyroid Management",
      "category": "Thyroid",
      "description": "Specialized diet plan for thyroid health management.",
      "price1Month": 1299,
      "price3Months": 5499,
      "price6Months": 9999,
      "features": [
        "Weekly diet plan",
        "Blood report review",
        "Monthly consultation"
      ],
      "isActive": true,
      "createdAt": "2026-07-10T00:00:00.000Z"
    }
  ]
}
```

---

## Package Detail

### Endpoint

```http
GET /patient/packages/:id
```

Returns a single active package. Returns error if package not found or inactive.

---

# 5) Digital Products

## Browse Digital Products

### Endpoint

```http
GET /patient/digital-products
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number | `1` |
| `limit` | number | Items per page | `10` |
| `search` | string | Search in title, author, description | `thyroid` |
| `category` | string | Filter by category | `Diabetes` |
| `isFree` | boolean | Free products only | `true` |
| `language` | string | Filter by language | `Hindi` |
| `minPrice` | number | Min price filter | `100` |
| `maxPrice` | number | Max price filter | `500` |

### Example URLs

```text
GET /patient/digital-products
GET /patient/digital-products?category=Thyroid
GET /patient/digital-products?isFree=true
GET /patient/digital-products?search=diet&minPrice=100&maxPrice=500
```

### Success Response

```json
{
  "success": true,
  "message": "Digital products fetched successfully",
  "data": {
    "items": [
      {
        "id": "product_id",
        "title": "Thyroid Diet Guide",
        "category": "Thyroid",
        "price": 299,
        "description": "Complete guide for thyroid patients...",
        "thumbnailUrl": "/uploads/digital-products/thumbnails/dp-thumb-123.png",
        "author": "Dr. Smith",
        "pageCount": 45,
        "language": "English",
        "isFree": false,
        "totalSales": 12,
        "createdAt": "2026-07-10T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 8,
      "totalPages": 1
    }
  }
}
```

**Note:** `fileUrl` is NOT included in the list view.

---

## Digital Product Detail

### Endpoint

```http
GET /patient/digital-products/:id
```

### Success Response

```json
{
  "success": true,
  "message": "Digital product fetched successfully",
  "data": {
    "id": "product_id",
    "title": "Thyroid Diet Guide",
    "category": "Thyroid",
    "price": 299,
    "description": "Complete guide for thyroid patients...",
    "thumbnailUrl": "/uploads/digital-products/thumbnails/dp-thumb-123.png",
    "fileUrl": "/uploads/digital-products/files/dp-file-123.pdf",
    "author": "Dr. Smith",
    "pageCount": 45,
    "language": "English",
    "isFree": false,
    "totalSales": 12,
    "createdAt": "2026-07-10T00:00:00.000Z"
  }
}
```

**Note:** Purchase gating for `fileUrl` is planned; verify access via `GET /patient/payments/my-orders` after payment.

---

# 6) Payments (Razorpay)

Use these endpoints to purchase packages or paid digital products.

## Create Order

### Endpoint

```http
POST /patient/payments/create-order
```

### Request Body — Buy a Package

```json
{
  "itemType": "PACKAGE",
  "itemId": "package_id_here",
  "duration": "ONE_MONTH"
}
```

### Request Body — Buy a Digital Product

```json
{
  "itemType": "DIGITAL_PRODUCT",
  "itemId": "product_id_here"
}
```

### Field Notes

- `itemType` → `PACKAGE` | `DIGITAL_PRODUCT`
- `itemId` → ID of the package or digital product
- `duration` → Required only for `PACKAGE`: `ONE_MONTH` | `THREE_MONTHS` | `SIX_MONTHS`

### Success Response

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_QzXvYz123456",
    "amount": 129900,
    "currency": "INR",
    "keyId": "rzp_test_xxxxxxxxxxxx",
    "itemName": "Thyroid Management - 1 Month",
    "dbOrderId": "uuid_order_id"
  }
}
```

- `amount` is in **paise** (129900 = ₹1299.00)
- `keyId` is the Razorpay key for the frontend checkout popup
- `orderId` is the Razorpay order ID to pass to the popup

### Error Responses

```json
{ "success": false, "message": "itemType and itemId are required" }
{ "success": false, "message": "duration is required for package purchase (ONE_MONTH, THREE_MONTHS, SIX_MONTHS)" }
{ "success": false, "message": "Package not found or inactive" }
{ "success": false, "message": "Digital product not found" }
{ "success": false, "message": "This product is free, no payment required" }
```

---

## Verify Payment

Call this after Razorpay popup returns success.

### Endpoint

```http
POST /patient/payments/verify
```

### Request Body

```json
{
  "razorpayOrderId": "order_QzXvYz123456",
  "razorpayPaymentId": "pay_QzXvYz789012",
  "razorpaySignature": "abc123def456..."
}
```

### Success Response

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "success": true,
    "orderId": "uuid_order_id",
    "itemType": "PACKAGE",
    "itemName": "Thyroid Management - 1 Month",
    "amount": 1299,
    "paidAt": "2026-07-18T12:30:00.000Z",
    "message": "Payment successful! You now have access to your purchase."
  }
}
```

### Error Responses

```json
{ "success": false, "message": "razorpayOrderId, razorpayPaymentId and razorpaySignature are required" }
{ "success": false, "message": "Order not found or already processed" }
{ "success": false, "message": "Payment verification failed. Invalid signature." }
```

---

## My Orders (Purchase History)

### Endpoint

```http
GET /patient/payments/my-orders
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | `PENDING` \| `PAID` \| `FAILED` \| `REFUNDED` |
| `itemType` | string | `PACKAGE` \| `DIGITAL_PRODUCT` |

### Success Response

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "items": [
      {
        "id": "order_id",
        "itemType": "PACKAGE",
        "itemId": "package_id",
        "itemName": "Thyroid Management - 1 Month",
        "amount": 1299,
        "currency": "INR",
        "duration": "ONE_MONTH",
        "status": "PAID",
        "razorpayOrderId": "order_QzXvYz123456",
        "razorpayPaymentId": "pay_QzXvYz789012",
        "paidAt": "2026-07-18T12:30:00.000Z",
        "createdAt": "2026-07-18T12:28:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 3,
      "totalPages": 1
    }
  }
}
```

### Frontend Payment Flow

```js
// 1. Create order
const { data: order } = await fetch("/api/patient/payments/create-order", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    itemType: "PACKAGE",
    itemId: "package_id",
    duration: "ONE_MONTH"
  })
}).then(r => r.json());

// 2. Open Razorpay popup (use order.orderId, order.amount, order.keyId)

// 3. On success, verify payment
await fetch("/api/patient/payments/verify", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature
  })
});
```

For admin revenue and refund details, see `PAYMENTS_AND_REVENUE_API.md`.

---

# 7) Blood Reports

Doctors upload blood reports for patients. Patients can view their own reports here.

## Get My Blood Reports

### Endpoint

```http
GET /patient/blood-reports
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

### Success Response

```json
{
  "success": true,
  "message": "Blood reports fetched successfully",
  "data": {
    "items": [
      {
        "id": "report_id",
        "patientId": "patient_id",
        "doctorId": "doctor_id",
        "title": "CBC Report July 2026",
        "fileUrl": "/uploads/blood-reports/blood-report-123.pdf",
        "notes": "All values within normal range",
        "uploadedAt": "2026-08-13T10:00:00.000Z",
        "updatedAt": "2026-08-13T10:00:00.000Z",
        "doctor": {
          "id": "doctor_id",
          "fullName": "Dr. John Smith",
          "profilePhotoUrl": null,
          "doctorProfile": {
            "specialization": "Nutrition",
            "hospitalName": "City Hospital"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

**Note:** Patients cannot upload or delete blood reports — that is done by doctors via the doctor panel.

---

# Complete Endpoint List

```text
# Dashboard
GET  https://dr-dietician-backend.onrender.com/api/patient/dashboard

# Profile
GET  https://dr-dietician-backend.onrender.com/api/patient/profile
PUT  https://dr-dietician-backend.onrender.com/api/patient/profile
POST https://dr-dietician-backend.onrender.com/api/upload/profile-photo

# Appointments
GET   https://dr-dietician-backend.onrender.com/api/patient/appointments/doctors
GET   https://dr-dietician-backend.onrender.com/api/patient/appointments
POST  https://dr-dietician-backend.onrender.com/api/patient/appointments
GET   https://dr-dietician-backend.onrender.com/api/patient/appointments/:id
PATCH https://dr-dietician-backend.onrender.com/api/patient/appointments/:id/cancel

# Packages
GET  https://dr-dietician-backend.onrender.com/api/patient/packages
GET  https://dr-dietician-backend.onrender.com/api/patient/packages/:id

# Digital Products
GET  https://dr-dietician-backend.onrender.com/api/patient/digital-products
GET  https://dr-dietician-backend.onrender.com/api/patient/digital-products/:id

# Payments
POST https://dr-dietician-backend.onrender.com/api/patient/payments/create-order
POST https://dr-dietician-backend.onrender.com/api/patient/payments/verify
GET  https://dr-dietician-backend.onrender.com/api/patient/payments/my-orders

# Blood Reports
GET  https://dr-dietician-backend.onrender.com/api/patient/blood-reports
```

---

# Key Notes for Frontend

## Authentication
- Use patient JWT token for all `/patient/*` endpoints
- Token is obtained from `POST /auth/login`
- Patients can only see/modify their own data

## Profile Photo
- Upload via `POST /upload/profile-photo` (multipart/form-data, field: `photo`)
- Photo is automatically saved to profile — no second API call needed

## Appointments
- Call `GET /patient/appointments/doctors` first to let patient choose a doctor
- `dateTime` must be a future ISO 8601 date string
- Appointment starts as `PENDING` — doctor confirms it to `CONFIRMED`
- Patient can only cancel `PENDING` or `CONFIRMED` appointments
- When doctor reschedules, patient APIs return `rescheduleInfo` with old time + message like `"Rescheduled by Dr. John Smith"`
- Doctors can reschedule or edit via `PATCH /doctor/appointments/:id` (dateTime, type, notes)
- Full appointment flow: [`APPOINTMENTS_API.md`](./APPOINTMENTS_API.md)
- No available-slots API yet

## Packages
- Shows only **active** packages
- Three pricing tiers: `price1Month`, `price3Months`, `price6Months`
- Purchase via Razorpay: `create-order` → popup → `verify`

## Digital Products
- Shows only **PUBLISHED** products
- `fileUrl` is hidden in browse list; shown in detail view
- Free products (`isFree: true`) do not need payment
- Paid products: use payment flow above

## Payments
- Razorpay `amount` in create-order response is in **paise**
- Always call `verify` after successful Razorpay popup
- Check `my-orders` with `status=PAID` to confirm purchase access

## Blood Reports
- Read-only for patients
- Uploaded by doctors who have treated the patient

## Dashboard
- `nextCheckup.label` values: `"Today"` / `"Tomorrow"` / `"2 days"` / `null`
- `vitals.bmiStatus`: `"Underweight"` / `"Normal"` / `"Overweight"` / `"Obese"`
- `dietPlan` and `recentActivity` are placeholders — coming in a future update

## Coming Soon
- Doctor availability / time slots API
- Patient-side appointment reschedule
- Purchase-gated download for digital products
- Diet plan and recent activity on dashboard
