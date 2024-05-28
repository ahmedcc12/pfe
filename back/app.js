require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3500;

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const timeout = require("connect-timeout");

const { deleteJob } = require("./controllers/notificationController");

// Connect to MongoDB
connectDB();

const setNoCacheHeaders = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per windowMs
  message: "Too many requests, please try again later",
});
app.use(limiter);

app.use(setNoCacheHeaders);

// Set HTTP headers for security with Helmet
app.use(helmet());

// Sanitize user-supplied data against NoSQL Injection
app.use(mongoSanitize());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use(compression());

app.use(timeout("3m"));

/* app.use((req, res, next) => {
    setTimeout(next, 2000);
}); */

// routes
app.use("/api/auth", require("./routes/auth"));

app.use("/api/refresh", require("./routes/refresh"));

app.use("/api/logout", require("./routes/logout"));

app.use("/api/auth/forgotpassword", require("./routes/auth"));

app.use("/api/auth/resetpassword", require("./routes/auth"));

app.use(verifyJWT);
app.use("/api/register", require("./routes/register"));

app.use("/api/users", require("./routes/api/users"));

app.use("/api/bots", require("./routes/api/bot"));

app.use("/api/groups", require("./routes/api/group"));

app.use("/api/botinstances", require("./routes/api/botInstance"));

app.use("/api/notifications", require("./routes/api/notification"));

app.use("/api/adminmessage", require("./routes/api/adminMessage"));

app.use("/api/stats", require("./routes/api/stats"));

app.use("/api/userStats", require("./routes/api/userStats"));

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

global.io = io;

io.sockets.on("connection", (socket) => {
  //console.log("New client connected");
});
