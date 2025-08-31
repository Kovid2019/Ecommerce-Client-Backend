//
import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import dbConnect from "./src/config/dbconfig.js";
import { responseClient } from "./src/middleware/responseClient.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

import authRoute from "./src/routes/authRoute.js";
import imageRouter from "./src/routes/imageRoute.js";
import productRouter from "./src/routes/productRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import webhookRouter from "./src/routes/stripeWebhook.js";
import stripeRouter from "./src/routes/stripe.js";
import recomendationRouter from "./src/routes/recomendationRoutes.js";
import chatRouter from "./src/routes/chat.js";
import reviewRouter from "./src/routes/reviewRoute.js";

const app = express();
const PORT = process.env.PORT || 8080;

// --- Health check endpoint (must always respond) ---
app.get("/", (req, res) => {
  // res.status(200).send("✅ Server is live on Elastic Beanstalk");
  responseClient({
    req,
    res,
    message: "✅ Server is live on Elastic Beanstalk",
  });
});

// --- Stripe webhook FIRST (raw body) ---
app.use("/api/v1/webhook", webhookRouter);

// --- Middleware ---
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/v1/webhook")) {
    return next(); // skip express.json() for webhook
  }
  return express.json()(req, res, next);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // use env variable in EB
    credentials: true,
  })
);

app.use(morgan("dev"));

// --- Routes ---
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/image", imageRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/payment", stripeRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/recomendation", recomendationRouter);
app.use("/api/v1/user", chatRouter);

// --- Error handler ---
app.use(errorHandler);

// --- DB + Server ---
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("❌ DB Connection Error:", error));
