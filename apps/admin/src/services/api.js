
const TOKEN_KEY = "shieldher_token";

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(path, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

const API = {
  // Backend health
  getHealth() {
    return request("/api/v1/health");
  },

  // Authentication
  async register(userData) {
    const data = await request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }

    return data;
  },

  async login(credentials) {
    const data = await request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }

    return data;
  },

  getMe() {
    return request("/api/v1/auth/me");
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Trusted contacts
  getContacts() {
    return request("/api/v1/contacts");
  },

  addContact(contactData) {
    return request("/api/v1/contacts", {
      method: "POST",
      body: JSON.stringify(contactData)
    });
  },

  updateContact(id, contactData) {
    return request(`/api/v1/contacts/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(contactData)
    });
  },

  deleteContact(id) {
    return request(`/api/v1/contacts/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  },

  // SOS incidents
  createIncident(incidentData) {
    return request("/api/v1/incidents", {
      method: "POST",
      body: JSON.stringify(incidentData)
    });
  },

  getIncidents() {
    return request("/api/v1/incidents");
  },

  getIncident(id) {
    return request(`/api/v1/incidents/${encodeURIComponent(id)}`);
  },

   resolveIncident(id) {
    return request(`/api/v1/incidents/${encodeURIComponent(id)}/resolve`, {
      method: "PATCH"
    });
  },

  // Emergency Notifications
  createEmergencyNotifications(incidentId) {
    return request("/api/v1/emergency-notifications", {
      method: "POST",
      body: JSON.stringify({ incidentId })
    });
  },

  getEmergencyNotifications() {
    return request("/api/v1/emergency-notifications");
  },

  // Safe Zones
  getSafeZones() {
    return request("/api/v1/safe-zones");
  },

  addSafeZone(zoneData) {
    return request("/api/v1/safe-zones", {
      method: "POST",
      body: JSON.stringify(zoneData)
    });
  },

  updateSafeZone(id, zoneData) {
    return request(`/api/v1/safe-zones/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(zoneData)
    });
  },

  deleteSafeZone(id) {
    return request(`/api/v1/safe-zones/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }  ,

  // Safe Zone Event History
  createSafeZoneEvent(eventData) {
    return request("/api/v1/safe-zone-events", {
      method: "POST",
      body: JSON.stringify(eventData)
    });
  },

  getSafeZoneEvents() {
    return request("/api/v1/safe-zone-events");
  }

};

export default API;
