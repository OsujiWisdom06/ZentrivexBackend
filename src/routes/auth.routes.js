import express from "express";

import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();


// Signup
router.post(
  "/signup",
  signup
);


// Verify email
router.get(
  "/verify-email",
  verifyEmail
);


// Login
router.post(
  "/login",
  login
);


// Forgot password
router.post(
  "/forgot-password",
  forgotPassword
);


// Reset password
router.post(
  "/reset-password",
  resetPassword
);


// Get currently logged-in user
router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);


export default router;