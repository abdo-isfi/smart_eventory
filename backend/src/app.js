const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config/config");

const { authLimiter, apiLimiter } = require("./middlewares/rateLimit");

const authRouter = require("./routes/auth.routes");
const productsRouter = require("./routes/products.routes");
const ordersRouter = require("./routes/orders.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
// Logger
if (config.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
// Rate limiting
if (config.env !== 'test') {
  app.use("/api", apiLimiter);
  app.use("/api/auth", authLimiter);
}

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
// Route de santé
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
