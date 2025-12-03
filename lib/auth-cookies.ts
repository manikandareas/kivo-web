
import { cookies } from 'next/headers';
export async function authCookies() {
  const cookie = await cookies();
  return {
    fetchOptions: {
      headers: {
        Cookie: cookie.toString()
      }
    }
  };
}