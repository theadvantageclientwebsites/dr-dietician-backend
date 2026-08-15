const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const toAbs = (fileUrl) => {
  if (!fileUrl) return null;
  const relative = fileUrl.replace(/^\//, "");
  return path.join(process.cwd(), relative);
};

const generatePdfPreview = async (fileUrl) => {
  try {
    const abs = toAbs(fileUrl);
    if (!abs || !fs.existsSync(abs)) return null;

    const src = await PDFDocument.load(fs.readFileSync(abs));
    const preview = await PDFDocument.create();
    const count = Math.min(2, src.getPageCount());
    if (count === 0) return null;

    const pages = await preview.copyPages(src, [...Array(count).keys()]);
    pages.forEach((page) => preview.addPage(page));

    const outDir = path.join(process.cwd(), "uploads", "digital-products", "previews");
    fs.mkdirSync(outDir, { recursive: true });

    const filename = `preview-${Date.now()}.pdf`;
    fs.writeFileSync(path.join(outDir, filename), await preview.save());
    return `/uploads/digital-products/previews/${filename}`;
  } catch (error) {
    console.error("PDF preview generation failed:", error.message);
    return null;
  }
};

module.exports = { generatePdfPreview };
