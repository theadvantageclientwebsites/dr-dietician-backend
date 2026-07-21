/**
 * @swagger
 * /upload/profile-photo:
 *   post:
 *     tags: [Upload]
 *     summary: Upload profile photo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 profilePhotoUrl: "/uploads/1720000000000.png"
 *
 * /upload/digital-product/file:
 *   post:
 *     tags: [Upload]
 *     summary: Upload digital product PDF (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file only, max 50MB
 *     responses:
 *       200:
 *         description: File uploaded
 *
 * /upload/digital-product/thumbnail:
 *   post:
 *     tags: [Upload]
 *     summary: Upload digital product thumbnail (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Image file only, max 5MB
 *     responses:
 *       200:
 *         description: Thumbnail uploaded
 *
 * /patient/dashboard:
 *   get:
 *     tags: [Patient - Dashboard]
 *     summary: Get patient home dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data including vitals, upcoming appointment, quick actions
 *
 * /patient/profile:
 *   get:
 *     tags: [Patient - Profile]
 *     summary: Get my profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile with BMI calculation
 *   put:
 *     tags: [Patient - Profile]
 *     summary: Update my profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               patientProfile:
 *                 type: object
 *                 properties:
 *                   phoneNumber: { type: string }
 *                   location: { type: string }
 *                   age: { type: number }
 *                   weightKg: { type: number }
 *                   heightCm: { type: number }
 *                   bloodGroup: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 *
 * /patient/appointments/doctors:
 *   get:
 *     tags: [Patient - Appointments]
 *     summary: Browse available doctors for booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: specialization
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of approved doctors
 *
 * /patient/appointments:
 *   get:
 *     tags: [Patient - Appointments]
 *     summary: Get my appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED] }
 *       - in: query
 *         name: upcoming
 *         schema: { type: boolean }
 *       - in: query
 *         name: past
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: My appointments list
 *   post:
 *     tags: [Patient - Appointments]
 *     summary: Book a new appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, dateTime]
 *             properties:
 *               doctorId: { type: string }
 *               dateTime: { type: string, example: "2026-07-25T10:00:00.000Z" }
 *               type: { type: string, enum: [ONLINE, IN_PERSON], default: ONLINE }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Appointment booked with PENDING status
 *
 * /patient/appointments/{id}/cancel:
 *   patch:
 *     tags: [Patient - Appointments]
 *     summary: Cancel an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *
 * /patient/packages:
 *   get:
 *     tags: [Patient - Packages]
 *     summary: Browse active packages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of active packages with pricing
 *
 * /patient/digital-products:
 *   get:
 *     tags: [Patient - Digital Products]
 *     summary: Browse published digital products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: isFree
 *         schema: { type: boolean }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of digital products (fileUrl hidden)
 *
 * /patient/payments/create-order:
 *   post:
 *     tags: [Patient - Payments]
 *     summary: Create Razorpay payment order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemType, itemId]
 *             properties:
 *               itemType:
 *                 type: string
 *                 enum: [PACKAGE, DIGITAL_PRODUCT]
 *                 example: PACKAGE
 *               itemId:
 *                 type: string
 *                 description: ID of the package or digital product
 *               duration:
 *                 type: string
 *                 enum: [ONE_MONTH, THREE_MONTHS, SIX_MONTHS]
 *                 description: Required only for PACKAGE
 *                 example: ONE_MONTH
 *     responses:
 *       201:
 *         description: Razorpay order created
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 orderId: "order_QzXvYz123456"
 *                 amount: 129900
 *                 currency: INR
 *                 keyId: "rzp_test_xxx"
 *                 itemName: "Thyroid Management - 1 Month"
 *
 * /patient/payments/verify:
 *   post:
 *     tags: [Patient - Payments]
 *     summary: Verify Razorpay payment after popup success
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpayOrderId, razorpayPaymentId, razorpaySignature]
 *             properties:
 *               razorpayOrderId: { type: string, example: "order_QzXvYz123456" }
 *               razorpayPaymentId: { type: string, example: "pay_QzXvYz789012" }
 *               razorpaySignature: { type: string, example: "abc123def456..." }
 *     responses:
 *       200:
 *         description: Payment verified and order marked as PAID
 *
 * /patient/payments/my-orders:
 *   get:
 *     tags: [Patient - Payments]
 *     summary: Get my purchase history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, PAID, FAILED, REFUNDED] }
 *       - in: query
 *         name: itemType
 *         schema: { type: string, enum: [PACKAGE, DIGITAL_PRODUCT] }
 *     responses:
 *       200:
 *         description: My orders list
 *
 * /intern/courses:
 *   get:
 *     tags: [Intern - Courses]
 *     summary: Browse available courses with eligibility check
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses with isEnrolled, isEligible, progress fields
 *
 * /intern/courses/my-enrollments:
 *   get:
 *     tags: [Intern - Courses]
 *     summary: Get my enrolled courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ENROLLED, IN_PROGRESS, COMPLETED, FAILED] }
 *     responses:
 *       200:
 *         description: My enrollments
 *
 * /intern/courses/{courseId}/enroll:
 *   post:
 *     tags: [Intern - Courses]
 *     summary: Enroll in a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *
 * /intern/courses/{courseId}/lessons/{lessonId}/complete:
 *   patch:
 *     tags: [Intern - Courses]
 *     summary: Mark a lesson as completed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson marked complete, progress recalculated
 *
 * /intern/courses/{courseId}/final-test:
 *   patch:
 *     tags: [Intern - Courses]
 *     summary: Submit final test result
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
 *             required: [passed]
 *             properties:
 *               passed: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Final test result recorded
 */
