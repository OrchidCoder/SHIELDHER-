
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------------");
    console.log("       SHIELDHER BACKEND SERVER");
    console.log("--------------------------------------");
    console.log(`Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/v1/health`);
    console.log("--------------------------------------");
  });

  const shutdown = (signal) => {
    console.log(`${signal} received. Closing server...`);

    server.close(() => {
      console.log("Server closed successfully.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer();
