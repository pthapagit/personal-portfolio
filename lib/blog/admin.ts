/**
 * Pure authorization check: is this email the single configured blog admin?
 * Kept free of server-only imports so it can be unit tested directly.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  const allow = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!allow) return false;
  return !!email && email.trim().toLowerCase() === allow;
}
