// utils/auth.js
import { parseCookies } from 'nookies';

export const isAuthenticated = (req) => {
    const cookies = parseCookies({ req });
    console.log("Cookies:", cookies);
  return cookies.authToken ? true : false;
};
