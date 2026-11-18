# Frontend update — Diet plans

Send this to the frontend team.

Patient **cannot** see meals until **admin approves**.  
**24 hours** = doctor must *write and submit* the plan. Admin approval has **no auto-publish**.

## Base URL

```text
https://dr-dietician-backend.onrender.com/api
http://localhost:5000/api
```

Auth: `Authorization: Bearer <token>`

---

## Flow

```text
Admin assigns doctor to package
        ↓
24h clock starts (doctor must submit a plan)
        ↓
Doctor saves DRAFT → submits → PENDING_APPROVAL
        ↓
Admin Approve  → patient sees full plan
Admin Reject   → doctor edits and resubmits
```

If admin does not approve after 24h: **nothing auto-happens**. Patient still sees “plan is being prepared.”

If **doctor** does not submit within 24h: doctor/admin see **`isOverdue: true`**. Patient still does **not** see “overdue”.

---

# Doctor panel

## 1) Who needs a plan

`GET /doctor/patients`

Each assigned package patient now has `dietPlan`:

```json
{
  "dietPlan": {
    "plan": { "id": "...", "status": "DRAFT" },
    "dueAt": "2026-08-15T04:00:00.000Z",
    "isOverdue": false,
    "hoursRemaining": 18
  }
}
```

- `plan` is `null` if not created yet  
- Show **Overdue** badge when `isOverdue === true`  
- Show **Plan due in Xh** when `hoursRemaining` is set  

`GET /doctor/patients/:id` includes the same `dietPlan` object.

`GET /doctor/patients/:patientId/diet-plan` — plan + due info for one patient.

---

## 2) Create / update draft

```http
POST /doctor/diet-plans
```

```json
{
  "patientId": "patient_uuid",
  "duration": "SEVEN_DAYS",
  "calorieTarget": 1800,
  "foodsToEat": ["Oats", "Dal", "Green vegetables"],
  "foodsToAvoid": ["Sugar", "Fried food"],
  "breakfast": "Oats with milk + 1 fruit",
  "lunch": "2 rotis + dal + salad",
  "dinner": "Grilled paneer + veggies",
  "snacks": "Buttermilk / handful of nuts",
  "notes": "Drink 3 litres water"
}
```

| `duration` | UI |
|------------|-----|
| `SEVEN_DAYS` | 7 days |
| `TEN_DAYS` | 10 days |
| `FIFTEEN_DAYS` | 15 days |

This is **one daily menu** that repeats for 7/10/15 days (v1).

Saves as **`DRAFT`**. Same API updates if a draft/rejected plan already exists for that package.

Cannot edit while `PENDING_APPROVAL` or `APPROVED`.

---

## 3) Submit for admin

```http
PATCH /doctor/diet-plans/:id/submit
```

Need at least one of breakfast / lunch / dinner.

Status becomes `PENDING_APPROVAL`.

Other:

```http
GET /doctor/diet-plans
GET /doctor/diet-plans?status=DRAFT
GET /doctor/diet-plans/:id
```

---

# Admin panel

New queue: **Diet plans pending approval**

```http
GET /admin/diet-plans?status=PENDING_APPROVAL
GET /admin/diet-plans/:id
```

Approve (patient can then see it):

```http
PATCH /admin/diet-plans/:id/approve
```

Reject (doctor can edit + resubmit):

```http
PATCH /admin/diet-plans/:id/reject
{ "reason": "Please add calorie target and avoid list" }
```

**Do not auto-approve.** Late approval is fine.

---

# Patient app

```http
GET /patient/diet-plan
```

Also on `GET /patient/dashboard` → `dietPlan` (same shape).

### Not ready yet (`visible: false`)

```json
{
  "visible": false,
  "patientStatus": "IN_PROGRESS",
  "message": "Your dietitian is preparing your plan",
  "plan": null
}
```

| `patientStatus` | Show |
|-----------------|------|
| `NO_PACKAGE` | Buy a package |
| `WAITING_FOR_DOCTOR_ASSIGNMENT` | Waiting for doctor assignment |
| `IN_PROGRESS` | Dietitian is preparing your plan |
| `PENDING_APPROVAL` | Your diet plan is being reviewed |
| `APPROVED` | Plan is ready |

Do **not** show overdue / rejected to the patient.

### Ready (`visible: true`)

```json
{
  "visible": true,
  "patientStatus": "APPROVED",
  "message": "Your diet plan is ready",
  "plan": {
    "duration": "SEVEN_DAYS",
    "durationDays": 7,
    "calorieTarget": 1800,
    "foodsToEat": ["Oats", "Dal"],
    "foodsToAvoid": ["Sugar"],
    "breakfast": "Oats with milk + 1 fruit",
    "lunch": "2 rotis + dal + salad",
    "dinner": "Grilled paneer + veggies",
    "snacks": "Buttermilk",
    "notes": "Drink 3 litres water",
    "status": "APPROVED",
    "doctor": { "fullName": "Dr. Priya Mehta" }
  }
}
```

Only then show meals, calories, eat/avoid.

---

# Status (doctor / admin)

| Status | Meaning |
|--------|---------|
| `DRAFT` | Doctor is writing |
| `PENDING_APPROVAL` | Waiting for admin |
| `APPROVED` | Patient can view |
| `REJECTED` | Doctor must fix and submit again |

---

# Copy-paste checklist

### Doctor
- [ ] Badge overdue / hours remaining on assigned patients
- [ ] Form: duration 7/10/15, calories, eat/avoid, 4 meals, notes
- [ ] Save draft `POST /doctor/diet-plans`
- [ ] Submit `PATCH /doctor/diet-plans/:id/submit`

### Admin
- [ ] List `GET /admin/diet-plans?status=PENDING_APPROVAL`
- [ ] Approve / reject buttons
- [ ] Reject reason optional

### Patient
- [ ] Dashboard uses `dietPlan.message` until `visible === true`
- [ ] Full meals only when `visible === true` and `plan.status === "APPROVED"`

---

# Endpoints

```text
# Doctor
POST  /doctor/diet-plans
GET   /doctor/diet-plans
GET   /doctor/diet-plans/:id
PATCH /doctor/diet-plans/:id/submit
GET   /doctor/patients/:patientId/diet-plan
GET   /doctor/patients                     (+ dietPlan due info)

# Admin
GET   /admin/diet-plans
GET   /admin/diet-plans/:id
PATCH /admin/diet-plans/:id/approve
PATCH /admin/diet-plans/:id/reject

# Patient
GET   /patient/diet-plan
GET   /patient/dashboard                   (+ dietPlan object, not null)
```
