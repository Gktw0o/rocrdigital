/**
 * Data Store - Connected to Backend API
 * Replaces mock data with real API calls
 */
import { writable, derived, get } from "svelte/store";
import { apiRequest, API_URL } from "./auth.js";

// ================================================================
// STORES
// ================================================================

// Main data store
const dataStore = writable({
  contacts: [],
  partners: [],
  services: [],
  content: {},
  team: [],
  isLoading: false,
  error: null,
});

// Loading states for individual operations
const loadingStates = writable({
  contacts: false,
  partners: false,
  services: false,
  content: false,
  team: false,
});

// ================================================================
// API HELPERS
// ================================================================

async function fetchFromAPI(endpoint) {
  try {
    const response = await apiRequest(endpoint);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

async function postToAPI(endpoint, body) {
  try {
    const response = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to post to ${endpoint}:`, error);
    throw error;
  }
}

async function patchAPI(endpoint, body) {
  try {
    const response = await apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to patch ${endpoint}:`, error);
    throw error;
  }
}

async function deleteFromAPI(endpoint) {
  try {
    const response = await apiRequest(endpoint, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete ${endpoint}:`, error);
    throw error;
  }
}

// ================================================================
// DATA STORE WITH API INTEGRATION
// ================================================================

function createDataStore() {
  const { subscribe, set, update } = dataStore;

  return {
    subscribe,
    
    // ============================================
    // INITIALIZATION - Load all data from API
    // ============================================
    async init() {
      update(d => ({ ...d, isLoading: true, error: null }));
      
      try {
        await Promise.all([
          this.loadContacts(),
          this.loadPartners(),
          this.loadServices(),
          this.loadTeam(),
        ]);
      } catch (error) {
        update(d => ({ ...d, error: error.message }));
      } finally {
        update(d => ({ ...d, isLoading: false }));
      }
    },

    // ============================================
    // CONTACTS
    // ============================================
    async loadContacts() {
      loadingStates.update(s => ({ ...s, contacts: true }));
      try {
        const contacts = await fetchFromAPI("/api/v1/contacts");
        update(d => ({ ...d, contacts: Array.isArray(contacts) ? contacts : contacts.data || [] }));
      } finally {
        loadingStates.update(s => ({ ...s, contacts: false }));
      }
    },

    async updateContact(id, updates) {
      const result = await patchAPI(`/api/v1/contacts/${id}`, updates);
      update(d => ({
        ...d,
        contacts: d.contacts.map(c => c.id === id ? { ...c, ...result.data } : c),
      }));
      return result;
    },

    async deleteContact(id) {
      await deleteFromAPI(`/api/v1/contacts/${id}`);
      update(d => ({
        ...d,
        contacts: d.contacts.filter(c => c.id !== id),
      }));
    },

    // ============================================
    // PARTNERS
    // ============================================
    async loadPartners() {
      loadingStates.update(s => ({ ...s, partners: true }));
      try {
        const partners = await fetchFromAPI("/api/v1/content/partners");
        update(d => ({ ...d, partners: Array.isArray(partners) ? partners : [] }));
      } finally {
        loadingStates.update(s => ({ ...s, partners: false }));
      }
    },

    async addPartner(partner) {
      const result = await postToAPI("/api/v1/content/partners", partner);
      update(d => ({
        ...d,
        partners: [...d.partners, result.data],
      }));
      return result;
    },

    async updatePartner(id, updates) {
      const result = await patchAPI(`/api/v1/content/partners/${id}`, updates);
      update(d => ({
        ...d,
        partners: d.partners.map(p => p.id === id ? { ...p, ...result.data } : p),
      }));
      return result;
    },

    async deletePartner(id) {
      await deleteFromAPI(`/api/v1/content/partners/${id}`);
      update(d => ({
        ...d,
        partners: d.partners.filter(p => p.id !== id),
      }));
    },

    // ============================================
    // SERVICES
    // ============================================
    async loadServices() {
      loadingStates.update(s => ({ ...s, services: true }));
      try {
        const services = await fetchFromAPI("/api/v1/content/services");
        update(d => ({ ...d, services: Array.isArray(services) ? services : [] }));
      } finally {
        loadingStates.update(s => ({ ...s, services: false }));
      }
    },

    async updateService(id, updates) {
      const result = await patchAPI(`/api/v1/content/services/${id}`, updates);
      update(d => ({
        ...d,
        services: d.services.map(s => s.id === id ? { ...s, ...result.data } : s),
      }));
      return result;
    },

    async toggleService(id) {
      const current = get(dataStore);
      const service = current.services.find(s => s.id === id);
      if (service) {
        return this.updateService(id, { active: !service.active });
      }
    },

    // ============================================
    // CONTENT
    // ============================================
    async loadContent() {
      loadingStates.update(s => ({ ...s, content: true }));
      try {
        const content = await fetchFromAPI("/api/v1/content");
        update(d => ({ ...d, content: content || {} }));
      } finally {
        loadingStates.update(s => ({ ...s, content: false }));
      }
    },

    async updateContent(section, value) {
      const result = await patchAPI(`/api/v1/content/${section}`, value);
      update(d => ({
        ...d,
        content: { ...d.content, [section]: result.data },
      }));
      return result;
    },

    // ============================================
    // TEAM
    // ============================================
    async loadTeam() {
      loadingStates.update(s => ({ ...s, team: true }));
      try {
        const team = await fetchFromAPI("/api/v1/content/team/members");
        update(d => ({ ...d, team: Array.isArray(team) ? team : [] }));
      } finally {
        loadingStates.update(s => ({ ...s, team: false }));
      }
    },

    async addTeamMember(member) {
      const result = await postToAPI("/api/v1/content/team/members", member);
      update(d => ({
        ...d,
        team: [...d.team, result.data],
      }));
      return result;
    },

    async updateTeamMember(id, updates) {
      const result = await patchAPI(`/api/v1/content/team/members/${id}`, updates);
      update(d => ({
        ...d,
        team: d.team.map(t => t.id === id ? { ...t, ...result.data } : t),
      }));
      return result;
    },

    async deleteTeamMember(id) {
      await deleteFromAPI(`/api/v1/content/team/members/${id}`);
      update(d => ({
        ...d,
        team: d.team.filter(t => t.id !== id),
      }));
    },

    // ============================================
    // REFRESH ALL DATA
    // ============================================
    async refresh() {
      await this.init();
    },
  };
}

export const data = createDataStore();

// ================================================================
// DERIVED STORES
// ================================================================

export const unreadContacts = derived(data, ($data) =>
  ($data.contacts || []).filter((c) => c.status === "unread")
);

export const activeServices = derived(data, ($data) =>
  ($data.services || []).filter((s) => s.active)
);

export const teamByGroup = derived(data, ($data) => {
  const groups = {};
  ($data.team || []).forEach((member) => {
    if (!groups[member.group]) groups[member.group] = [];
    groups[member.group].push(member);
  });
  return groups;
});

export const isLoading = derived(data, ($data) => $data.isLoading);
export const dataError = derived(data, ($data) => $data.error);

// Export loading states
export { loadingStates };
