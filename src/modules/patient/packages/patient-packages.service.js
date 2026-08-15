const prisma = require("../../../lib/prisma");

const getPackages = async (query) => {
  const where = { isActive: true };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { category: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = { contains: query.category, mode: "insensitive" };
  }

  const packages = await prisma.package.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      freebies: {
        select: {
          id: true,
          title: true,
          category: true,
          thumbnailUrl: true,
          previewUrl: true,
          author: true,
          price: true,
        },
      },
    },
  });

  return packages;
};

const getPackageById = async (packageId) => {
  const pkg = await prisma.package.findFirst({
    where: {
      id: packageId,
      isActive: true,
    },
    include: {
      freebies: {
        select: {
          id: true,
          title: true,
          category: true,
          thumbnailUrl: true,
          previewUrl: true,
          author: true,
          price: true,
        },
      },
    },
  });

  if (!pkg) throw new Error("Package not found");

  return pkg;
};

module.exports = {
  getPackages,
  getPackageById,
};
