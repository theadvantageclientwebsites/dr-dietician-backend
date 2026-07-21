/**
 * @swagger
 * /admin/dashboard/summary:
 *   get:
 *     tags: [Admin - Dashboard]
 *     summary: Get admin dashboard summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalPatients: 12
 *                 totalDoctors: 4
 *                 pendingDoctors: 2
 *                 totalInterns: 6
 *
 * /admin/patients:
 *   post:
 *     tags: [Admin - Patients]
 *     summary: Create a new patient (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email]
 *             properties:
 *               fullName: { type: string, example: "Sarah Jenkins" }
 *               email: { type: string, example: "sarah@example.com" }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY] }
 *               location: { type: string, example: "Chicago" }
 *               phoneNumber: { type: string, example: "9876543210" }
 *               age: { type: number, example: 29 }
 *               heightCm: { type: number, example: 165 }
 *               weightKg: { type: number, example: 58 }
 *               bloodGroup: { type: string, enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG] }
 *     responses:
 *       201:
 *         description: Patient created with auto-generated password
 *   get:
 *     tags: [Admin - Patients]
 *     summary: Get all patients with pagination and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *         example: 10
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, email, phone
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE, SUSPENDED, PENDING_APPROVAL] }
 *       - in: query
 *         name: bloodGroup
 *         schema: { type: string, enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG] }
 *       - in: query
 *         name: gender
 *         schema: { type: string, enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY] }
 *     responses:
 *       200:
 *         description: Paginated list of patients
 *
 * /admin/patients/{id}:
 *   get:
 *     tags: [Admin - Patients]
 *     summary: Get single patient by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Patient details
 *   put:
 *     tags: [Admin - Patients]
 *     summary: Update patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               accountStatus: { type: string, enum: [ACTIVE, INACTIVE, SUSPENDED] }
 *               patientProfile:
 *                 type: object
 *                 properties:
 *                   phoneNumber: { type: string }
 *                   location: { type: string }
 *                   age: { type: number }
 *                   weightKg: { type: number }
 *     responses:
 *       200:
 *         description: Patient updated
 *   delete:
 *     tags: [Admin - Patients]
 *     summary: Delete patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Patient deleted
 *
 * /admin/doctors:
 *   post:
 *     tags: [Admin - Doctors]
 *     summary: Create doctor (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email]
 *             properties:
 *               fullName: { type: string, example: "Dr. John Smith" }
 *               email: { type: string, example: "dr.smith@example.com" }
 *               phoneNumber: { type: string }
 *               specialization: { type: string, example: "Nutrition" }
 *               qualification: { type: string, example: "MBBS, MD" }
 *               licenseNumber: { type: string }
 *               yearsOfExperience: { type: number }
 *               hospitalName: { type: string }
 *               clinicAddress: { type: string }
 *     responses:
 *       201:
 *         description: Doctor created with auto-generated password
 *   get:
 *     tags: [Admin - Doctors]
 *     summary: Get all doctors with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: isApproved
 *         schema: { type: boolean }
 *       - in: query
 *         name: specialization
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of doctors
 *
 * /admin/doctors/{id}:
 *   get:
 *     tags: [Admin - Doctors]
 *     summary: Get single doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Doctor details
 *   put:
 *     tags: [Admin - Doctors]
 *     summary: Update doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Doctor updated
 *   delete:
 *     tags: [Admin - Doctors]
 *     summary: Delete doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Doctor deleted
 *
 * /admin/doctors/{id}/approve:
 *   patch:
 *     tags: [Admin - Doctors]
 *     summary: Approve a doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Doctor approved
 *
 * /admin/doctors/{id}/status:
 *   patch:
 *     tags: [Admin - Doctors]
 *     summary: Enable or disable doctor account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: Doctor status updated
 *
 * /admin/interns/summary:
 *   get:
 *     tags: [Admin - Interns]
 *     summary: Get interns summary stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interns summary
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 totalInterns: 5
 *                 approved: 2
 *                 pending: 2
 *                 completedCourses: 0
 *
 * /admin/interns:
 *   post:
 *     tags: [Admin - Interns]
 *     summary: Create intern (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email]
 *             properties:
 *               fullName: { type: string, example: "Jane Doe" }
 *               email: { type: string, example: "jane@uni.edu" }
 *               phoneNumber: { type: string }
 *               universityName: { type: string }
 *               specialization: { type: string }
 *               semester: { type: number }
 *               year: { type: number }
 *     responses:
 *       201:
 *         description: Intern created with auto-generated password
 *   get:
 *     tags: [Admin - Interns]
 *     summary: Get all interns with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isApproved
 *         schema: { type: boolean }
 *       - in: query
 *         name: university
 *         schema: { type: string }
 *       - in: query
 *         name: specialization
 *         schema: { type: string }
 *       - in: query
 *         name: semester
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of interns
 *
 * /admin/interns/{id}:
 *   get:
 *     tags: [Admin - Interns]
 *     summary: Get single intern
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Intern details
 *   put:
 *     tags: [Admin - Interns]
 *     summary: Update intern
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Intern updated
 *   delete:
 *     tags: [Admin - Interns]
 *     summary: Delete intern
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Intern deleted
 *
 * /admin/appointments/summary:
 *   get:
 *     tags: [Admin - Appointments]
 *     summary: Get appointments summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments summary stats
 *
 * /admin/appointments:
 *   get:
 *     tags: [Admin - Appointments]
 *     summary: Get all appointments with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED] }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [ONLINE, IN_PERSON] }
 *       - in: query
 *         name: today
 *         schema: { type: boolean }
 *       - in: query
 *         name: fromDate
 *         schema: { type: string, example: "2026-07-01" }
 *       - in: query
 *         name: toDate
 *         schema: { type: string, example: "2026-07-31" }
 *     responses:
 *       200:
 *         description: List of appointments
 *
 * /admin/appointments/{id}/status:
 *   patch:
 *     tags: [Admin - Appointments]
 *     summary: Update appointment status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 *
 * /admin/packages:
 *   post:
 *     tags: [Admin - Packages]
 *     summary: Create a new package
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, price1Month, price3Months, price6Months]
 *             properties:
 *               name: { type: string, example: "Thyroid Management" }
 *               category: { type: string, example: "Thyroid" }
 *               description: { type: string }
 *               price1Month: { type: number, example: 1299 }
 *               price3Months: { type: number, example: 5499 }
 *               price6Months: { type: number, example: 9999 }
 *               features: { type: array, items: { type: string } }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Package created
 *   get:
 *     tags: [Admin - Packages]
 *     summary: Get all packages with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of packages
 *
 * /admin/packages/{id}/status:
 *   patch:
 *     tags: [Admin - Packages]
 *     summary: Toggle package active/inactive
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive: { type: boolean, example: false }
 *     responses:
 *       200:
 *         description: Status toggled
 *
 * /admin/digital-products:
 *   post:
 *     tags: [Admin - Digital Products]
 *     summary: Create digital product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category]
 *             properties:
 *               title: { type: string, example: "Thyroid Diet Guide" }
 *               category: { type: string, example: "Thyroid" }
 *               status: { type: string, enum: [DRAFT, PUBLISHED, UNPUBLISHED] }
 *               price: { type: number, example: 299 }
 *               description: { type: string }
 *               fileUrl: { type: string }
 *               thumbnailUrl: { type: string }
 *               author: { type: string }
 *               pageCount: { type: number }
 *               isFree: { type: boolean }
 *     responses:
 *       201:
 *         description: Digital product created
 *   get:
 *     tags: [Admin - Digital Products]
 *     summary: Get all digital products with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, PUBLISHED, UNPUBLISHED] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of digital products
 *
 * /admin/courses:
 *   post:
 *     tags: [Admin - Courses]
 *     summary: Create a new course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Clinical Nutrition Fundamentals" }
 *               description: { type: string }
 *               category: { type: string }
 *               instructor: { type: string }
 *               duration: { type: string, example: "4 weeks" }
 *               minSemester: { type: number, example: 3 }
 *               minYear: { type: number, example: 2022 }
 *               hasFinalTest: { type: boolean }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Course created
 *   get:
 *     tags: [Admin - Courses]
 *     summary: Get all courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *
 * /admin/courses/{courseId}/lessons:
 *   post:
 *     tags: [Admin - Courses]
 *     summary: Add lesson to course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Introduction to Macronutrients" }
 *               content: { type: string }
 *               videoUrl: { type: string }
 *               fileUrl: { type: string }
 *               order: { type: number }
 *               durationMin: { type: number }
 *     responses:
 *       201:
 *         description: Lesson added
 *
 * /admin/revenue/summary:
 *   get:
 *     tags: [Admin - Revenue]
 *     summary: Get revenue dashboard summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue summary with breakdown
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 summary:
 *                   totalRevenue: 124500
 *                   thisMonth: 18200
 *                   thisWeek: 4500
 *                   totalOrders: 89
 *                 breakdown:
 *                   packages:
 *                     revenue: 68000
 *                     percentage: 54.6
 *
 * /admin/revenue/orders:
 *   get:
 *     tags: [Admin - Revenue]
 *     summary: Get all orders with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, PAID, FAILED, REFUNDED] }
 *       - in: query
 *         name: itemType
 *         schema: { type: string, enum: [PACKAGE, DIGITAL_PRODUCT] }
 *       - in: query
 *         name: fromDate
 *         schema: { type: string, example: "2026-07-01" }
 *       - in: query
 *         name: toDate
 *         schema: { type: string, example: "2026-07-31" }
 *     responses:
 *       200:
 *         description: List of orders
 */
