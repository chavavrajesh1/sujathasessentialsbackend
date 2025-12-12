const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tourRoutes = require("./routes/tourRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const testRoutes = require("./routes/testRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

/* -----------------------------
   MIDDLEWARE
----------------------------- */
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://sujathasessentialsfrontend.vercel.app",
        "http://localhost:3000"
      ];

      // Allow Vercel preview deployments (*.vercel.app)
      const vercelPattern = /\.vercel\.app$/;

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED BY CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization"
  })
);



app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ⭐ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 120,
    message: "Too many requests, please try again later.",
  })
);

/* -----------------------------
   ROUTES
----------------------------- */
app.use("/api/auth", authRoutes);          // login, register
app.use("/api/auth", passwordRoutes);      // forgot password, reset password

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);

/* -----------------------------
   HEALTH CHECK
----------------------------- */
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date() })
);

/* -----------------------------
   ERROR HANDLING
----------------------------- */
app.use(notFound);
app.use(errorHandler);

module.exports = app;
