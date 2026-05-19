import { clampNumber, normalizeDate, sanitizeArray, sanitizeText } from "./format";

function getImageUrl(raw) {
  if (typeof raw.imageUrl === "string") return raw.imageUrl;
  if (typeof raw.image_url === "string") return raw.image_url;
  if (typeof raw.photoUrl === "string") return raw.photoUrl;
  if (typeof raw.photo_url === "string") return raw.photo_url;
  return "";
}

export function normalizeCatch(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: String(raw.id || ""),
    angler: sanitizeText(raw.angler, 24) || "Okänd",
    species: sanitizeText(raw.species, 24) || "Fisk",
    lengthCm: clampNumber(raw.lengthCm ?? raw.length_cm ?? raw.length, 0, 250),
    weightKg: clampNumber(raw.weightKg ?? raw.weight_kg ?? raw.weight, 0, 200),
    caughtAt: normalizeDate(raw.caughtAt ?? raw.caught_at ?? raw.date),
    location: sanitizeText(raw.location, 48),
    method: sanitizeText(raw.method, 32),
    weather: sanitizeText(raw.weather, 32),
    lure: sanitizeText(raw.lure, 32),
    note: sanitizeText(raw.note, 280),
    imageUrl: getImageUrl(raw),
    mood: sanitizeText(raw.mood, 24),
    tags: sanitizeArray(raw.tags),
    released: Boolean(raw.released ?? true),
    tripName: sanitizeText(raw.tripName ?? raw.trip_name, 48),
    createdAt: raw.createdAt || raw.created_at || null,
    updatedAt: raw.updatedAt || raw.updated_at || null,
    createdBy: raw.createdBy || raw.created_by || null
  };
}

export function mapCatchRow(row) {
  return normalizeCatch(row);
}

export function toCatchRow(values, imageUrl, createdBy) {
  return {
    angler: sanitizeText(values.angler, 24),
    species: sanitizeText(values.species, 24),
    length_cm: clampNumber(values.lengthCm ?? values.length, 0, 250),
    weight_kg: clampNumber(values.weightKg ?? values.weight, 0, 200),
    caught_at: normalizeDate(values.caughtAt ?? values.date),
    location: sanitizeText(values.location, 48),
    method: sanitizeText(values.method, 32),
    weather: sanitizeText(values.weather, 32),
    lure: sanitizeText(values.lure, 32),
    note: sanitizeText(values.note, 280),
    image_url: imageUrl || "",
    mood: sanitizeText(values.mood, 24),
    tags: sanitizeArray(values.tags),
    released: Boolean(values.released),
    trip_name: sanitizeText(values.tripName, 48),
    ...(createdBy ? { created_by: createdBy } : {})
  };
}
