const express3   = require("express");
const cors       = require("cors");
const cookieparser = require("cookie-parser");
const authRoutes   = require("./routes/auth.routes");
const chatRoutes   = require("./routes/chat.routes");

const app = express3();

// Security headers


app.use(cors({
  origin: [
    "https://travelagent-ten.vercel.app",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieparser());
app.use(express3.json({ limit: "2mb" }));
app.use(express3.urlencoded({ extended: true }));

// Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("[global error]", err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

module.exports = app;
