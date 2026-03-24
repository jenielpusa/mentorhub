const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const initDefaultUser = require("./Controller/initDefaultUser");

// Import UserLoginSchema
const UserLogin = require("./Models/LogInSchema"); 

const OFFLINE_DELAY = 5000; 

app.set("trust proxy", true);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err);
  process.exit(1);
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
  pingInterval: 25000,
  pingTimeout: 60000,
});

// --- CRITICAL FIX: Gamitin ang "socketio" para makuha ng req.app.get("socketio") ---
app.set("socketio", io); 

global.connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 New Connection: ${socket.id}`);

  socket.on("register-user", async (userId, role, instructorLinkId) => {
    if (!userId || !role) return socket.emit("error", "Missing data");

    try {
      const user = await UserLogin.findById(userId).select("role");
      const normalizedRole = role.toLowerCase();
      const validRoles = ["admin", "student", "adviser", "panelist", "instructor"];

      if (!user || !validRoles.includes(normalizedRole)) {
        return socket.emit("error", "Invalid user or role");
      }

      socket.userId = userId;
      socket.role = normalizedRole;

      // --- JOIN ROOMS ---
      socket.join(normalizedRole);

      // ADMIN PRIVATE ROOM
      if (normalizedRole === "admin") {
        await socket.join("admin-private-room");
        console.log(`🔐 ADMIN [${userId}] joined private room`);
      }

      // INSTRUCTOR GROUP ROOM (Using linkId)
      const groupRoles = ["student", "adviser", "panelist", "instructor"];
      if (groupRoles.includes(normalizedRole)) {
        const groupRoomId = normalizedRole === "instructor" ? userId : instructorLinkId;
        if (groupRoomId) {
          const groupRoomName = `group-${groupRoomId}`;
          await socket.join(groupRoomName);
          console.log(`👥 Group Room Joined: ${groupRoomName}`);
        }
      }

      socket.emit("registration-success", { 
        rooms: Array.from(socket.rooms),
        role: normalizedRole 
      });

    } catch (err) {
      console.error("Socket Registration Error:", err);
    }
  });

  socket.on("disconnect", async () => {
    if (socket.userId) {
      setTimeout(async () => {
        try {
          // I-check muna kung hindi na-reconnect ang user bago i-set as offline
          await UserLogin.findByIdAndUpdate(socket.userId, { $set: { status: "offline" } });
          console.log(`💤 User ${socket.userId} is now OFFLINE`);
        } catch (err) { console.error(err); }
      }, OFFLINE_DELAY);
    }
  });
});

mongoose
  .connect(process.env.CONN_STR)
  .then(async () => {
    console.log("✅ Database connected successfully");
    await initDefaultUser();
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...");
  console.error(err);
  server.close(() => process.exit(1));
});