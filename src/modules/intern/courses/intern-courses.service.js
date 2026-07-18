const prisma = require("../../../lib/prisma");

// ─── Get available courses for intern ────────────────────────────────────────

const getAvailableCourses = async (internId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get intern profile to check eligibility
  const intern = await prisma.user.findUnique({
    where: { id: internId },
    include: { internProfile: true },
  });

  if (!intern) throw new Error("Intern not found");

  const where = { isActive: true };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { category: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = { contains: query.category, mode: "insensitive" };
  }

  const totalItems = await prisma.course.count({ where });

  const courses = await prisma.course.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  // Check if intern is already enrolled in each course
  const internSemester = intern.internProfile?.semester || 0;
  const internYear = intern.internProfile?.year || 0;

  const coursesWithEnrollment = await Promise.all(
    courses.map(async (course) => {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: { internId_courseId: { internId, courseId: course.id } },
      });

      const isEligible =
        (!course.minSemester || internSemester >= course.minSemester) &&
        (!course.minYear || internYear >= course.minYear);

      return {
        ...course,
        isEnrolled: !!enrollment,
        enrollmentStatus: enrollment?.status || null,
        progress: enrollment?.progress || 0,
        isEligible,
      };
    })
  );

  return {
    items: coursesWithEnrollment,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

// ─── Enroll in course ─────────────────────────────────────────────────────────

const enrollInCourse = async (internId, courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });

  if (!course || !course.isActive) throw new Error("Course not found or inactive");

  // Check if already enrolled
  const existing = await prisma.courseEnrollment.findUnique({
    where: { internId_courseId: { internId, courseId } },
  });

  if (existing) throw new Error("Already enrolled in this course");

  // Check eligibility
  const intern = await prisma.user.findUnique({
    where: { id: internId },
    include: { internProfile: true },
  });

  const internSemester = intern.internProfile?.semester || 0;
  const internYear = intern.internProfile?.year || 0;

  if (course.minSemester && internSemester < course.minSemester) {
    throw new Error(`Minimum semester ${course.minSemester} required`);
  }

  if (course.minYear && internYear < course.minYear) {
    throw new Error(`Minimum year ${course.minYear} required`);
  }

  // Create enrollment and initialize lesson progress records
  const enrollment = await prisma.courseEnrollment.create({
    data: {
      internId,
      courseId,
      status: "ENROLLED",
      progress: 0,
      lessonProgress: {
        create: course.lessons.map((lesson) => ({
          lessonId: lesson.id,
          isCompleted: false,
        })),
      },
    },
    include: {
      course: { select: { id: true, title: true, totalLessons: true } },
      lessonProgress: true,
    },
  });

  return enrollment;
};

// ─── Get my enrolled courses ──────────────────────────────────────────────────

const getMyEnrollments = async (internId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { internId };
  if (query.status) where.status = query.status.toUpperCase();

  const totalItems = await prisma.courseEnrollment.count({ where });

  const enrollments = await prisma.courseEnrollment.findMany({
    where,
    skip,
    take: limit,
    orderBy: { enrolledAt: "desc" },
    include: {
      course: {
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
      lessonProgress: true,
    },
  });

  return {
    items: enrollments,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
};

// ─── Get course with my progress ─────────────────────────────────────────────

const getCourseWithProgress = async (internId, courseId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { internId_courseId: { internId, courseId } },
    include: {
      course: {
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
      lessonProgress: true,
    },
  });

  if (!enrollment) throw new Error("You are not enrolled in this course");

  // Merge lesson data with progress
  const lessonsWithProgress = enrollment.course.lessons.map((lesson) => {
    const progress = enrollment.lessonProgress.find(
      (lp) => lp.lessonId === lesson.id
    );
    return {
      ...lesson,
      isCompleted: progress?.isCompleted || false,
      completedAt: progress?.completedAt || null,
    };
  });

  return {
    ...enrollment,
    course: {
      ...enrollment.course,
      lessons: lessonsWithProgress,
    },
  };
};

// ─── Mark lesson as complete ──────────────────────────────────────────────────

const completeLesson = async (internId, courseId, lessonId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { internId_courseId: { internId, courseId } },
    include: {
      lessonProgress: true,
      course: { include: { lessons: { where: { isActive: true } } } },
    },
  });

  if (!enrollment) throw new Error("You are not enrolled in this course");

  // Mark lesson as complete
  await prisma.lessonProgress.update({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId,
      },
    },
    data: {
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  // Recalculate progress
  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.lessonProgress.filter(
    (lp) => lp.isCompleted || lp.lessonId === lessonId
  ).length;

  const progress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // Determine new enrollment status
  let status = "IN_PROGRESS";
  if (progress === 100) {
    status = enrollment.course.hasFinalTest ? "IN_PROGRESS" : "COMPLETED";
  }

  const updatedEnrollment = await prisma.courseEnrollment.update({
    where: { id: enrollment.id },
    data: {
      progress,
      status,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
  });

  return {
    lessonId,
    isCompleted: true,
    progress: updatedEnrollment.progress,
    status: updatedEnrollment.status,
  };
};

// ─── Complete final test (mark course as completed) ───────────────────────────

const completeFinalTest = async (internId, courseId, passed) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { internId_courseId: { internId, courseId } },
    include: { course: true },
  });

  if (!enrollment) throw new Error("You are not enrolled in this course");
  if (!enrollment.course.hasFinalTest) throw new Error("This course has no final test");
  if (enrollment.progress < 100) throw new Error("Complete all lessons before taking the final test");

  const status = passed ? "COMPLETED" : "FAILED";

  const updated = await prisma.courseEnrollment.update({
    where: { id: enrollment.id },
    data: {
      status,
      ...(passed && { completedAt: new Date() }),
    },
  });

  return {
    courseId,
    passed,
    status: updated.status,
    completedAt: updated.completedAt,
  };
};

module.exports = {
  getAvailableCourses,
  enrollInCourse,
  getMyEnrollments,
  getCourseWithProgress,
  completeLesson,
  completeFinalTest,
};
