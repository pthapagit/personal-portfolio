/**
 * Pure route-protection decision for the admin studio, shared by proxy.ts.
 * Returns where to redirect, or null to allow the request through.
 */
export function studioRedirect(opts: {
  path: string;
  isAdmin: boolean;
}): "login" | "studio" | null {
  const { path, isAdmin } = opts;
  const isStudio = path === "/studio" || path.startsWith("/studio/");
  if (!isStudio) return null;

  const isLogin = path === "/studio/login";
  if (!isLogin && !isAdmin) return "login";
  if (isLogin && isAdmin) return "studio";
  return null;
}
