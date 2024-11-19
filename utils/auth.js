// utils/auth.js
import { parseCookies } from 'nookies';

export const isAuthenticated = (req) => {
    const cookies = parseCookies({ req });
  return cookies.authToken ? true : false;
};
