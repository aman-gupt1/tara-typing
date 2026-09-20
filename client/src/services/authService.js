import { api } from './api';

export const authService = {
  /**
   * Log in using email or username and password
   * POST /api/auth/login
   */
  login: async (credentials, optionalPassword) => {
    let identifier = '';
    let password = '';

    if (typeof credentials === 'string') {
      identifier = credentials.trim();
      password = optionalPassword || '';
    } else if (credentials && typeof credentials === 'object') {
      identifier = (credentials.identifier || credentials.id || credentials.email || credentials.username || '').trim();
      password = credentials.password || optionalPassword || '';
    }

    const res = await api.post('/auth/login', {
      identifier,
      password,
    });

    return res.user;
  },

  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (nameOrData, username, email, password) => {
    let payload = {};
    if (typeof nameOrData === 'object') {
      payload = {
        name: nameOrData.name,
        username: nameOrData.username,
        email: nameOrData.email,
        password: nameOrData.password,
      };
    } else {
      payload = {
        name: nameOrData,
        username,
        email,
        password,
      };
    }

    const res = await api.post('/auth/register', payload);
    return res.user;
  },

  /**
   * Get current authenticated user from backend session
   * Uses GET /api/profile
   */
  getCurrentUser: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.user || null;
    } catch (err) {
      if (err?.status === 404) {
        // Fallback to /profile if /auth/me endpoint differs
        try {
          const profRes = await api.get('/profile');
          return profRes.user || null;
        } catch {
          return null;
        }
      }
      // 401 or network error means unauthenticated/guest
      return null;
    }
  },

  /**
   * Log out current user (clears backend cookie)
   * POST /api/auth/logout
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout warning:', err.message);
    }
    return true;
  },

  /**
   * Change user password
   * Supports backend route (PATCH /api/auth/change-password) and POST fallback
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      return await api.patch('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (err) {
      if (err?.status === 404 || err?.status === 405) {
        return await api.post('/auth/change-password', {
          currentPassword,
          newPassword,
        });
      }
      throw err;
    }
  },

  /**
   * 1-Click Demo Login
   */
  loginDemo: async () => {
    try {
      return await authService.login('taratypist', 'password123');
    } catch (err) {
      // If demo user hasn't been seeded yet, register and login
      try {
        return await authService.register({
          name: 'Tara Demo User',
          username: 'taratypist',
          email: 'demo@taratyping.com',
          password: 'password123',
        });
      } catch (regErr) {
        // Retry login if already exists
        return await authService.login('taratypist', 'password123');
      }
    }
  },
};

export default authService;

