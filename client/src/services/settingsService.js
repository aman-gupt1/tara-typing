import { api } from './api';

/**
 * Settings API Service
 * Handles fetching, updating, and resetting user settings via backend API.
 * Uses HTTP-only cookie authentication via existing api client.
 */
export const settingsService = {
  /**
   * Get user settings from backend
   * GET /api/settings
   * @returns {Promise<{success: boolean, settings: Object}>}
   */
  getSettings: async () => {
    return await api.get('/settings');
  },

  /**
   * Update user settings (sends only changed settings)
   * PATCH /api/settings
   * @param {Object} updates - Subset of settings to update
   * @returns {Promise<{success: boolean, message: string, settings: Object}>}
   */
  updateSettings: async (updates) => {
    return await api.patch('/settings', updates);
  },

  /**
   * Reset all settings to defaults
   * POST /api/settings/reset
   * @returns {Promise<{success: boolean, message: string, settings: Object}>}
   */
  resetSettings: async () => {
    return await api.post('/settings/reset');
  },
};

export default settingsService;
