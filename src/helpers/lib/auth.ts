import { getCookie } from "./storage";


export function isLoggedIn(): boolean {
  const token = getCookie('token');
  return !!token;
}