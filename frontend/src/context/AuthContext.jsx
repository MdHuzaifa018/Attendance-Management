import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const { user, token } = response.data.data;

    localStorage.setItem("token", token);

    setUser(user);

    return user;
  };

  const register = async (
    name,
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    const { user, token } = response.data.data;

    localStorage.setItem("token", token);

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  const fetchCurrentUser = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get(
        "/auth/me"
      );

      setUser(
        response.data.data.user
      );
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchCurrentUser,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};