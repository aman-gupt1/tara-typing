import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (idOrCredentials, optionalPassword) => {
    try {
      const loggedUser = await authService.login(idOrCredentials, optionalPassword);
      setUser(loggedUser);
      toast.success(`Welcome back, ${loggedUser.name}!`, { toastId: 'auth-login-success' });
      return loggedUser;
    } catch (err) {
      toast.error(err.message || "Failed to login", { toastId: 'auth-login-error' });
      throw err;
    }
  };

  const register = async (nameOrData, username, email, password) => {
    try {
      const newUser = await authService.register(nameOrData, username, email, password);
      setUser(newUser);
      toast.success(`Account created! Welcome to Tara Typing, ${newUser.name}!`, { toastId: 'auth-register-success' });
      return newUser;
    } catch (err) {
      toast.error(err.message || "Failed to register", { toastId: 'auth-register-error' });
      throw err;
    }
  };

  const loginDemo = async () => {
    try {
      const demoUser = await authService.loginDemo();
      setUser(demoUser);
      toast.success("Logged in as Demo User!", { toastId: 'auth-demo-login-success' });
      return demoUser;
    } catch (err) {
      toast.error("Failed to load demo user", { toastId: 'auth-demo-login-error' });
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.info("Logged out successfully", { toastId: 'auth-logout-success' });
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      toast.success(res?.message || "Password changed successfully!", { toastId: 'auth-password-success' });
      return res;
    } catch (err) {
      toast.error(err.message || "Failed to change password", { toastId: 'auth-password-error' });
      throw err;
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : updatedData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginDemo,
        demoLogin: loginDemo, // Alias for 1-click shortcuts in Login/Register
        logout,
        changePassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
