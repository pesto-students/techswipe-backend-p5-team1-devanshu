require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
//
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { onMessage } = require("./controller/messages");
const { verifyJWT } = require("./middleware/is-auth");
const conversations = require("./models/conversations");
const { seedConversations } = require("./utilits/seed");
// const { seedDb } = require("./utilits/seed");

require("./strategies/github");
require("./strategies/linkedin");

const app = express();
const PORT = process.env.PORT || 3030;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use((error, req, res) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URL, () => console.log("Connected to DB!"));

// seedDb();
seedConversations();

// sockets code
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// io.use((socket, next) => {
//   socket.on("disconnect", () => {
//     console.log("disconnected");
//   });
// });

io.on("connection", async (socket) => {
  if (!socket.handshake.auth.token) {
    socket.disconnect(true);
    return;
  }
  const token = socket.handshake.auth.token;
  const decodedToken = verifyJWT(token);
  const userId = decodedToken?.userId;

  const allConversationsForUserIds = await conversations.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  });

  console.log({ allConversationsForUserIds });

  allConversationsForUserIds.forEach((item) => {
    socket.join(`${item.conversationId}`);
  });

  socket.on("join", async () => {});
  socket.on("message", (data) => onMessage(data, socket, userId, io));

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
