const API_BASE = '/api';

export const api = {
  // Stats
  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  createProject: async (data) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateProject: async (id, data) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Project Modules
  getProjectModules: async (projectId) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/modules`);
    return res.json();
  },
  createProjectModule: async (projectId, data) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateProjectModule: async (id, data) => {
    const res = await fetch(`${API_BASE}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteProjectModule: async (id) => {
    const res = await fetch(`${API_BASE}/modules/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Tasks
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
    return res.json();
  },
  createTask: async (data) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateTask: async (id, data) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Activity Logs
  getActivities: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/activities?${params.toString()}`);
    return res.json();
  },
  createActivity: async (data) => {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateActivity: async (id, data) => {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteActivity: async (id) => {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Calendar
  getCalendarData: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const res = await fetch(`${API_BASE}/calendar?${params.toString()}`);
    return res.json();
  },

  // Quick Notes
  getNotes: async () => {
    const res = await fetch(`${API_BASE}/notes`);
    return res.json();
  },
  createNote: async (data) => {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateNote: async (id, data) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteNote: async (id) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
