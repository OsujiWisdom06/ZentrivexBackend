import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

const app = express();


// Security
app.use(helmet());


// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);


// Body parsers
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// Cookies
app.use(cookieParser());


// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zentrivex Trade API is running 🚀",
  });
});


// Authentication routes
app.use(
  "/api/auth",
  authRoutes
);


export default app;