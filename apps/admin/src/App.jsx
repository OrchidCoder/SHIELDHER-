
import React, { useState, useEffect, useRef } from "react";
import API from "./services/api";
import AuthScreen from "./components/AuthScreen";
import NotificationBell from "./components/NotificationBell";
import SettingsPage from "./components/SettingsPage";
import HelpSupportPage from "./components/HelpSupportPage";
import {
  Shield, LayoutDashboard, MapPin, Users, Clock3,
  Settings, Search, Menu, X, Heart,
  Navigation, ShieldCheck, Activity, ChevronRight,
  Plus, Phone, Siren, CircleCheck, AlertTriangle,
  LogOut, ArrowUpRight, Crosshair
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Live Location", icon: MapPin },
  { label: "Trusted Contacts", icon: Users },
  { label: "Safe Zones", icon: ShieldCheck },
  { label: "Incident History", icon: Clock3 },
];

function App() {
  const [backendStatus, setBackendStatus] = useState("checking");
const [backendInstance, setBackendInstance] = useState("");
const [user, setUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);
const [contactFormOpen, setContactFormOpen] = useState(false);
const [editingContactId, setEditingContactId] = useState(null);
const [contactSaving, setContactSaving] = useState(false);
const [contactActionError, setContactActionError] = useState("");

const [contactForm, setContactForm] = useState({
  name: "",
  phone: "",
  relationship: "Family",
  priority: 1
});
useEffect(() => {
  let mounted = true;

  const restoreSession = async () => {
    const token = localStorage.getItem("shieldher_token");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const response = await API.getMe();

      if (mounted) {
        setUser(response.user);
      }
    } catch (error) {
      API.logout();

      if (mounted) {
        setUser(null);
      }
    } finally {
      if (mounted) {
        setAuthLoading(false);
      }
    }
  };

  restoreSession();

  return () => {
    mounted = false;
  };
}, []);
useEffect(() => {
  let mounted = true;

  const checkBackend = async () => {
    try {
      const data = await API.getHealth();

      if (mounted) {
        setBackendStatus(data.status);
        setBackendInstance(data.instance);
      }
    } catch (error) {
      if (mounted) {
        setBackendStatus("offline");
      }
    }
  };

  checkBackend();

  const interval = setInterval(checkBackend, 15000);

  return () => {
    mounted = false;
    clearInterval(interval);
  };
}, []);
  const [active, setActive] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosSaving, setSosSaving] = useState(false);
const [sosError, setSosError] = useState("");
const [sosMessage, setSosMessage] = useState("");
const [userLocation, setUserLocation] = useState(null);
const [locationStatus, setLocationStatus] = useState("idle");
const [locationError, setLocationError] = useState("");
const sosAudioRef = useRef(null);
const [contacts, setContacts] = useState(null);
const [contactsError, setContactsError] = useState("");
const [incidents, setIncidents] = useState([]);
const [incidentsLoading, setIncidentsLoading] = useState(false);
const [incidentsError, setIncidentsError] = useState("");

const [safeZones, setSafeZones] = useState([]);
const [safeZonesLoading, setSafeZonesLoading] = useState(false);
const [safeZonesError, setSafeZonesError] = useState("");
const [safeZoneFormOpen, setSafeZoneFormOpen] = useState(false);
const [editingSafeZoneId, setEditingSafeZoneId] = useState(null);
const [safeZoneSaving, setSafeZoneSaving] = useState(false);

const [safeZoneForm, setSafeZoneForm] = useState({
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  radius: 200
});
// Real-Time Safe Zone Monitoring
const [zoneEvents, setZoneEvents] = useState([]);
const [zoneMonitoring, setZoneMonitoring] = useState(false);

const zoneStatusRef = useRef({});
const locationWatchRef = useRef(null);
useEffect(() => {
  if (!user) return;

  let mounted = true;

  const loadContacts = async () => {
    try {
      const response = await API.getContacts();

      if (mounted) {
        setContacts(response.contacts || []);
        setContactsError("");
      }
    } catch (error) {
      if (mounted) {
        setContactsError(error.message || "Unable to load contacts.");
        setContacts([]);
      }
    }
  };

  loadContacts();

  return () => {
    mounted = false;
  };
}, [user]);
const refreshContacts = async () => {
  try {
    const response = await API.getContacts();
    setContacts(response.contacts || []);
    setContactsError("");
  } catch (error) {
    setContactsError(error.message || "Unable to load contacts.");
  }
};

const handleContactSubmit = async (event) => {
  event.preventDefault();
  setContactSaving(true);
  setContactActionError("");

  try {
    const contactData = {
      ...contactForm,
      priority: Number(contactForm.priority)
    };

    if (editingContactId) {
      await API.updateContact(editingContactId, contactData);
    } else {
      await API.addContact(contactData);
    }

    await refreshContacts();

    setContactForm({
      name: "",
      phone: "",
      relationship: "Family",
      priority: 1
    });

    setEditingContactId(null);
    setContactFormOpen(false);
  } catch (error) {
    setContactActionError(error.message || "Unable to save contact.");
  } finally {
    setContactSaving(false);
  }
};

const handleEditContact = (contact) => {
  setEditingContactId(contact._id);

  setContactForm({
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship || "Other",
    priority: contact.priority || 1
  });

  setContactActionError("");
  setContactFormOpen(true);
};

const handleDeleteContact = async (contactId) => {
  if (!window.confirm("Are you sure you want to delete this trusted contact?")) {
    return;
  }

  try {
    await API.deleteContact(contactId);
    await refreshContacts();
  } catch (error) {
    setContactActionError(error.message || "Unable to delete contact.");
  }
};
const refreshIncidents = async () => {
  setIncidentsLoading(true);
  setIncidentsError("");

  try {
    const response = await API.getIncidents();
    setIncidents(response.incidents || []);
  } catch (error) {
    setIncidentsError(
      error.message || "Unable to load incident history."
    );
  } finally {
    setIncidentsLoading(false);
  }
};

const handleResolveIncident = async (incidentId) => {
  const confirmed = window.confirm(
    "Are you sure you want to mark this incident as resolved?"
  );

  if (!confirmed) return;

  try {
    await API.resolveIncident(incidentId);
    await refreshIncidents();
  } catch (error) {
    setIncidentsError(
      error.message || "Unable to resolve this incident."
    );
  }
};
useEffect(() => {
  if (active !== "Incident History" || !user) return;

  let mounted = true;

  const loadIncidents = async () => {
    setIncidentsLoading(true);
    setIncidentsError("");

    try {
      const response = await API.getIncidents();

      if (mounted) {
        setIncidents(response.incidents || []);
      }
    } catch (error) {
      if (mounted) {
        setIncidentsError(
          error.message || "Unable to load incident history."
        );
      }
    } finally {
      if (mounted) {
        setIncidentsLoading(false);
      }
    }
  };

  loadIncidents();

  return () => {
    mounted = false;
  };
}, [active, user]);

useEffect(() => {
  if (
  (active !== "Safe Zones" && active !== "Live Location") ||
  !user
) return;

  let mounted = true;

  const loadSafeZones = async () => {
    setSafeZonesLoading(true);
    setSafeZonesError("");

    try {
      const response = await API.getSafeZones();

      if (mounted) {
        setSafeZones(response.zones || []);
      }
    } catch (error) {
      if (mounted) {
        setSafeZonesError(
          error.message || "Unable to load Safe Zones."
        );
      }
    } finally {
      if (mounted) {
        setSafeZonesLoading(false);
      }
    }
  };

  loadSafeZones();

  return () => {
    mounted = false;
  };
}, [active, user]);

useEffect(() => {
  if (!zoneMonitoring || !user || active !== "Live Location") {
    return;
  }

  if (!navigator.geolocation) {
    setLocationStatus("error");
    setLocationError("Geolocation is not supported by this browser.");
    setZoneMonitoring(false);
    return;
  }




  setLocationStatus("loading");
  setLocationError("");

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setUserLocation({
        latitude,
        longitude,
        accuracy: position.coords.accuracy
      });

      setLocationStatus("success");

      
      
const accuracy = Number(position.coords.accuracy) || 30;

const nextStatuses = { ...zoneStatusRef.current };
const crossingEvents = [];

safeZones.forEach((zone) => {
  const distance = calculateDistance(
    latitude,
    longitude,
    Number(zone.latitude),
    Number(zone.longitude)
  );

  const radius = Number(zone.radius);

  // Dynamic GPS safety buffer based on location accuracy
  const buffer = Math.min(
    Math.max(accuracy * 0.75, 15),
    radius * 0.4
  );

  const innerBoundary = radius - buffer;
  const outerBoundary = radius + buffer;

  const previousStatus = zoneStatusRef.current[zone._id];

  let isInside;

  if (previousStatus === undefined) {
    // Establish initial status only when GPS is confidently inside or outside
    if (distance < innerBoundary) {
      isInside = true;
    } else if (distance > outerBoundary) {
      isInside = false;
    } else {
      return;
    }
  } else if (previousStatus === true) {
    // Already inside: exit only after crossing the outer boundary
    isInside = distance > outerBoundary ? false : true;
  } else {
    // Already outside: enter only after crossing the inner boundary
    isInside = distance < innerBoundary ? true : false;
  }

  if (
    previousStatus !== undefined &&
    previousStatus !== isInside
  ) {
    crossingEvents.push({
      safeZoneId: zone._id,
      eventType: isInside ? "entered" : "exited",
      latitude,
      longitude
    });
  }

  nextStatuses[zone._id] = isInside;
});


      // Update immediately to prevent duplicate GPS events
      zoneStatusRef.current = nextStatuses;

      // Save each boundary crossing to MongoDB
      crossingEvents.forEach(async (crossing) => {
        try {
          const response = await API.createSafeZoneEvent(crossing);
          const savedEvent = response.event;

          setZoneEvents((previous) =>
            [
              {
                id: savedEvent._id,
                zoneName: savedEvent.zoneName,
                type: savedEvent.eventType,
                time: new Date(savedEvent.eventAt).toLocaleString()
              },
              ...previous
            ].slice(0, 100)
          );

        } catch (error) {
          setLocationError(
            `Unable to save Safe Zone event: ${error.message}`
          );
        }
      });

    },
    (error) => {
      const messages = {
        1: "Location permission denied. Allow location access in your browser.",
        2: "Your current location could not be determined.",
        3: "Location request timed out. Please try again."
      };

      setLocationStatus("error");
      setLocationError(
        messages[error.code] || "GPS monitoring failed."
      );
      setZoneMonitoring(false);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 20000
    }
  );

  locationWatchRef.current = watchId;

  return () => {
    navigator.geolocation.clearWatch(watchId);
    locationWatchRef.current = null;
  };
}, [zoneMonitoring, user, active, safeZones]);
// Load permanent Safe Zone event history
useEffect(() => {
  if (!user || active !== "Live Location") return;

  let mounted = true;

  const loadZoneEvents = async () => {
    try {
      const response = await API.getSafeZoneEvents();

      if (mounted) {
        const events = (response.events || []).map((event) => ({
          id: event._id,
          zoneName: event.zoneName,
          type: event.eventType,
          time: new Date(event.eventAt).toLocaleString()
        }));

        setZoneEvents(events);
      }
    } catch (error) {
      if (mounted) {
        setLocationError(
          error.message || "Unable to load Safe Zone history."
        );
      }
    }
  };

  loadZoneEvents();

  return () => {
    mounted = false;
  };
}, [user, active]);



const requestLocation = () => {
  if (!navigator.geolocation) {
    setLocationStatus("error");
    setLocationError("Geolocation is not supported by this browser.");
    return;
  }

  setLocationStatus("loading");
  setLocationError("");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });

      setLocationStatus("success");
    },
    (error) => {
      setLocationStatus("error");

      const messages = {
        1: "Location permission denied. Allow location access in your browser.",
        2: "Your current location could not be determined.",
        3: "Location request timed out. Please try again."
      };

      setLocationError(
        messages[error.code] || "Unable to access your location."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
};
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371000;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};



const refreshSafeZones = async () => {
  setSafeZonesLoading(true);
  setSafeZonesError("");

  try {
    const response = await API.getSafeZones();
    setSafeZones(response.zones || []);
  } catch (error) {
    setSafeZonesError(error.message || "Unable to load Safe Zones.");
  } finally {
    setSafeZonesLoading(false);
  }
};



  
const handleSafeZoneSubmit = async (event) => {
  event.preventDefault();
  setSafeZonesError("");

  const { name, address, latitude, longitude, radius } = safeZoneForm;

  if (!name.trim() || latitude === "" || longitude === "") {
    setSafeZonesError("Name, latitude and longitude are required.");
    return;
  }

  const zoneData = {
    name: name.trim(),
    address: address.trim(),
    latitude: Number(latitude),
    longitude: Number(longitude),
    radius: Number(radius)
  };

  if (
    !Number.isFinite(zoneData.latitude) ||
    !Number.isFinite(zoneData.longitude) ||
    !Number.isFinite(zoneData.radius) ||
    zoneData.latitude < -90 ||
    zoneData.latitude > 90 ||
    zoneData.longitude < -180 ||
    zoneData.longitude > 180 ||
    zoneData.radius < 50 ||
    zoneData.radius > 10000
  ) {
    setSafeZonesError("Enter valid coordinates and a radius between 50 and 10000 metres.");
    return;
  }

  setSafeZoneSaving(true);

  try {
    if (editingSafeZoneId) {
      await API.updateSafeZone(editingSafeZoneId, zoneData);
    } else {
      await API.addSafeZone(zoneData);
    }

    setSafeZoneForm({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      radius: 200
    });

    setEditingSafeZoneId(null);
    setSafeZoneFormOpen(false);
    await refreshSafeZones();
  } catch (error) {
    setSafeZonesError(error.message || "Unable to save Safe Zone.");
  } finally {
    setSafeZoneSaving(false);
  }
};

const handleEditSafeZone = (zone) => {
  setEditingSafeZoneId(zone._id);
  setSafeZoneForm({
    name: zone.name || "",
    address: zone.address || "",
    latitude: String(zone.latitude),
    longitude: String(zone.longitude),
    radius: zone.radius || 200
  });
  setSafeZoneFormOpen(true);
};

const handleDeleteSafeZone = async (zoneId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this Safe Zone?"
  );

  if (!confirmed) return;

  try {
    await API.deleteSafeZone(zoneId);
    await refreshSafeZones();
  } catch (error) {
    setSafeZonesError(error.message || "Unable to delete Safe Zone.");
  }
};

const handleUseCurrentLocation = () => {
  if (!userLocation) {
    setSafeZonesError("Please enable GPS on the Live Location page first.");
    return;
  }

  setSafeZoneForm((previous) => ({
    ...previous,
    latitude: String(userLocation.latitude),
    longitude: String(userLocation.longitude)
  }));

  setSafeZonesError("");
};

const startSosAlarm = async () => {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("Your browser does not support the SOS alarm.");
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.value = 650;
    gain.gain.value = 0.07;

    lfo.type = "sine";
    lfo.frequency.value = 1.5;
    lfoGain.gain.value = 220;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    oscillator.connect(gain);
    gain.connect(context.destination);

    sosAudioRef.current = {
      context,
      oscillator,
      lfo
    };

    oscillator.start();
    lfo.start();

    await context.resume();
  } catch (error) {
    setSosError(
      error.message || "Unable to start the SOS alarm."
    );
  }
};

const stopSosAlarm = () => {
  const audio = sosAudioRef.current;

  if (!audio) return;

  sosAudioRef.current = null;

  try {
    audio.oscillator.stop();
    audio.lfo.stop();
    audio.context.close();
  } catch (error) {
    // Audio may already have stopped.
  }
};

const handleSosClick = async () => {
  if (sosActive) {
    stopSosAlarm();
    setSosActive(false);
    setSosMessage("Alarm stopped. Saved incident remains in history.");
    return;
  }

  setSosActive(true);
  setSosSaving(true);
  setSosError("");
  setSosMessage("SOS demo activated. Saving incident...");

  startSosAlarm();

  try {
    const incidentData = {
      incidentType: "SOS",
      description: "SOS demo activated from SHIELDHER dashboard.",
      ...(userLocation
        ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          }
        : {})
    };

    const incidentResponse = await API.createIncident(incidentData);

    const incidentId = incidentResponse?.incident?._id;

    if (!incidentId) {
      throw new Error("Incident saved, but its ID was not returned.");
    }

    setSosMessage("Incident saved. Creating trusted contact demo alerts...");

    const notificationResponse =
      await API.createEmergencyNotifications(incidentId);

    const notificationCount = notificationResponse?.count ?? 0;

    if (notificationCount > 0) {
      setSosMessage(
        `SOS recorded. ${notificationCount} simulated alert(s) created for trusted contacts. No SMS or WhatsApp was sent.`
      );
    } else {
      setSosMessage(
        "SOS recorded, but no trusted contacts are available. No messages were sent."
      );
    }
  } catch (error) {
    setSosError(error.message || "Unable to complete SOS demo.");
    setSosMessage(
      "Alarm is active. Check incident and notification records for completion status."
    );
  } finally {
    setSosSaving(false);
  }
};

const handleSignOut = () => {
  API.logout();
  stopSosAlarm();
  setUser(null);
  setActive("Dashboard");
  setSosActive(false);
  setMobileMenu(false);
};

    
const stats = [
  { label: "Safety Score", value: "98", suffix: "/100", icon: ShieldCheck, color: "#a78bfa" },
  { label: "Trusted Contacts", value: "04", suffix: " people", icon: Users, color: "#f472b6" },
  { label: "Safe Zones", value: "03", suffix: " active", icon: MapPin, color: "#38bdf8" },
  { label: "Safety Status", value: "Safe", suffix: "", icon: Heart, color: "#34d399" },
];

  if (authLoading) {
  return (
    <div className="auth-screen">
      <div className="auth-form-panel">
        Checking your secure session...
      </div>
    </div>
  );
}

if (!user) {
  return <AuthScreen onLogin={setUser} />;
}

return (
    <div className="app-shell">
      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Shield size={23} /></div>
          <div>
            <h2>SHIELDHER</h2>
            <span>SAFETY ECOSYSTEM</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X /></button>
        </div>

        <div className="profile-card">
          <div className="avatar">K</div>
          <div className="profile-info">
            <strong>Welcome, {user.name}!</strong>
            <span>Your safety matters</span>
          </div>
          <span className="online-dot" />
        </div>

        <span className="nav-label">MAIN MENU</span>
        <nav className="navigation">
          {menuItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "nav-active" : ""}`}
              onClick={() => {
                setActive(label);
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {active === label && <span className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><Heart size={18} /></div>
            <strong>We're here for you</strong>
            <p>Your safety is always our priority.</p>
            <button onClick={() => {
              setActive("Help & Support");
              setMobileMenu(false);
            }}>Get Support <ArrowUpRight size={14} /></button>
          </div>
          <button
            className="nav-item settings-item"
            onClick={() => {
              setActive("Settings");
              setMobileMenu(false);
            }}
          >
  <Settings size={19} /><span>Settings</span>
</button>

<button
  className="nav-item settings-item"
  onClick={handleSignOut}
>
  <LogOut size={19} />
  <span>Sign Out</span>
</button>

<div className="sidebar-footer">SHIELDHER © 2026</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setMobileMenu(true)}><Menu /></button>
            <div>
              <span className="breadcrumb">WORKSPACE / {active.toUpperCase()}</span>
              <h1>{active}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className={`system-status ${backendStatus}`}>
  <span />
  {backendStatus === "healthy"
    ? "Backend connected"
    : backendStatus === "checking"
    ? "Checking backend..."
    : "Backend offline"}
</div>
            <button className="icon-button"><Search size={19} /></button>
            <NotificationBell />
            <div className="top-avatar">K</div>
          </div>
        </header>

        <div className="dashboard-content">
  {active === "Dashboard" ? (
    <>
      <section className="welcome-section">  
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL SAFETY SPACE</span>
              <h2>Your safety,<br /><span>your strength.</span></h2>
              <p>Stay aware. Stay connected. Feel empowered wherever life takes you.</p>
            </div>
            <div className="welcome-art">
              <div className="art-glow" />
              <div className="art-ring ring-one" />
              <div className="art-ring ring-two" />
              <div className="art-shield"><Shield size={76} strokeWidth={1.2} /><Heart size={27} className="art-heart" /></div>
              <span className="art-spark spark-one">✦</span>
              <span className="art-spark spark-two">✧</span>
            </div>
          </section>

          <section className="safety-banner">
            <div className="safe-icon"><ShieldCheck size={25} /></div>
            <div className="safe-copy">
              <strong>You're in your safe space</strong>
              <span>Your safety dashboard is active and ready.</span>
            </div>
            <div className="safe-pill"><span /> PROTECTED</div>
          </section>

          <section className="stats-grid">
            {stats.map(({ label, value, suffix, icon: Icon, color }) => (
              <div className="stat-card" key={label}>
                <div className="stat-top">
                  <span>{label}</span>
                  <div className="stat-icon" style={{ color }}><Icon size={19} /></div>
                </div>
                <div className="stat-value">{value}<small>{suffix}</small></div>
                <div className="stat-foot"><span className="tiny-check"><CircleCheck size={12} /></span> Your safety overview</div>
              </div>
            ))}
          </section>

          <div className="content-grid">
            <section className="panel sos-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">EMERGENCY ASSISTANCE</span>
                  <h3>Need help? We're here.</h3>
                </div>
                <span className="live-tag"><span /> READY</span>
              </div>
              <p className="panel-description">Press the SOS button in an emergency to start a demo alert flow.</p>

              <div className="sos-center">
                <div className="sos-halo">
                  <button
                    className={`sos-button ${sosActive ? "sos-triggered" : ""}`}
                    onClick={handleSosClick}
                  >
                    <Siren size={34} />
                    <strong>{sosActive ? "CANCEL" : "SOS"}</strong>
                    <span>{sosActive ? "DEMO ACTIVE" : "GET HELP"}</span>
                  </button>
                </div>
              </div>

              {sosActive ? (
  <div className="sos-message">
    <AlertTriangle size={16} />
    {sosMessage || "SOS demo is active."}
  </div>
) : (
  <div className="sos-hint">
    <Shield size={14} />
    Emergency demo control · No real alert sent
  </div>
)}

{sosSaving && (
  <p className="empty-message">Saving SOS incident...</p>
)}

{sosError && (
  <p className="empty-message">{sosError}</p>
)}
            </section>

            <section className="panel location-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">LOCATION SERVICES</span>
                  <h3>Location overview</h3>
                </div>
                <button className="more-button" onClick={() => setActive("Live Location")}><ArrowUpRight size={18} /></button>
              </div>

              <div className="map-preview">
                <div className="map-grid" />
                <div className="map-road road-a" />
                <div className="map-road road-b" />
                <div className="map-road road-c" />
                <div className="map-park"><span>GREEN PARK</span></div>
                <div className="map-marker"><div><Navigation size={17} fill="currentColor" /></div><span>DEMO LOCATION</span></div>
                <div className="map-zoom"><Crosshair size={17} /></div>
                <span className="map-caption">LOCATION PREVIEW</span>
              </div>

              <div className="location-footer">
                <div className="location-info"><MapPin size={17} /><div><strong>Location preview</strong><span>Connect GPS to share your location</span></div></div>
                <button className="text-link" onClick={() => setActive("Live Location")}>Explore <ChevronRight size={15} /></button>
              </div>
            </section>
          </div>

          <div className="bottom-grid">
            <section className="panel contacts-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">YOUR SUPPORT NETWORK</span><h3>Trusted contacts</h3></div>
                <button className="add-button" onClick={() => setActive("Trusted Contacts")}><Plus size={16} /> Manage</button>
              </div>
              
{contacts === null ? (
  <p className="empty-message">Loading trusted contacts...</p>
) : contactsError ? (
  <p className="empty-message">{contactsError}</p>
) : contacts.length === 0 ? (
  <p className="empty-message">
    No trusted contacts added yet. Add your first contact.
  </p>
) : (
  contacts.slice(0, 4).map((contact, index) => (
    <div className="contact-row" key={contact._id}>
      <div className={`contact-avatar ${index % 2 === 0 ? "pink" : "purple"}`}>
        {contact.name.charAt(0).toUpperCase()}
      </div>

      <div className="contact-details">
        <strong>{contact.name}</strong>
        <span>{contact.relationship || "Trusted contact"} · {contact.phone}</span>
      </div>

      <span className="contact-status">
        {contact.priority === 1 ? "PRIMARY" : "ACTIVE"}
      </span>

      <a
        className="call-button"
        href={`tel:${contact.phone}`}
        aria-label={`Call ${contact.name}`}
      >
        <Phone size={16} />
      </a>
    </div>
  ))
)}
            </section>

            <section className="panel activity-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">RECENT UPDATES</span><h3>Safety activity</h3></div>
                <button className="more-button" onClick={() => setActive("Incident History")}><ArrowUpRight size={18} /></button>
              </div>
              <div className="activity-row">
                <div className="activity-icon"><ShieldCheck size={17} /></div>
                <div><strong>Dashboard initialized</strong><span>Your safety workspace is ready</span></div>
                <small>Just now</small>
              </div>
              <div className="activity-row">
                <div className="activity-icon activity-purple"><Activity size={17} /></div>
                <div><strong>System status checked</strong><span>Frontend demo is running</span></div>
                <small>Today</small>
              </div>
            </section>
          </div>

          <footer className="main-footer">
            <span><Heart size={13} /> Your safety. Your strength. Our priority.</span>
            <span>SHIELDHER · SMART SAFETY PLATFORM</span>
                    </footer>
    </>
  ) : (
  <section className="panel workspace-panel">
    <span className="section-kicker">SHIELDHER WORKSPACE</span>
    <h2>{active}</h2>

    {active === "Trusted Contacts" && (
  <div className="contact-management">

    <div className="panel-heading">
      <div>
        <span className="section-kicker">YOUR SUPPORT NETWORK</span>
        <h3>Trusted Contacts</h3>
        <p>People who matter most to your safety.</p>
      </div>

      <button
        className="add-button"
        onClick={() => {
          setEditingContactId(null);
          setContactForm({
            name: "",
            phone: "",
            relationship: "Family",
            priority: 1
          });
          setContactActionError("");
          setContactFormOpen(!contactFormOpen);
        }}
      >
        <Plus size={16} /> Add Contact
      </button>
    </div>

    {contactFormOpen && (
      <form className="panel" onSubmit={handleContactSubmit}>
        <h3>{editingContactId ? "Edit Contact" : "Add New Contact"}</h3>

        <label>Full Name</label>
        <input
          required
          minLength={2}
          maxLength={60}
          value={contactForm.name}
          onChange={(e) =>
            setContactForm({ ...contactForm, name: e.target.value })
          }
          placeholder="Enter contact name"
        />

        <label>Phone Number</label>
        <input
          required
          minLength={7}
          maxLength={20}
          value={contactForm.phone}
          onChange={(e) =>
            setContactForm({ ...contactForm, phone: e.target.value })
          }
          placeholder="Enter phone number"
        />

        <label>Relationship</label>
        <select
          value={contactForm.relationship}
          onChange={(e) =>
            setContactForm({ ...contactForm, relationship: e.target.value })
          }
        >
          <option>Family</option>
          <option>Friend</option>
          <option>Parent</option>
          <option>Sibling</option>
          <option>Partner</option>
          <option>Other</option>
        </select>

        <label>Priority</label>
        <select
          value={contactForm.priority}
          onChange={(e) =>
            setContactForm({ ...contactForm, priority: e.target.value })
          }
        >
          <option value="1">Primary Contact</option>
          <option value="2">Secondary Contact</option>
          <option value="3">Other Contact</option>
        </select>

        {contactActionError && (
          <p className="auth-error">{contactActionError}</p>
        )}

        <button className="primary-button" type="submit" disabled={contactSaving}>
          {contactSaving ? "Saving..." : editingContactId ? "Update Contact" : "Save Contact"}
        </button>

        <button
          type="button"
          className="text-link"
          onClick={() => {
            setContactFormOpen(false);
            setEditingContactId(null);
          }}
        >
          Cancel
        </button>
      </form>
    )}

    {contactActionError && !contactFormOpen && (
      <p className="auth-error">{contactActionError}</p>
    )}

    {contacts === null ? (
      <p className="empty-message">Loading contacts...</p>
    ) : contactsError ? (
      <p className="empty-message">{contactsError}</p>
    ) : contacts.length === 0 ? (
      <div className="panel">
        <Users size={35} />
        <h3>No trusted contacts yet</h3>
        <p>Add someone you trust to your safety network.</p>
      </div>
    ) : (
      <div className="contact-management-grid">
        {contacts.map((contact, index) => (
          <div className="panel" key={contact._id}>
            <div className="contact-row">
              <div className={`contact-avatar ${index % 2 === 0 ? "pink" : "purple"}`}>
                {contact.name.charAt(0).toUpperCase()}
              </div>

              <div className="contact-details">
                <strong>{contact.name}</strong>
                <span>{contact.relationship || "Other"}</span>
              </div>
            </div>

            <p><Phone size={15} /> {contact.phone}</p>
            <p>Priority: {contact.priority}</p>

            <div className="contact-management-actions">
              <button
                className="text-link"
                onClick={() => handleEditContact(contact)}
              >
                Edit
              </button>

              <button
                className="text-link"
                onClick={() => handleDeleteContact(contact._id)}
              >
                Delete
              </button>

              <a className="text-link" href={`tel:${contact.phone}`}>
                Call
              </a>
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
)}

    {active === "Live Location" && (
  <div className="location-details">
    <div className="panel-heading">
      <div>
        <span className="section-kicker">GPS SERVICES</span>
        <h3>Your Current Location</h3>
      </div>
      <span className={`live-tag ${locationStatus === "success" ? "" : ""}`}>
        <span />
        {locationStatus === "success"
          ? "LOCATION FOUND"
          : locationStatus === "loading"
          ? "LOCATING"
          : "NOT CONNECTED"}
      </span>
    </div>

    <p className="panel-description">
      Allow browser location permission to get your current GPS coordinates.
    </p>

    <button
      className="add-button"
      onClick={requestLocation}
      disabled={locationStatus === "loading"}
    >
      <Crosshair size={17} />
      {locationStatus === "loading" ? "Getting location..." : "Enable GPS"}
    </button>

    <button
      className="add-button"
      onClick={() => {
        if (!zoneMonitoring && safeZones.length === 0) {
          setLocationError("Please add at least one Safe Zone before starting monitoring.");
          return;
        }

        if (zoneMonitoring) {
          setZoneMonitoring(false);
          zoneStatusRef.current = {};
        } else {
        
          zoneStatusRef.current = {};
          setZoneMonitoring(true);
        }
      }}
    >
      <ShieldCheck size={17} />
      {zoneMonitoring ? "Stop Safe Zone Monitoring" : "Start Safe Zone Monitoring"}
    </button>

    <p className="panel-description">
      Monitoring status: {zoneMonitoring ? "Active" : "Stopped"}
      {" · "}
      Saved Safe Zones: {safeZones.length}
    </p>


    {locationError && (
      <p className="empty-message">{locationError}</p>
    )}

<div className="contact-form">
  <h3>Safe Zone Activity History</h3>

  {zoneEvents.length === 0 ? (
    <p className="empty-message">
      No Safe Zone entry or exit events recorded yet.
    </p>
  ) : (
    zoneEvents.map((event) => (
      <div className="contact-row" key={event.id}>
        <div className="contact-avatar">
          {event.type === "entered" ? "✓" : "!"}
        </div>

        <div>
          <strong>
            {event.type === "entered"
              ? `Entered ${event.zoneName}`
              : `Left ${event.zoneName}`}
          </strong>

          <p>{event.time}</p>
        </div>
      </div>
    ))
  )}
</div>


    {userLocation && (
      <div className="contact-form">
        <div className="form-group">
          <label>Latitude</label>
          <p>{userLocation.latitude.toFixed(6)}</p>
        </div>

        <div className="form-group">
          <label>Longitude</label>
          <p>{userLocation.longitude.toFixed(6)}</p>
        </div>

        <div className="form-group">
          <label>Location Accuracy</label>
          <p>Approximately {Math.round(userLocation.accuracy)} metres</p>
        </div>

        <a
          className="text-link"
          href={`https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          Open location in Google Maps
        </a>
      </div>
    )}
  </div>
)}

    
{active === "Safe Zones" && (
  <div className="incident-history">
    <div className="panel-heading">
      <div>
        <span className="section-kicker">LOCATION SECURITY</span>
        <h3>Safe Zones</h3>
        <p className="panel-description">
          Save and manage places where you feel safe.
        </p>
      </div>

      <button
        className="add-button"
        onClick={() => {
          setEditingSafeZoneId(null);
          setSafeZoneForm({
            name: "",
            address: "",
            latitude: "",
            longitude: "",
            radius: 200
          });
          setSafeZoneFormOpen(!safeZoneFormOpen);
          setSafeZonesError("");
        }}
      >
        <Plus size={17} />
        Add Safe Zone
      </button>
    </div>

    {safeZonesError && (
      <p className="empty-message">{safeZonesError}</p>
    )}

    {safeZoneFormOpen && (
      <form
        className="contact-form"
        onSubmit={handleSafeZoneSubmit}
      >
        <h3>
          {editingSafeZoneId ? "Edit Safe Zone" : "Add New Safe Zone"}
        </h3>

        <div className="form-group">
          <label>Place Name *</label>
          <input
            type="text"
            placeholder="e.g. Home, College, Office"
            value={safeZoneForm.name}
            onChange={(e) =>
              setSafeZoneForm({
                ...safeZoneForm,
                name: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Enter place address"
            value={safeZoneForm.address}
            onChange={(e) =>
              setSafeZoneForm({
                ...safeZoneForm,
                address: e.target.value
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Latitude *</label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 26.8467"
            value={safeZoneForm.latitude}
            onChange={(e) =>
              setSafeZoneForm({
                ...safeZoneForm,
                latitude: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Longitude *</label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 80.9462"
            value={safeZoneForm.longitude}
            onChange={(e) =>
              setSafeZoneForm({
                ...safeZoneForm,
                longitude: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Safe Zone Radius (metres)</label>
          <input
            type="number"
            min="50"
            max="10000"
            value={safeZoneForm.radius}
            onChange={(e) =>
              setSafeZoneForm({
                ...safeZoneForm,
                radius: e.target.value
              })
            }
            required
          />
        </div>

        <button
          type="button"
          className="text-link"
          onClick={handleUseCurrentLocation}
        >
          <Crosshair size={16} />
          Use Current GPS Location
        </button>

        <div className="contact-actions">
          <button
            type="submit"
            className="add-button"
            disabled={safeZoneSaving}
          >
            {safeZoneSaving
              ? "Saving..."
              : editingSafeZoneId
                ? "Update Safe Zone"
                : "Save Safe Zone"}
          </button>

          <button
            type="button"
            className="text-link"
            onClick={() => {
              setSafeZoneFormOpen(false);
              setEditingSafeZoneId(null);
              setSafeZonesError("");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    <div className="panel-heading">
      <div>
        <h3>Saved Safe Places</h3>
        <p className="panel-description">
          {safeZones.length} saved location(s)
        </p>
      </div>

      <button
        className="add-button"
        onClick={refreshSafeZones}
        disabled={safeZonesLoading}
      >
        {safeZonesLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>

    {safeZonesLoading && safeZones.length === 0 && (
      <p className="empty-message">Loading Safe Zones...</p>
    )}

    {!safeZonesLoading && safeZones.length === 0 && (
      <div className="empty-state">
        <ShieldCheck size={32} />
        <h3>No Safe Zones saved</h3>
        <p>Add your home, college, workplace or another trusted location.</p>
      </div>
    )}

    <div className="incident-list">
      {safeZones.map((zone) => (
        <div className="contact-card" key={zone._id}>
          <div className="contact-main">
            <div className="contact-avatar pink">
              <MapPin size={20} />
            </div>

            <div>
              <strong>{zone.name}</strong>
              <p>{zone.address || "No address provided"}</p>
              <span>
                Radius: {zone.radius} metres
              </span>
              <p>
                Coordinates: {zone.latitude}, {zone.longitude}
              </p>
            </div>
          </div>

          <div className="incident-meta">
            <a
              className="text-link"
              href={`https://www.google.com/maps?q=${zone.latitude},${zone.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={14} />
              View Map
            </a>

            <button
              className="text-link"
              onClick={() => handleEditSafeZone(zone)}
            >
              Edit
            </button>

            <button
              className="text-link"
              onClick={() => handleDeleteSafeZone(zone._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>

    <p className="panel-description">
      Note: Safe Zones are currently saved locations only.
      Automatic geofence monitoring and entry/exit alerts are not enabled yet.
    </p>
  </div>
)}

    {active === "Incident History" && (
  <div className="incident-history">
    <div className="panel-heading">
      <div>
        <span className="section-kicker">SAFETY RECORDS</span>
        <h3>Incident History</h3>
        <p className="panel-description">
          Your recorded SOS and safety incidents.
        </p>
      </div>

      <button
        className="add-button"
        onClick={refreshIncidents}
        disabled={incidentsLoading}
      >
        <Clock3 size={16} />
        {incidentsLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>

    {incidentsError && (
      <p className="empty-message">{incidentsError}</p>
    )}

    {incidentsLoading && incidents.length === 0 && (
      <p className="empty-message">Loading incident records...</p>
    )}

    {!incidentsLoading && incidents.length === 0 && !incidentsError && (
      <div className="empty-state">
        <ShieldCheck size={32} />
        <h3>No incidents recorded</h3>
        <p>Your recorded SOS and safety incidents will appear here.</p>
      </div>
    )}

    <div className="incident-list">
      {incidents.map((incident) => (
        <div className="contact-card" key={incident._id}>
          <div className="contact-main">
            <div className="contact-avatar pink">
              <Siren size={20} />
            </div>

            <div>
              <strong>{incident.incidentType || "Safety Incident"}</strong>
              <p>
                {incident.description || "No additional description"}
              </p>
              <span>
                {incident.createdAt
                  ? new Date(incident.createdAt).toLocaleString()
                  : "Date unavailable"}
              </span>
            </div>
          </div>

          <div className="incident-meta">
            <span className={`status-pill ${incident.status === "Resolved" ? "resolved" : "active"}`}>
              {incident.status || "Active"}
            </span>

            {incident.location?.latitude != null &&
              incident.location?.longitude != null && (
                <a
                  className="text-link"
                  href={`https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={14} />
                  View location
                </a>
              )}

            {incident.status === "Active" && (
              <button
                className="text-link"
                onClick={() => handleResolveIncident(incident._id)}
              >
                <CircleCheck size={15} />
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    {active === "Settings" && (
      <SettingsPage user={user} onSignOut={handleSignOut} />
    )}

    {active === "Help & Support" && (
      <HelpSupportPage />
    )}
  </section>
)}
        </div>
      </main>
    </div>
  );
}

export default App;
