/**
 * API Client for rocr-panel
 * Centralized API calls with error handling
 */

import { apiRequest, API_URL } from "./auth.js";

// ============= CONTACTS =============

export const contactsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/v1/contacts${query ? `?${query}` : ""}`);
    if (!response.ok) throw new Error("Failed to fetch contacts");
    return response.json();
  },

  async get(id) {
    const response = await apiRequest(`/api/v1/contacts/${id}`);
    if (!response.ok) throw new Error("Contact not found");
    return response.json();
  },

  async update(id, data) {
    const response = await apiRequest(`/api/v1/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update contact");
    return response.json();
  },

  async delete(id) {
    const response = await apiRequest(`/api/v1/contacts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete contact");
    return response.json();
  },

  async getStats() {
    const response = await apiRequest("/api/v1/contacts/stats/summary");
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },
};

// ============= PROJECTS =============

export const projectsApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/v1/projects${query ? `?${query}` : ""}`);
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  async get(id) {
    const response = await apiRequest(`/api/v1/projects/${id}`);
    if (!response.ok) throw new Error("Project not found");
    return response.json();
  },

  async create(data) {
    const response = await apiRequest("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  },

  async update(id, data) {
    const response = await apiRequest(`/api/v1/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update project");
    return response.json();
  },

  async delete(id) {
    const response = await apiRequest(`/api/v1/projects/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to archive project");
    return response.json();
  },

  async getStats() {
    const response = await apiRequest("/api/v1/projects/stats/summary");
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },
};

// ============= TASKS =============

export const tasksApi = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/v1/tasks${query ? `?${query}` : ""}`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  async getMyTasks() {
    const response = await apiRequest("/api/v1/tasks/my/assigned");
    if (!response.ok) throw new Error("Failed to fetch my tasks");
    return response.json();
  },

  async get(id) {
    const response = await apiRequest(`/api/v1/tasks/${id}`);
    if (!response.ok) throw new Error("Task not found");
    return response.json();
  },

  async create(data) {
    const response = await apiRequest("/api/v1/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  async update(id, data) {
    const response = await apiRequest(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  async delete(id) {
    const response = await apiRequest(`/api/v1/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return response.json();
  },
};

// ============= CALENDAR =============

export const calendarApi = {
  async listEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/v1/calendar/events${query ? `?${query}` : ""}`);
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  },

  async getMyEvents() {
    const response = await apiRequest("/api/v1/calendar/my");
    if (!response.ok) throw new Error("Failed to fetch my events");
    return response.json();
  },

  async getEvent(id) {
    const response = await apiRequest(`/api/v1/calendar/events/${id}`);
    if (!response.ok) throw new Error("Event not found");
    return response.json();
  },

  async createEvent(data) {
    const response = await apiRequest("/api/v1/calendar/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  },

  async updateEvent(id, data) {
    const response = await apiRequest(`/api/v1/calendar/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
  },

  async deleteEvent(id) {
    const response = await apiRequest(`/api/v1/calendar/events/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete event");
    return response.json();
  },

  async respondToEvent(id, status) {
    const response = await apiRequest(`/api/v1/calendar/events/${id}/respond`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to respond to event");
    return response.json();
  },
};

// ============= SCHEDULE =============

export const scheduleApi = {
  async getMySchedule() {
    const response = await apiRequest("/api/v1/schedule");
    if (!response.ok) throw new Error("Failed to fetch schedule");
    return response.json();
  },

  async setSchedule(schedules) {
    const response = await apiRequest("/api/v1/schedule", {
      method: "PUT",
      body: JSON.stringify({ schedules }),
    });
    if (!response.ok) throw new Error("Failed to set schedule");
    return response.json();
  },

  async getUserSchedule(userId) {
    const response = await apiRequest(`/api/v1/schedule/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user schedule");
    return response.json();
  },

  async getAvailability(date) {
    const response = await apiRequest(`/api/v1/schedule/availability?date=${date}`);
    if (!response.ok) throw new Error("Failed to fetch availability");
    return response.json();
  },

  async getMyOffDays() {
    const response = await apiRequest("/api/v1/schedule/off-days");
    if (!response.ok) throw new Error("Failed to fetch off days");
    return response.json();
  },

  async requestOffDay(data) {
    const response = await apiRequest("/api/v1/schedule/off-days", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to request off day");
    return response.json();
  },

  async approveOffDay(id, isApproved) {
    const response = await apiRequest(`/api/v1/schedule/off-days/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
    if (!response.ok) throw new Error("Failed to approve/reject off day");
    return response.json();
  },

  async getPendingOffDays() {
    const response = await apiRequest("/api/v1/schedule/off-days/pending");
    if (!response.ok) throw new Error("Failed to fetch pending off days");
    return response.json();
  },
};

// ============= TIME TRACKING =============

export const timeApi = {
  async clockIn() {
    const response = await apiRequest("/api/v1/time/clock-in", {
      method: "POST",
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to clock in");
    }
    return response.json();
  },

  async clockOut() {
    const response = await apiRequest("/api/v1/time/clock-out", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to clock out");
    return response.json();
  },

  async getStatus() {
    const response = await apiRequest("/api/v1/time/status");
    if (!response.ok) throw new Error("Failed to get clock status");
    return response.json();
  },

  async getToday() {
    const response = await apiRequest("/api/v1/time/today");
    if (!response.ok) throw new Error("Failed to get today's time");
    return response.json();
  },

  async listEntries(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/v1/time/entries${query ? `?${query}` : ""}`);
    if (!response.ok) throw new Error("Failed to fetch time entries");
    return response.json();
  },

  async createEntry(data) {
    const response = await apiRequest("/api/v1/time/entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create time entry");
    return response.json();
  },

  async updateEntry(id, data) {
    const response = await apiRequest(`/api/v1/time/entries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update time entry");
    return response.json();
  },

  async deleteEntry(id) {
    const response = await apiRequest(`/api/v1/time/entries/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete time entry");
    return response.json();
  },

  async getReports(params) {
    const query = new URLSearchParams(params).toString();
    const response = await apiRequest(`/api/v1/time/reports?${query}`);
    if (!response.ok) throw new Error("Failed to get reports");
    return response.json();
  },
};

// ============= CONTENT =============

export const contentApi = {
  async getPartners() {
    const response = await apiRequest("/api/v1/content/partners");
    if (!response.ok) throw new Error("Failed to fetch partners");
    return response.json();
  },

  async createPartner(data) {
    const response = await apiRequest("/api/v1/content/partners", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create partner");
    return response.json();
  },

  async updatePartner(id, data) {
    const response = await apiRequest(`/api/v1/content/partners/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update partner");
    return response.json();
  },

  async deletePartner(id) {
    const response = await apiRequest(`/api/v1/content/partners/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete partner");
    return response.json();
  },

  async getServices() {
    const response = await apiRequest("/api/v1/content/services");
    if (!response.ok) throw new Error("Failed to fetch services");
    return response.json();
  },

  async createService(data) {
    const response = await apiRequest("/api/v1/content/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create service");
    return response.json();
  },

  async updateService(id, data) {
    const response = await apiRequest(`/api/v1/content/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update service");
    return response.json();
  },

  async deleteService(id) {
    const response = await apiRequest(`/api/v1/content/services/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete service");
    return response.json();
  },

  async getTeam() {
    const response = await apiRequest("/api/v1/content/team/members");
    if (!response.ok) throw new Error("Failed to fetch team");
    return response.json();
  },

  async createTeamMember(data) {
    const response = await apiRequest("/api/v1/content/team/members", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create team member");
    return response.json();
  },

  async updateTeamMember(id, data) {
    const response = await apiRequest(`/api/v1/content/team/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update team member");
    return response.json();
  },

  async deleteTeamMember(id) {
    const response = await apiRequest(`/api/v1/content/team/members/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete team member");
    return response.json();
  },

  async getContent(section) {
    const response = await apiRequest(`/api/v1/content/${section}`);
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
  },

  async updateContent(section, data) {
    const response = await apiRequest(`/api/v1/content/${section}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update content");
    return response.json();
  },
};

// ============= USERS =============

export const usersApi = {
  async list() {
    const response = await apiRequest("/api/v1/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async get(id) {
    const response = await apiRequest(`/api/v1/users/${id}`);
    if (!response.ok) throw new Error("User not found");
    return response.json();
  },

  async create(data) {
    const response = await apiRequest("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  async update(id, data) {
    const response = await apiRequest(`/api/v1/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  async delete(id) {
    const response = await apiRequest(`/api/v1/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to deactivate user");
    return response.json();
  },

  async resetPassword(id, newPassword) {
    const response = await apiRequest(`/api/v1/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) throw new Error("Failed to reset password");
    return response.json();
  },
};
