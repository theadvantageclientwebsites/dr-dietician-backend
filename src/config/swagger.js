const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DrDiet Therapy API",
      version: "1.0.0",
      description: "Complete API documentation for DrDiet Therapy platform",
    },
    servers: [
      {
        url: "https://dr-dietician-backend.onrender.com/api",
        description: "Production Server",
      },
      {
        url: "http://localhost:5000/api",
        description: "Local Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token here",
        },
      },
    },
    tags: [
      { name: "Health", description: "Server health check" },
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Upload", description: "File upload endpoints" },
      { name: "Admin - Dashboard", description: "Admin dashboard" },
      { name: "Admin - Patients", description: "Patient management" },
      { name: "Admin - Doctors", description: "Doctor management" },
      { name: "Admin - Interns", description: "Intern management" },
      { name: "Admin - Appointments", description: "Appointment oversight" },
      { name: "Admin - Packages", description: "Package management" },
      { name: "Admin - Subscriptions", description: "Package purchases and doctor assignment" },
      { name: "Admin - Digital Products", description: "Digital product management" },
      { name: "Admin - Courses", description: "Course management" },
      { name: "Admin - Revenue", description: "Revenue analytics" },
      { name: "Patient - Dashboard", description: "Patient home dashboard" },
      { name: "Patient - Profile", description: "Patient profile" },
      { name: "Patient - Appointments", description: "Patient appointment booking" },
      { name: "Patient - Packages", description: "Patient package browsing and my subscription" },
      { name: "Patient - Digital Products", description: "Patient digital products" },
      { name: "Patient - Payments", description: "Dummy checkout and Razorpay payment flow" },
      { name: "Patient - Blood Reports", description: "Patient blood reports view" },
      { name: "Intern - Courses", description: "Intern LMS" },
      { name: "Doctor - Dashboard", description: "Doctor home dashboard" },
      { name: "Doctor - Profile", description: "Doctor profile management" },
      { name: "Doctor - Appointments", description: "Doctor appointment management" },
      { name: "Doctor - Patients", description: "Doctor patient management" },
      { name: "Doctor - Blood Reports", description: "Blood report management" },
    ],
  },
  apis: ["./src/swagger/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
