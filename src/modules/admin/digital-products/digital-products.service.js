const prisma = require("../../../lib/prisma");

const createDigitalProduct = async (data) => {
  const {
    title,
    category,
    status,
    price,
    description,
    fileUrl,
    thumbnailUrl,
    author,
    pageCount,
    language,
    isFree,
  } = data;

  if (!title || !category) {
    throw new Error("title and category are required");
  }

  const product = await prisma.digitalProduct.create({
    data: {
      title,
      category,
      status: status ? status.toUpperCase() : "DRAFT",
      price: isFree ? 0 : Number(price) || 0,
      description: description || null,
      fileUrl: fileUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      author: author || null,
      pageCount: pageCount ? Number(pageCount) : null,
      language: language || "English",
      isFree: Boolean(isFree) || false,
      totalSales: 0,
    },
  });

  return product;
};

const getDigitalProducts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Search by title or author
  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        author: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Category filter
  if (query.category) {
    where.category = {
      contains: query.category,
      mode: "insensitive",
    };
  }

  // Status filter
  if (query.status) {
    where.status = query.status.toUpperCase();
  }

  // Free/Paid filter
  if (query.isFree !== undefined) {
    where.isFree = query.isFree === "true";
  }

  // Language filter
  if (query.language) {
    where.language = {
      contains: query.language,
      mode: "insensitive",
    };
  }

  // Price range filter
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
      status: query.status || null,
      isFree: query.isFree || null,
      language: query.language || null,
      minPrice: query.minPrice || null,
      maxPrice: query.maxPrice || null,
    },
  };
};

const getDigitalProductById = async (productId) => {
  const product = await prisma.digitalProduct.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Digital product not found");
  }

  return product;
};

const updateDigitalProduct = async (productId, data) => {
  const existing = await prisma.digitalProduct.findUnique({
    where: { id: productId },
  });

  if (!existing) {
    throw new Error("Digital product not found");
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.status !== undefined) updateData.status = data.status.toUpperCase();
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.author !== undefined) updateData.author = data.author;
  if (data.pageCount !== undefined) updateData.pageCount = Number(data.pageCount);
  if (data.language !== undefined) updateData.language = data.language;
  if (data.isFree !== undefined) {
    updateData.isFree = Boolean(data.isFree);
    // If marked as free, set price to 0
    if (data.isFree) updateData.price = 0;
  }

  const updated = await prisma.digitalProduct.update({
    where: { id: productId },
    data: updateData,
  });

  return updated;
};

const updateProductStatus = async (productId, status) => {
  const existing = await prisma.digitalProduct.findUnique({
    where: { id: productId },
  });

  if (!existing) {
    throw new Error("Digital product not found");
  }

  const updated = await prisma.digitalProduct.update({
    where: { id: productId },
    data: { status: status.toUpperCase() },
  });

  return updated;
};

const deleteDigitalProduct = async (productId) => {
  const existing = await prisma.digitalProduct.findUnique({
    where: { id: productId },
  });

  if (!existing) {
    throw new Error("Digital product not found");
  }

  await prisma.digitalProduct.delete({
    where: { id: productId },
  });

  return { message: "Digital product deleted successfully" };
};

module.exports = {
  createDigitalProduct,
  getDigitalProducts,
  getDigitalProductById,
  updateDigitalProduct,
  updateProductStatus,
  deleteDigitalProduct,
};
