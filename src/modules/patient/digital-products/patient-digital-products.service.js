const prisma = require("../../../lib/prisma");
const { catalogSelect, getProductAccess, getTwelveMonthFreebieIds } = require("./product-access");

const withAccessFlags = async (patientId, product) => {
  const access = await getProductAccess(patientId, product);
  return {
    ...product,
    fileUrl: access.hasAccess ? product.fileUrl || null : null,
    previewUrl: product.previewUrl || null,
    hasAccess: access.hasAccess,
    accessType: access.accessType,
  };
};

const getDigitalProducts = async (patientId, query) => {
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
    select: catalogSelect,
  });

  const withFlags = await Promise.all(items.map((item) => withAccessFlags(patientId, item)));

  return {
    items: withFlags,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

const getDigitalProductById = async (patientId, productId) => {
  const product = await prisma.digitalProduct.findFirst({
    where: { id: productId, status: "PUBLISHED" },
    select: { ...catalogSelect, fileUrl: true },
  });

  if (!product) throw new Error("Product not found");

  return withAccessFlags(patientId, product);
};

const getMyLibrary = async (patientId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, freebieIds] = await Promise.all([
    prisma.order.findMany({
      where: {
        patientId,
        itemType: "DIGITAL_PRODUCT",
        status: "PAID",
      },
      select: { itemId: true, paidAt: true, createdAt: true },
      orderBy: { paidAt: "desc" },
    }),
    getTwelveMonthFreebieIds(patientId),
  ]);

  const purchasedIds = [...new Set(orders.map((order) => order.itemId))];
  const libraryIds = [...new Set([...purchasedIds, ...freebieIds])];

  if (libraryIds.length === 0) {
    return {
      items: [],
      pagination: { page, limit, totalItems: 0, totalPages: 0 },
    };
  }

  const totalItems = libraryIds.length;
  const pageIds = libraryIds.slice(skip, skip + limit);

  const products = await prisma.digitalProduct.findMany({
    where: { id: { in: pageIds }, status: "PUBLISHED" },
    select: { ...catalogSelect, fileUrl: true },
  });

  const byId = Object.fromEntries(products.map((product) => [product.id, product]));
  const purchasedSet = new Set(purchasedIds);
  const freebieSet = new Set(freebieIds);

  const items = pageIds
    .map((id) => byId[id])
    .filter(Boolean)
    .map((product) => {
      const accessType = purchasedSet.has(product.id)
        ? "PURCHASED"
        : freebieSet.has(product.id)
          ? "PACKAGE_FREEBIE"
          : product.isFree
            ? "FREE"
            : "PURCHASED";
      return {
        ...product,
        hasAccess: true,
        accessType,
      };
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

module.exports = {
  getDigitalProducts,
  getDigitalProductById,
  getMyLibrary,
  getProductAccess,
};
