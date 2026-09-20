const TOKEN_KEY = 'tara_typing_token';
const USER_KEY = 'tara_typing_user';
const SETTINGS_KEY = 'tara_typing_settings';
const RESULTS_KEY = 'tara_typing_results';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getSettings: () => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setSettings: (settings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)),

  getLocalResults: () => {
    try {
      const data = localStorage.getItem(RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveLocalResult: (result) => {
    try {
      const existing = storage.getLocalResults();
      const updated = [result, ...existing].slice(0, 50); // Keep last 50 results
      localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }
};
