# Frontend update — Packages, dummy payment, doctor assignment

Send this to the frontend team. **Razorpay is not working right now.** Use dummy checkout until live keys are ready.

## Base URL

```text
https://dr-dietician-backend.onrender.com/api
http://localhost:5000/api
```

Auth: `Authorization: Bearer <token>`

---

## What changed (breaking)

| Old | New |
|-----|-----|
| Package prices `price1Month`, `price3Months`, `price6Months` | `price3Months`, `price6Months`, `price12Months` |
| Duration `ONE_MONTH` / `THREE_MONTHS` / `SIX_MONTHS` | `THREE_MONTHS` / `SIX_MONTHS` / `TWELVE_MONTHS` |
| Pay with Razorpay popup | **Dummy checkout** (no Razorpay UI) |
| After pay → nothing else | After pay → **subscription** waiting for admin to assign a doctor |
| Patient can book any doctor anytime | Patient needs an **active package** + **assigned doctor**, max **4 meetings / month** |

Remove all `price1Month` and `ONE_MONTH` from package UI.

---

## Product flow (build screens in this order)

```text
1. Patient browses packages (3 / 6 / 12 month prices)
2. Patient taps Buy → dummy checkout (marks paid)
3. Status: PENDING_ASSIGNMENT  ("Waiting for doctor assignment")
4. Admin assigns a doctor
5. Status: ACTIVE  (patient sees assigned doctor + remaining meetings)
6. Patient books appointments only with that doctor (max 4 this month)
7. Doctor sees the patient under My Patients (even before first appointment)
```

---

# Patient app

## 1) Browse packages — field rename

`GET /patient/packages`  
`GET /patient/packages/:id`

### Display these prices

```json
{
  "id": "package_id",
  "name": "Thyroid Management",
  "category": "Thyroid",
  "description": "...",
  "price3Months": 5499,
  "price6Months": 9999,
  "price12Months": 17999,
  "features": ["4 consultations per month", "Personal diet plan"],
  "isActive": true
}
```

**UI:** three cards/tabs — 3 months / 6 months / 12 months.  
**Do not** show 1 month.

Duration sent to API:

| UI label | `duration` value |
|----------|------------------|
| 3 Months | `THREE_MONTHS` |
| 6 Months | `SIX_MONTHS` |
| 12 Months | `TWELVE_MONTHS` |

---

## 2) Buy package — DUMMY PAYMENT (use this now)

**Do not open Razorpay.** Call this after the patient confirms buy:

```http
POST /patient/payments/dummy-checkout
Authorization: Bearer <patient_token>
Content-Type: application/json
```

```json
{
  "itemType": "PACKAGE",
  "itemId": "package_id",
  "duration": "THREE_MONTHS"
}
```

Same API works for digital products (no `duration`):

```json
{
  "itemType": "DIGITAL_PRODUCT",
  "itemId": "product_id"
}
```

### Success (201)

```json
{
  "success": true,
  "message": "Dummy payment successful. Package is waiting for admin to assign a doctor.",
  "data": {
    "dummy": true,
    "orderId": "order_uuid",
    "itemType": "PACKAGE",
    "itemName": "Thyroid Management - 3 Months",
    "amount": 5499,
    "currency": "INR",
    "paidAt": "2026-08-14T03:30:00.000Z",
    "subscription": {
      "id": "subscription_id",
      "status": "PENDING_ASSIGNMENT",
      "duration": "THREE_MONTHS",
      "meetingsPerMonth": 4,
      "startsAt": "2026-08-14T03:30:00.000Z",
      "endsAt": "2026-11-14T03:30:00.000Z",
      "doctor": null,
      "package": {
        "id": "package_id",
        "name": "Thyroid Management",
        "category": "Thyroid"
      }
    }
  }
}
```

### After success UI

Show: **"Payment successful. Admin will assign a doctor soon."**  
Do **not** send them to book appointment yet (`doctor` is `null`).

### Errors

```json
{ "success": false, "message": "You already have an active package. Wait until it expires before buying another." }
{ "success": false, "message": "duration is required for package purchase (THREE_MONTHS, SIX_MONTHS, TWELVE_MONTHS)" }
{ "success": false, "message": "Package not found or inactive" }
```

### Later (when Razorpay works)

Keep old endpoints, but **do not use them now**:

- `POST /patient/payments/create-order`
- `POST /patient/payments/verify`

When we switch back, we will tell you. Dummy checkout will stay for staging.

---

## 3) My package (new screens)

### Current package (dashboard / profile)

```http
GET /patient/subscriptions/active
```

`data` is `null` if they have no current package.

```json
{
  "success": true,
  "message": "Active package fetched successfully",
  "data": {
    "id": "subscription_id",
    "status": "ACTIVE",
    "duration": "THREE_MONTHS",
    "meetingsPerMonth": 4,
    "meetingsUsedThisMonth": 1,
    "meetingsRemainingThisMonth": 3,
    "meetingsLabel": "3 of 4 meetings left this month",
    "startsAt": "2026-08-14T03:30:00.000Z",
    "endsAt": "2026-11-14T03:30:00.000Z",
    "assignedAt": "2026-08-14T04:00:00.000Z",
    "package": { "id": "...", "name": "Thyroid Management", "category": "Thyroid" },
    "doctor": {
      "id": "doctor_id",
      "fullName": "Dr. John Smith",
      "profilePhotoUrl": null,
      "doctorProfile": { "specialization": "Nutrition", "hospitalName": "City Hospital" }
    }
  }
}
```

### History

```http
GET /patient/subscriptions
GET /patient/subscriptions?status=ACTIVE
```

### Status labels

| `status` | Show in UI |
|----------|------------|
| `PENDING_ASSIGNMENT` | Waiting for doctor assignment |
| `ACTIVE` | Active — can book |
| `EXPIRED` | Expired |
| `CANCELLED` | Cancelled |

Show remaining meetings with **`meetingsLabel`** (do not invent the text).

```js
// CORRECT
activePackage.meetingsLabel
// → "3 of 4 meetings left this month"

// ALSO CORRECT
`${activePackage.meetingsRemainingThisMonth} of ${activePackage.meetingsPerMonth} meetings left this month`

// WRONG — this is why the card showed "0 of 4" after 1 meeting
`${activePackage.meetingsUsedThisMonth} of ${activePackage.meetingsPerMonth} meetings left this month`
```

| Field | After 1 meeting |
|-------|-----------------|
| `meetingsUsedThisMonth` | `1` (already used) |
| `meetingsRemainingThisMonth` | `3` (still allowed) |
| `meetingsPerMonth` | `4` |
| `meetingsLabel` | `"3 of 4 meetings left this month"` |

---

## 4) Dashboard extra field

`GET /patient/dashboard` now includes `activePackage` (same shape as above, or `null`).

Use it on home: package name, doctor, remaining meetings, “waiting for doctor” banner.

---

## 5) Appointments — new rules

Booking is **not free for everyone** anymore.

```http
POST /patient/appointments
```

Still:

```json
{
  "doctorId": "assigned_doctor_id",
  "dateTime": "2026-08-20T10:00:00.000Z",
  "type": "ONLINE",
  "notes": "Follow-up"
}
```

### New errors (handle in UI)

| Message | What to show |
|---------|----------------|
| `An active package is required to book an appointment` | CTA: buy a package |
| `Your package is waiting for admin to assign a doctor` | Wait / contact support |
| `You can only book appointments with your assigned package doctor` | Use `activePackage.doctor.id` |
| `Monthly appointment limit reached (4 meetings). Try again next month.` | Disable book button |

`GET /patient/appointments/doctors`:

- If doctor is assigned → list contains **only that doctor** (pre-select them)
- If waiting for assignment → empty list
- If no package → all doctors (browse only; booking still fails until they buy)

---

# Admin panel

## 1) Create / edit package — new fields

```http
POST /admin/packages
PUT /admin/packages/:id
```

```json
{
  "name": "Thyroid Management",
  "category": "Thyroid",
  "description": "Disease package",
  "price3Months": 5499,
  "price6Months": 9999,
  "price12Months": 17999,
  "features": [
    "4 consultations per month",
    "Personal diet plan within 24 hours"
  ],
  "isActive": true
}
```

**Remove** `price1Month` from forms and tables.

Existing packages: backend copied 12-month price from `price6Months * 1.8`. Admin should edit real prices.

---

## 2) Assign doctor (new — required after every purchase)

New menu: **Package subscriptions** (or under Packages).

### List (filter `PENDING_ASSIGNMENT` for the queue)

```http
GET /admin/subscriptions
GET /admin/subscriptions?status=PENDING_ASSIGNMENT
GET /admin/subscriptions?search=ananya
GET /admin/subscriptions?page=1&limit=10
```

Response item includes `patient`, `package`, `doctor` (null until assigned), `status`, `startsAt`, `endsAt`.

### Detail

```http
GET /admin/subscriptions/:id
```

### Assign

```http
PATCH /admin/subscriptions/:id/assign-doctor
```

```json
{ "doctorId": "approved_doctor_id" }
```

Success: `status` becomes `ACTIVE`, `doctor` is filled.

Use existing `GET /admin/doctors` (approved/active) for the dropdown.

**Admin must assign a doctor.** Patient cannot pick one.

---

# Doctor panel

No new routes. Existing:

```http
GET /doctor/patients
GET /doctor/patients/:id
```

### Extra fields

List item now has `packageSubscription`:

```json
{
  "id": "patient_id",
  "fullName": "Ananya Sharma",
  "lastAppointment": null,
  "packageSubscription": {
    "id": "subscription_id",
    "status": "ACTIVE",
    "duration": "THREE_MONTHS",
    "endsAt": "2026-11-14T03:30:00.000Z",
    "package": { "id": "...", "name": "Thyroid Management", "category": "Thyroid" }
  }
}
```

Show a **New package patient** badge when `lastAppointment` is null and `packageSubscription` exists.

Patient detail also returns `packageSubscription` (dates + features).

Doctors **do not** sell packages or assign themselves.

---

# Copy-paste frontend checklist

### Patient
- [ ] Package cards: 3 / 6 / 12 month prices only
- [ ] Buy button → `POST /patient/payments/dummy-checkout` (no Razorpay)
- [ ] After buy: “Waiting for doctor assignment”
- [ ] Home/profile: `GET /patient/subscriptions/active` or dashboard `activePackage`
- [ ] Show remaining meetings with `meetingsLabel` or `meetingsRemainingThisMonth` — **not** `meetingsUsedThisMonth`
- [ ] Book appointment only when `status === "ACTIVE"` and a doctor is assigned
- [ ] Handle the 4 booking error messages above
- [ ] Hide Razorpay checkout for now

### Admin
- [ ] Package form: `price3Months`, `price6Months`, `price12Months`
- [ ] New list: subscriptions pending assignment
- [ ] Assign doctor action
- [ ] After assign, patient can book

### Doctor
- [ ] My patients includes package patients with no appointment yet
- [ ] Show package name on patient card

---

# Complete new / changed endpoints

```text
# Patient
GET  /patient/packages                      (prices renamed)
GET  /patient/packages/:id
POST /patient/payments/dummy-checkout       NEW — use this for pay
GET  /patient/subscriptions/active          NEW
GET  /patient/subscriptions                 NEW
GET  /patient/dashboard                     (+ activePackage)
POST /patient/appointments                  (package + assigned doctor + 4/month)

# Admin
POST /admin/packages                        (price12Months, no price1Month)
PUT  /admin/packages/:id
GET  /admin/subscriptions                   NEW
GET  /admin/subscriptions/:id               NEW
PATCH /admin/subscriptions/:id/assign-doctor NEW

# Doctor
GET  /doctor/patients                       (+ packageSubscription)
GET  /doctor/patients/:id                   (+ packageSubscription)
```

---

# Dummy vs real payment (for later)

| Now | Later |
|-----|--------|
| `POST /patient/payments/dummy-checkout` | `create-order` → Razorpay popup → `verify` |
| `data.dummy: true` | `data.dummy: false` |
| Instant `PAID` | `PAID` after signature verify |
| Subscription still created the same way | Same |

Do not delete dummy checkout from the app; we can feature-flag it.

---

# Suggested UI copy

- Buy: **Pay now (test mode)** until Razorpay is live  
- After dummy pay: **Package activated. A doctor will be assigned shortly.**  
- Pending: **Waiting for doctor assignment**  
- Active: **Your doctor: Dr. … · 3 of 4 meetings left this month**
