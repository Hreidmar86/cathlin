export function formatDate(value) {
  if (!value) return "Okänt datum";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Okänt datum";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium" }).format(date);
}

export function formatNumber(value, unit = "", decimals = 0) {
  const number = Number(value) || 0;
  const suffix = unit ? ` ${unit}` : "";
  return `${number.toLocaleString("sv-SE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`;
}

export function average(values, decimals = 1) {
  if (!values.length) return 0;
  const sum = values.reduce((total, value) => total + Number(value || 0), 0);
  return Number((sum / values.length).toFixed(decimals));
}

export function pluralize(value, singular, plural = `${singular}er`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function sanitizeText(value, maxLength = 120) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function sanitizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeText(item, 24)).filter(Boolean).slice(0, 8);
  }
  return sanitizeText(value, 80)
    .split(",")
    .map((item) => sanitizeText(item, 24))
    .filter(Boolean)
    .slice(0, 8);
}

export function clampNumber(value, min = 0, max = 999) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(max, Math.max(min, parsed));
}

export function normalizeDate(value) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function slugify(value) {
  return sanitizeText(value, 64)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
