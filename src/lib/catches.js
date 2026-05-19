import { clampNumber, normalizeDate, sanitizeArray, sanitizeText } from "./format";

export function normalizeCatch(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: String(raw.id || ""),
    angler: sanitizeText(raw.angler, 24) || "Okänd",
    species: sanitizeText(raw.species, 24) || "Fisk",
    length: clampNumber(raw.length, 0, 250),
    weight: clampNumber(raw.weight, 0, 200),
    date: normalizeDate(raw.date),
    location: sanitizeText(raw.location, 48),
    method: sanitizeText(raw.method, 32),
    weather: sanitizeText(raw.weather, 32),
    lure: sanitizeText(raw.lure, 32),
    note: sanitizeText(raw.note, 280),
    photoUrl: typeof raw.photoUrl === "string" ? raw.photoUrl : typeof raw.photo_url === "string" ? raw.photo_url : "",
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

export function toCatchRow(values, photoUrl, createdBy) {
  return {
    angler: sanitizeText(values.angler, 24),
    species: sanitizeText(values.species, 24),
    length: clampNumber(values.length, 0, 250),
    weight: clampNumber(values.weight, 0, 200),
    date: normalizeDate(values.date),
    location: sanitizeText(values.location, 48),
    method: sanitizeText(values.method, 32),
    weather: sanitizeText(values.weather, 32),
    lure: sanitizeText(values.lure, 32),
    note: sanitizeText(values.note, 280),
    photo_url: photoUrl || "",
    mood: sanitizeText(values.mood, 24),
    tags: sanitizeArray(values.tags),
    released: Boolean(values.released),
    trip_name: sanitizeText(values.tripName, 48),
    ...(createdBy ? { created_by: createdBy } : {})
  };
}
