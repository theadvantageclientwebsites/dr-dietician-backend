const DURATION_LABEL = {
  ONE_MONTH: "1 Month",
  THREE_MONTHS: "3 Months",
  SIX_MONTHS: "6 Months",
  TWELVE_MONTHS: "12 Months",
};

const PURCHASABLE_DURATIONS = ["THREE_MONTHS", "SIX_MONTHS", "TWELVE_MONTHS"];

const getDurationMonths = (duration) => {
  switch (duration) {
    case "ONE_MONTH":
      return 1;
    case "THREE_MONTHS":
      return 3;
    case "SIX_MONTHS":
      return 6;
    case "TWELVE_MONTHS":
      return 12;
    default:
      throw new Error("Invalid duration. Use THREE_MONTHS, SIX_MONTHS or TWELVE_MONTHS");
  }
};

const getPackagePrice = (pkg, duration) => {
  switch (duration) {
    case "THREE_MONTHS":
      return pkg.price3Months;
    case "SIX_MONTHS":
      return pkg.price6Months;
    case "TWELVE_MONTHS":
      return pkg.price12Months;
    default:
      throw new Error("Invalid duration. Use THREE_MONTHS, SIX_MONTHS or TWELVE_MONTHS");
  }
};

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const monthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
};

module.exports = {
  DURATION_LABEL,
  PURCHASABLE_DURATIONS,
  getDurationMonths,
  getPackagePrice,
  addMonths,
  monthRange,
};
