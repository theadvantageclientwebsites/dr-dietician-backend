const prisma = require("../../../lib/prisma");

const getDigitalProducts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { status: "PUBLISHED" };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { author: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = { contains: query.category, mode: "insensitive" };
  }

  if (query.isFree !== undefined) {
    where.isFree = query.isFree === "true";
  }

  if (query.language) {
    where.language = { contains: query.language, mode: "insensitive" };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = Number(query.minPrice);
    if (query.maxPrice) where.price.lte = Number(query.maxPrice);
  }

  const totalItems = await prisma.digitalProduct.count({ where });

  const items = await prisma.digitalProduct.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    // Don't expose fileUrl in browse list — only in single view after purchase
    select: {
      id: true,
      title: true,
      category: true,
      price: true,
      description: true,
      thumbnailUrl: true,
      author: true,
      pageCount: true,
      language: true,
      isFree: true,
      totalSales: true,
      createdAt: true,
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
  };
};

const getDigitalProductById = async (productId) => {
  const product = await prisma.digitalProduct.findFirst({
    where: {
      id: productId,
      status: "PUBLISHED",
    },
    // fileUrl available in detail view (will be gated by purchase later)
    select: {
      id: true,
      title: true,
      category: true,
      price: true,
      description: true,
      thumbnailUrl: true,
      fileUrl: true,
      author: true,
      pageCount: true,
      language: true,
      isFree: true,
      totalSales: true,
      createdAt: true,
    },
  });

  if (!product) throw new Error("Product not found");

  return product;
};

module.exports = {
  getDigitalProducts,
  getDigitalProductById,
};
