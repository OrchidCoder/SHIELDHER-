
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const app = express();
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const safeZoneRoutes = require("./routes/safeZoneRoutes");
const safeZoneEventRoutes = require("./routes/safeZoneEventRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Security
app.use(helmet());

// CORS
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
).split(",").map(origin => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Request parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Rate limiting
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/incidents", incidentRoutes);
app.use("/api/v1/safe-zones", safeZoneRoutes);
app.use("/api/v1/safe-zone-events", safeZoneEventRoutes);
app.use("/api/v1/emergency-notifications", notificationRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "SHIELDHER",
    message: "SHIELDHER API is running!"
  });
});

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    project: "SHIELDHER",
    service: "backend-api",
    instance: process.env.INSTANCE_ID || process.env.HOSTNAME || "local-development",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("API Error:", err.message);

  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Something went wrong."
      : err.message
  });
});

module.exports = app;
