const prisma = require("../../../lib/prisma");

const createPackage = async (data) => {
  const {
    name,
    category,
    description,
    price1Month,
    price3Months,
    price6Months,
    features,
    isActive,
  } = data;

  if (!name || !category || price1Month === undefined || price3Months === undefined || price6Months === undefined) {
    throw new Error("name, category, price1Month, price3Months and price6Months are required");
  }

  const newPackage = await prisma.package.create({
    data: {
      name,
      category,
      description: description || null,
      price1Month: Number(price1Month),
      price3Months: Number(price3Months),
      price6Months: Number(price6Months),
      features: features || [],
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return newPackage;
};

const getPackages = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Search by name or category
  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Filter by category
  if (query.category) {
    where.category = {
      contains: query.category,
      mode: "insensitive",
    };
  }

  // Filter by active status
  if (query.isActive !== undefined) {
    where.isActive = query.isActive === "true";
  }

  const totalItems = await prisma.package.count({ where });

  const items = await prisma.package.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    items,
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
    },
  };
};

const getPackageById = async (packageId) => {
  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!pkg) {
    throw new Error("Package not found");
  }

  return pkg;
};

const updatePackage = async (packageId, data) => {
  const existing = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!existing) {
    throw new Error("Package not found");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price1Month !== undefined) updateData.price1Month = Number(data.price1Month);
  if (data.price3Months !== undefined) updateData.price3Months = Number(data.price3Months);
  if (data.price6Months !== undefined) updateData.price6Months = Number(data.price6Months);
  if (data.features !== undefined) updateData.features = data.features;
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  const updated = await prisma.package.update({
    where: { id: packageId },
    data: updateData,
  });

  return updated;
};

const togglePackageStatus = async (packageId, isActive) => {
  const existing = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!existing) {
    throw new Error("Package not found");
  }

  const updated = await prisma.package.update({
    where: { id: packageId },
    data: { isActive: Boolean(isActive) },
  });

  return updated;
};

const deletePackage = async (packageId) => {
  const existing = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!existing) {
    throw new Error("Package not found");
  }

  await prisma.package.delete({
    where: { id: packageId },
  });

  return { message: "Package deleted successfully" };
};

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  togglePackageStatus,
  deletePackage,
};
