export const MIN_PASSWORD_LENGTH = 12;
// Supabase hashes passwords with bcrypt, which ignores bytes beyond 72.
const MAX_PASSWORD_BYTES = 72;

/** Returns an error message, or null when the change is valid. */
export function validatePasswordChange({
  current,
  next,
  confirm,
}: {
  current: string;
  next: string;
  confirm: string;
}): string | null {
  if (!current) return "Enter your current password.";
  if (next.length < MIN_PASSWORD_LENGTH) {
    return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (new TextEncoder().encode(next).length > MAX_PASSWORD_BYTES) {
    return `New password must be at most ${MAX_PASSWORD_BYTES} bytes.`;
  }
  if (next !== confirm) return "New passwords do not match.";
  if (next === current) return "New password must be different from the current one.";
  return null;
}
