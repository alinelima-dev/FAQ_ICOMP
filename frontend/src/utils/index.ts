import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (err) {
    return true;
  }
}
