export type UserMetadata = {
  email: string;
  email_verified: boolean;
  full_name: string;
  phone_verified: boolean;
  roles: string[];
  sub: string;
};


export function getUserFromToken(token: string): UserMetadata | null {
  try {
    // JWT punya 3 bagian: header.payload.signature
    const bagian = token.split('.');
    if (bagian.length !== 3) {
      throw new Error('Format JWT tidak valid');
    }

    // Ambil payload (bagian ke-2), lalu decode base64-nya
    const payload = JSON.parse(atob(bagian[1]));

    // Ambil user_metadata
    return payload.user_metadata || null;
  } catch (err) {
    // console.error('Gagal decode JWT:', err);
    return null;
  }
}

export const checkRole = (role: string[], userRole: string[]): boolean => {
  if (role.includes('*')) return true;
  return role.some((r) => userRole.includes(r));
};