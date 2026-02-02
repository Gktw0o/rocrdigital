/**
 * Authentication Store for rocr-panel
 * Manages user authentication state, tokens, and API calls
 */

// API URL - defaults to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Token storage keys
const ACCESS_TOKEN_KEY = "rocr_access_token";
const REFRESH_TOKEN_KEY = "rocr_refresh_token";
const USER_KEY = "rocr_user";

// Reactive state using Svelte 5 runes
let user = $state(null);
let isLoading = $state(true);
let error = $state(null);

// Helper to get stored tokens
function getStoredTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

// Helper to store tokens
function storeTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// Helper to clear tokens
function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
  const { accessToken } = getStoredTokens();
  
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401, try to refresh token
  if (response.status === 401 && !options._isRetry) {
    const refreshed = await auth.refreshToken();
    if (refreshed) {
      // Retry the original request
      return apiRequest(endpoint, { ...options, _isRetry: true });
    }
  }

  return response;
}

// Auth store object
export const auth = {
  // Getters
  get user() { return user; },
  get isLoading() { return isLoading; },
  get error() { return error; },
  get isAuthenticated() { return !!user; },
  
  // Initialize auth state from storage
  async init() {
    isLoading = true;
    error = null;
    
    try {
      const { accessToken } = getStoredTokens();
      
      if (!accessToken) {
        user = null;
        isLoading = false;
        return false;
      }

      // Verify token by getting current user
      const response = await apiRequest("/api/v1/auth/me");
      
      if (response.ok) {
        const data = await response.json();
        user = data.data;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        isLoading = false;
        return true;
      } else {
        // Token invalid, try refresh
        const refreshed = await this.refreshToken();
        isLoading = false;
        return refreshed;
      }
    } catch (err) {
      console.error("Auth init error:", err);
      user = null;
      clearTokens();
      isLoading = false;
      return false;
    }
  },

  // Login with email and password
  async login(email, password) {
    isLoading = true;
    error = null;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        error = data.error || "Login failed";
        isLoading = false;
        return false;
      }

      // Store tokens and user
      storeTokens(data.data.accessToken, data.data.refreshToken);
      user = data.data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      isLoading = false;
      return true;
    } catch (err) {
      error = err.message || "Network error";
      isLoading = false;
      return false;
    }
  },

  // Logout
  async logout() {
    try {
      const { refreshToken } = getStoredTokens();
      
      // Call logout endpoint
      await apiRequest("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch (err) {
      // Ignore errors, just clear local state
      console.error("Logout error:", err);
    } finally {
      user = null;
      error = null;
      clearTokens();
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const { refreshToken } = getStoredTokens();
      
      if (!refreshToken) {
        user = null;
        return false;
      }

      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        user = null;
        clearTokens();
        return false;
      }

      const data = await response.json();
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
      
      // Reload user data
      const meResponse = await apiRequest("/api/v1/auth/me");
      if (meResponse.ok) {
        const meData = await meResponse.json();
        user = meData.data;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      
      return true;
    } catch (err) {
      console.error("Token refresh error:", err);
      user = null;
      clearTokens();
      return false;
    }
  },

  // Update password
  async updatePassword(currentPassword, newPassword) {
    error = null;

    try {
      const response = await apiRequest("/api/v1/auth/update-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        error = data.error || "Failed to update password";
        return false;
      }

      // Password changed, user needs to re-login
      await this.logout();
      return true;
    } catch (err) {
      error = err.message || "Network error";
      return false;
    }
  },

  // Clear error
  clearError() {
    error = null;
  },
};

// Export API request helper for use in other stores
export { apiRequest, API_URL };
