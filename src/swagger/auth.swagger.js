/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Server health check
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Server is running fine
 *
 * /auth/register/patient:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "12345678" }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY] }
 *               location: { type: string, example: "New Delhi" }
 *               phoneNumber: { type: string, example: "9876543210" }
 *               whatsappNumber: { type: string, example: "9876543210" }
 *               age: { type: number, example: 25 }
 *               heightCm: { type: number, example: 175 }
 *               weightKg: { type: number, example: 70 }
 *               bloodGroup: { type: string, enum: [A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG] }
 *               socialHandle: { type: string, example: "@john" }
 *               isDefencePersonnel: { type: boolean, example: false }
 *     responses:
 *       200:
 *         description: Patient registered successfully
 *
 * /auth/register/doctor:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string, example: "Dr. Smith" }
 *               email: { type: string, example: "dr.smith@example.com" }
 *               password: { type: string, example: "12345678" }
 *               phoneNumber: { type: string, example: "9876543210" }
 *               specialization: { type: string, example: "Nutrition" }
 *               qualification: { type: string, example: "MBBS, MD" }
 *               licenseNumber: { type: string, example: "LIC123456" }
 *               yearsOfExperience: { type: number, example: 8 }
 *               hospitalName: { type: string, example: "City Hospital" }
 *               clinicAddress: { type: string, example: "Main Road" }
 *     responses:
 *       200:
 *         description: Doctor registered successfully
 *
 * /auth/register/intern:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new intern
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string, example: "Jane Intern" }
 *               email: { type: string, example: "jane@example.com" }
 *               password: { type: string, example: "12345678" }
 *               phoneNumber: { type: string, example: "1234567890" }
 *               universityName: { type: string, example: "AIIMS Delhi" }
 *               specialization: { type: string, example: "Dietetics" }
 *               semester: { type: number, example: 4 }
 *               year: { type: number, example: 2023 }
 *     responses:
 *       200:
 *         description: Intern registered successfully
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login for all roles (Patient, Doctor, Intern, Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@drdiettherapy.com" }
 *               password: { type: string, example: "12345678" }
 *     responses:
 *       200:
 *         description: Login successful - returns JWT token
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 token: "jwt_token_here"
 *                 user:
 *                   id: "user_id"
 *                   fullName: "Admin User"
 *                   email: "admin@drdiettherapy.com"
 *                   role: "ADMIN"
 *
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 */
