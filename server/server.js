
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const deviceRoutes = require("./routes/deviceRoutes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/devices", deviceRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NexusFlow Backend Running!",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
    project: "NexusFlow",
    timestamp: new Date(),
  });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server after MongoDB connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`NexusFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
