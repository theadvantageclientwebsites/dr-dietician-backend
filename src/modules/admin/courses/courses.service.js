const prisma = require("../../../lib/prisma");

// ─── Course CRUD ──────────────────────────────────────────────────────────────

const createCourse = async (data) => {
  const {
    title,
    description,
    thumbnailUrl,
    category,
    instructor,
    duration,
    minSemester,
    minYear,
    hasFinalTest,
    isActive,
  } = data;

  if (!title) throw new Error("title is required");

  return prisma.course.create({
    data: {
      title,
      description: description || null,
      thumbnailUrl: thumbnailUrl || null,
      category: category || null,
      instructor: instructor || null,
      duration: duration || null,
      minSemester: minSemester ? Number(minSemester) : null,
      minYear: minYear ? Number(minYear) : null,
      hasFinalTest: Boolean(hasFinalTest) || false,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      totalLessons: 0,
    },
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
};

const getCourses = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { instructor: { contains: query.search, mode: "insensitive" } },
      { category: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = { contains: query.category, mode: "insensitive" };
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive === "true";
  }

  if (query.hasFinalTest !== undefined) {
    where.hasFinalTest = query.hasFinalTest === "true";
  }

  const totalItems = await prisma.course.count({ where });

  const items = await prisma.course.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
  });

  // Attach completedCount dynamically
  const itemsWithStats = await Promise.all(
    items.map(async (course) => {
      const completedCount = await prisma.courseEnrollment.count({
        where: { courseId: course.id, status: "COMPLETED" },
      });
      return { ...course, completedCount };
    })
  );

  return {
    items: itemsWithStats,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    filters: {
      search: query.search || null,
      category: query.category || null,
      isActive: query.isActive || null,
      hasFinalTest: query.hasFinalTest || null,
    },
  };
};

const getCourseById = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) throw new Error("Course not found");

  const completedCount = await prisma.courseEnrollment.count({
    where: { courseId, status: "COMPLETED" },
  });

  return { ...course, completedCount };
};

const updateCourse = async (courseId, data) => {
  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) throw new Error("Course not found");

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.instructor !== undefined) updateData.instructor = data.instructor;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.minSemester !== undefined) updateData.minSemester = Number(data.minSemester);
  if (data.minYear !== undefined) updateData.minYear = Number(data.minYear);
  if (data.hasFinalTest !== undefined) updateData.hasFinalTest = Boolean(data.hasFinalTest);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  return prisma.course.update({
    where: { id: courseId },
    data: updateData,
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
};

const deleteCourse = async (courseId) => {
  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) throw new Error("Course not found");

  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course deleted successfully" };
};

// ─── Lesson CRUD ──────────────────────────────────────────────────────────────

const addLesson = async (courseId, data) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");

  const { title, content, videoUrl, fileUrl, order, durationMin, isActive } = data;
  if (!title) throw new Error("Lesson title is required");

  // Auto-assign order if not provided
  let lessonOrder = order;
  if (!lessonOrder) {
    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });
    lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title,
      content: content || null,
      videoUrl: videoUrl || null,
      fileUrl: fileUrl || null,
      order: Number(lessonOrder),
      durationMin: durationMin ? Number(durationMin) : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  // Update totalLessons count on course
  await prisma.course.update({
    where: { id: courseId },
    data: { totalLessons: { increment: 1 } },
  });

  return lesson;
};

const updateLesson = async (lessonId, data) => {
  const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!existing) throw new Error("Lesson not found");

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
  if (data.order !== undefined) updateData.order = Number(data.order);
  if (data.durationMin !== undefined) updateData.durationMin = Number(data.durationMin);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  return prisma.lesson.update({ where: { id: lessonId }, data: updateData });
};

const deleteLesson = async (lessonId) => {
  const existing = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!existing) throw new Error("Lesson not found");

  await prisma.lesson.delete({ where: { id: lessonId } });

  // Decrement totalLessons count on course
  await prisma.course.update({
    where: { id: existing.courseId },
    data: { totalLessons: { decrement: 1 } },
  });

  return { message: "Lesson deleted successfully" };
};

// ─── Enrollment Overview (Admin) ──────────────────────────────────────────────

const getCourseEnrollments = async (courseId, query) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { courseId };
  if (query.status) where.status = query.status.toUpperCase();

  const totalItems = await prisma.courseEnrollment.count({ where });

  const enrollments = await prisma.courseEnrollment.findMany({
    where,
    skip,
    take: limit,
    orderBy: { enrolledAt: "desc" },
    include: {
      intern: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhotoUrl: true,
          internProfile: {
            select: {
              universityName: true,
              specialization: true,
              semester: true,
              year: true,
            },
          },
        },
      },
      lessonProgress: {
        select: {
          lessonId: true,
          isCompleted: true,
          completedAt: true,
        },
      },
    },
  });

  return {
    items: enrollments,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  getCourseEnrollments,
};
