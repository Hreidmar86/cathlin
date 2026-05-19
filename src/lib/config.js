export const TEAM_NAME = import.meta.env.VITE_TEAM_NAME?.trim() || "C&R";
export const APP_NAME = "C&R Predators";
export const STORAGE_BUCKET = "catch-photos";
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "cathlin@example.com,robin@example.com")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);
