/**
 * @swagger
 * /doctor/profile:
 *   get:
 *     tags: [Doctor - Profile]
 *     summary: Get my profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile with all details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "doctor_id"
 *                 fullName: "Dr. John Smith"
 *                 email: "dr.smith@example.com"
 *                 profilePhotoUrl: null
 *                 isEmailVerified: false
 *                 lastLoginAt: "2026-08-13T10:00:00.000Z"
 *                 doctorProfile:
 *                   phoneNumber: "9876543210"
 *                   specialization: "Nutrition"
 *                   qualification: "MBBS, MD"
 *                   licenseNumber: "LIC123456"
 *                   yearsOfExperience: 8
 *                   hospitalName: "City Hospital"
 *                   clinicAddress: "123 Main Street"
 *                   isApproved: true
 *   put:
 *     tags: [Doctor - Profile]
 *     summary: Update my profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Dr. John Updated"
 *               profilePhotoUrl:
 *                 type: string
 *                 example: "/uploads/1720000000000.png"
 *               doctorProfile:
 *                 type: object
 *                 properties:
 *                   phoneNumber: { type: string }
 *                   specialization: { type: string }
 *                   qualification: { type: string }
 *                   yearsOfExperience: { type: number }
 *                   hospitalName: { type: string }
 *                   clinicAddress: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *
 * /upload/blood-report:
 *   post:
 *     tags: [Upload]
 *     summary: Upload blood report PDF (Doctor or Patient)
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
 *                 description: PDF file only, max 20MB
 *     responses:
 *       200:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 fileUrl: "/uploads/blood-reports/blood-report-1720000000000.pdf"
 *                 originalName: "cbc-report.pdf"
 *                 size: 204800
 *
 * /doctor/blood-reports:
 *   post:
 *     tags: [Doctor - Blood Reports]
 *     summary: Upload blood report for a patient
 *     description: |
 *       First upload the PDF using POST /upload/blood-report, then use the returned fileUrl here.
 *       Only works for patients who have had at least one appointment with this doctor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, title, fileUrl]
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: Patient's user ID
 *               title:
 *                 type: string
 *                 example: "CBC Report July 2026"
 *               fileUrl:
 *                 type: string
 *                 example: "/uploads/blood-reports/blood-report-123.pdf"
 *               notes:
 *                 type: string
 *                 example: "All values within normal range. Vitamin D slightly low."
 *     responses:
 *       201:
 *         description: Blood report uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "report_id"
 *                 patientId: "patient_id"
 *                 doctorId: "doctor_id"
 *                 title: "CBC Report July 2026"
 *                 fileUrl: "/uploads/blood-reports/blood-report-123.pdf"
 *                 notes: "All values within normal range"
 *                 uploadedAt: "2026-08-13T10:00:00.000Z"
 *                 patient:
 *                   fullName: "John Doe"
 *                   email: "john@example.com"
 *   get:
 *     tags: [Doctor - Blood Reports]
 *     summary: Get all blood reports I uploaded
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema: { type: string }
 *         description: Filter by specific patient
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by report title
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated list of blood reports
 *
 * /doctor/blood-reports/{id}:
 *   get:
 *     tags: [Doctor - Blood Reports]
 *     summary: Get single blood report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blood report with patient details
 *       404:
 *         description: Blood report not found
 *   put:
 *     tags: [Doctor - Blood Reports]
 *     summary: Update blood report
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
 *               title: { type: string }
 *               notes: { type: string }
 *               fileUrl: { type: string }
 *     responses:
 *       200:
 *         description: Blood report updated
 *   delete:
 *     tags: [Doctor - Blood Reports]
 *     summary: Delete blood report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blood report deleted
 *
 * /patient/blood-reports:
 *   get:
 *     tags: [Patient - Blood Reports]
 *     summary: Get my blood reports (uploaded by doctors)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Paginated list of my blood reports
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 items:
 *                   - id: "report_id"
 *                     title: "CBC Report July 2026"
 *                     fileUrl: "/uploads/blood-reports/blood-report-123.pdf"
 *                     notes: "All values within normal range"
 *                     uploadedAt: "2026-08-13T10:00:00.000Z"
 *                     doctor:
 *                       fullName: "Dr. John Smith"
 *                       doctorProfile:
 *                         specialization: "Nutrition"
 *                         hospitalName: "City Hospital"
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 5
 *                   totalPages: 1
 *
 * /doctor/dashboard:
 *   get:
 *     tags: [Doctor - Dashboard]
 *     summary: Get doctor home dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor dashboard with stats and upcoming appointment
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 doctor:
 *                   id: "doctor_id"
 *                   fullName: "Dr. John Smith"
 *                   email: "dr.smith@example.com"
 *                   profilePhotoUrl: null
 *                   doctorProfile:
 *                     specialization: "Nutrition"
 *                     qualification: "MBBS, MD"
 *                     hospitalName: "City Hospital"
 *                     yearsOfExperience: 8
 *                     isApproved: true
 *                 stats:
 *                   todayAppointments: 3
 *                   totalPatients: 15
 *                   pendingAppointments: 5
 *                   completedAppointments: 42
 *                 upcomingAppointment:
 *                   id: "appointment_id"
 *                   dateTime: "2026-08-01T10:00:00.000Z"
 *                   type: "ONLINE"
 *                   status: "CONFIRMED"
 *                   patient:
 *                     fullName: "John Doe"
 *                     profilePhotoUrl: null
 *
 * /doctor/appointments:
 *   get:
 *     tags: [Doctor - Appointments]
 *     summary: Get my appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *         description: Filter by appointment status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ONLINE, IN_PERSON]
 *         description: Filter by appointment type
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Show only upcoming appointments
 *         example: true
 *       - in: query
 *         name: today
 *         schema:
 *           type: boolean
 *         description: Show only today's appointments
 *         example: true
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated list of appointments
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 items:
 *                   - id: "appointment_id"
 *                     dateTime: "2026-08-01T10:00:00.000Z"
 *                     type: "ONLINE"
 *                     status: "CONFIRMED"
 *                     notes: "Follow-up on diet plan"
 *                     patient:
 *                       id: "patient_id"
 *                       fullName: "John Doe"
 *                       profilePhotoUrl: null
 *                       patientProfile:
 *                         age: 25
 *                         gender: "MALE"
 *                         bloodGroup: "O_POS"
 *                         phoneNumber: "9876543210"
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 20
 *                   totalPages: 2
 *
 * /doctor/appointments/{id}:
 *   get:
 *     tags: [Doctor - Appointments]
 *     summary: Get single appointment detail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Full appointment details with patient profile
 *       404:
 *         description: Appointment not found
 *   patch:
 *     tags: [Doctor - Appointments]
 *     summary: Update appointment (reschedule date/time, type, or notes)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateTime:
 *                 type: string
 *                 example: "2026-08-20T14:00:00.000Z"
 *               type:
 *                 type: string
 *                 enum: [ONLINE, IN_PERSON]
 *               notes:
 *                 type: string
 *                 example: "Rescheduled to clinic visit"
 *     responses:
 *       200:
 *         description: Appointment updated
 *       400:
 *         description: Invalid update (completed/cancelled, conflict, etc.)
 *       404:
 *         description: Appointment not found
 *
 * /doctor/appointments/{id}/status:
 *   patch:
 *     tags: [Doctor - Appointments]
 *     summary: Update appointment status (Confirm / Complete / Cancel)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, COMPLETED, CANCELLED]
 *                 example: CONFIRMED
 *               notes:
 *                 type: string
 *                 example: "Patient completed diet goals this week"
 *     responses:
 *       200:
 *         description: Appointment status updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Appointment status updated"
 *               data:
 *                 id: "appointment_id"
 *                 status: "CONFIRMED"
 *                 dateTime: "2026-08-01T10:00:00.000Z"
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Appointment not found
 *
 * /doctor/patients:
 *   get:
 *     tags: [Doctor - Patients]
 *     summary: Get my patients (patients who had appointments with me)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated list of my patients with last appointment info
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 items:
 *                   - id: "patient_id"
 *                     fullName: "John Doe"
 *                     email: "john@example.com"
 *                     profilePhotoUrl: null
 *                     patientProfile:
 *                       age: 25
 *                       gender: "MALE"
 *                       bloodGroup: "O_POS"
 *                       location: "Delhi"
 *                       heightCm: 175
 *                       weightKg: 70
 *                     lastAppointment:
 *                       id: "appointment_id"
 *                       dateTime: "2026-07-20T10:00:00.000Z"
 *                       status: "COMPLETED"
 *                       type: "ONLINE"
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 15
 *                   totalPages: 2
 *
 * /doctor/patients/{id}:
 *   get:
 *     tags: [Doctor - Patients]
 *     summary: Get patient details with full appointment history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient full profile + appointment history with this doctor
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "patient_id"
 *                 fullName: "John Doe"
 *                 email: "john@example.com"
 *                 patientProfile:
 *                   age: 25
 *                   gender: "MALE"
 *                   bloodGroup: "O_POS"
 *                   heightCm: 175
 *                   weightKg: 70
 *                   phoneNumber: "9876543210"
 *                   location: "Delhi"
 *                 appointmentHistory:
 *                   - id: "apt_id_1"
 *                     dateTime: "2026-07-20T10:00:00.000Z"
 *                     type: "ONLINE"
 *                     status: "COMPLETED"
 *                     notes: "Initial consultation"
 *                   - id: "apt_id_2"
 *                     dateTime: "2026-08-01T10:00:00.000Z"
 *                     type: "ONLINE"
 *                     status: "CONFIRMED"
 *                     notes: "Follow-up"
 *       404:
 *         description: Patient not found or not associated with you
 */
