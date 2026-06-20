const ADMIN_EMAIL = 'admin@maisonlac.vn';
const ADMIN_PASSWORD = 'maisonlac2026';

const adminSessions = new Map<string, string>();

export function adminAuth(email: string, password: string): string | null {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return null;
  const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  adminSessions.set(token, email);
  return token;
}

export function isAdmin(sessionToken: string): boolean {
  return adminSessions.has(sessionToken);
}

export function destroyAdminSession(sessionToken: string): void {
  adminSessions.delete(sessionToken);
}

export function getAdminEmail(sessionToken: string): string | undefined {
  return adminSessions.get(sessionToken);
}

export { ADMIN_EMAIL };
