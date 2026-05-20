export function sanitizeText(value, maxLength = 120) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizePhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("8") && digits.length === 11) return `+7${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;

  return `+${digits}`;
}

export function isValidKazakhstanPhone(value) {
  return /^\+7\d{10}$/.test(normalizePhone(value));
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim().toLowerCase());
}

export function normalizeEmail(value) {
  return sanitizeText(value, 254).toLowerCase();
}
