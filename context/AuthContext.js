// /context/AuthContext.js
import { createContext, useContext, useEffect,useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the auth token from local storage
    const token = nookies.get().authToken;
    if (token) {
      setUser({ accessToken: token });
    }
  }, []);

  const login = (userData) => {
    // Set the token as a cookie
    nookies.set(null, 'authToken', userData.accessToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    setUser(userData);
    router.push('/customer');
  };

  const logout = () => {
    nookies.destroy(null, 'authToken');
    setUser(null);
    router.push('/login'); 
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
