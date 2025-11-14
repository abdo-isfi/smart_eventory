import { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, navigate }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { user, tokens } = await apiLogin(email, password);
      console.log('Login successful - User:', user, 'Token:', tokens.accessToken); // Debug log
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', tokens.accessToken);
      console.log('Token and user saved to localStorage.'); // Debug log
      setUser(user);
      setToken(tokens.accessToken);
      setError(null);
      return { user, token: tokens.accessToken };
    } catch (err) {
      console.error('Login failed in AuthContext:', err); // Debug log
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      const { user, tokens } = await apiRegister(email, password);
      console.log('Registration successful - User:', user, 'Token:', tokens.accessToken); // Debug log
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', tokens.accessToken);
      console.log('Token and user saved to localStorage.'); // Debug log
      setUser(user);
      setToken(tokens.accessToken);
      setError(null);
      return { user, token: tokens.accessToken };
    } catch (err) {
      console.error('Registration failed in AuthContext:', err); // Debug log
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setToken(null);
    setError(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
