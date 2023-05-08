if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const Sentry = require("@sentry/node");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { onMessage } = require("./controller/messages");
const { verifyJWT } = require("./middleware/is-auth");
const conversations = require("./models/conversations");

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://2ec40b902f464ba59c3cbb38c8e37718@o4504848420110336.ingest.sentry.io/4504852544684032",

    tracesSampleRate: 1.0,
  });
}

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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json("server is running");
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  console.log(status);
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URL, () => console.log("Connected to DB!"));

// sockets code
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  if (!socket.handshake.auth.token) {
    socket.disconnect(true);
    return;
  }
  const token = socket.handshake.auth.token;
  const decodedToken = verifyJWT(token);
  const userId = decodedToken?.userId;

  const allConversationsForUserIds = await conversations.find({
    $or: [{ "fromUser.fromUserId": userId }, { "toUser.toUserId": userId }],
  });

  allConversationsForUserIds.forEach((item) => {
    const conversationId = item["_id"].toString();
    socket.join(`${conversationId}`);
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
