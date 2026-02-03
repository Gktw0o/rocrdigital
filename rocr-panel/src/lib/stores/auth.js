/**
 * Authentication Store for rocr-panel
 * Manages user authentication state, tokens, and API calls
 */
import { writable, derived, get } from "svelte/store";

// API URL - defaults to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Token storage keys
const ACCESS_TOKEN_KEY = "rocr_access_token";
const REFRESH_TOKEN_KEY = "rocr_refresh_token";
const USER_KEY = "rocr_user";

// Create stores
const userStore = writable(null);
const isLoadingStore = writable(true);
const errorStore = writable(null);

// Derived store for isAuthenticated
const isAuthenticatedStore = derived(userStore, ($user) => !!$user);

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
export async function apiRequest(endpoint, options = {}) {
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
  // Subscribe methods for stores
  subscribe: userStore.subscribe,
  
  // Getters using get() for current values
  get user() {
    return get(userStore);
  },
  get isLoading() {
    return get(isLoadingStore);
  },
  get error() {
    return get(errorStore);
  },
  get isAuthenticated() {
    return get(isAuthenticatedStore);
  },

  // Initialize auth state from storage
  async init() {
    isLoadingStore.set(true);
    errorStore.set(null);

    try {
      const { accessToken } = getStoredTokens();

      if (!accessToken) {
        userStore.set(null);
        isLoadingStore.set(false);
        return false;
      }

      // Verify token by getting current user
      const response = await apiRequest("/api/v1/auth/me");

      if (response.ok) {
        const data = await response.json();
        userStore.set(data.data);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data));
        isLoadingStore.set(false);
        return true;
      } else {
        // Token invalid, try refresh
        const refreshed = await this.refreshToken();
        isLoadingStore.set(false);
        return refreshed;
      }
    } catch (err) {
      console.error("Auth init error:", err);
      userStore.set(null);
      clearTokens();
      isLoadingStore.set(false);
      return false;
    }
  },

  // Login with email and password
  async login(email, password) {
    isLoadingStore.set(true);
    errorStore.set(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorStore.set(data.error || "Login failed");
        isLoadingStore.set(false);
        return false;
      }

      // Store tokens and user
      storeTokens(data.data.accessToken, data.data.refreshToken);
      userStore.set(data.data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));

      isLoadingStore.set(false);
      return true;
    } catch (err) {
      errorStore.set(err.message || "Network error");
      isLoadingStore.set(false);
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
      userStore.set(null);
      errorStore.set(null);
      clearTokens();
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const { refreshToken } = getStoredTokens();

      if (!refreshToken) {
        userStore.set(null);
        return false;
      }

      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        userStore.set(null);
        clearTokens();
        return false;
      }

      const data = await response.json();
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);

      // Reload user data
      const meResponse = await apiRequest("/api/v1/auth/me");
      if (meResponse.ok) {
        const meData = await meResponse.json();
        userStore.set(meData.data);
        localStorage.setItem(USER_KEY, JSON.stringify(meData.data));
      }

      return true;
    } catch (err) {
      console.error("Token refresh error:", err);
      userStore.set(null);
      clearTokens();
      return false;
    }
  },

  // Update password
  async updatePassword(currentPassword, newPassword) {
    errorStore.set(null);

    try {
      const response = await apiRequest("/api/v1/auth/update-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorStore.set(data.error || "Failed to update password");
        return false;
      }

      // Password changed, user needs to re-login
      await this.logout();
      return true;
    } catch (err) {
      errorStore.set(err.message || "Network error");
      return false;
    }
  },

  // Clear error
  clearError() {
    errorStore.set(null);
  },
};
