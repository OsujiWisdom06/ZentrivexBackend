import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import { sendEmail } from "../services/email.service.js";

import verifyEmailTemplate from "../templates/verifyEmailTemplate.js";

import resetPasswordTemplate from "../templates/resetPasswordTemplates.js";


// =====================================================
// SIGN UP
// =====================================================

export const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check email
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verification token
    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const verificationTokenExpires =
      new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    // Verification link
    const verificationLink =
      `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Zentrivex Trade Email",
        html: verifyEmailTemplate(
          user.fullName,
          verificationLink
        ),
      });
    } catch (emailError) {

      console.error(
        "Verification email failed:",
        emailError.message
      );

      // We don't delete the user.
      // They can request another verification email later.
    }

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please check your email to verify your account.",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {

    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating your account.",
    });
  }
};


// =====================================================
// VERIFY EMAIL
// =====================================================

export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.query;

    if (!token) {
      return res.status(400).send(`
        <h2>Verification token is missing.</h2>
      `);
    }

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).send(`
        <h2>Invalid or expired verification link.</h2>
      `);
    }

    if (
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      return res.status(400).send(`
        <h2>This verification link has expired.</h2>
      `);
    }

    user.isVerified = true;

    user.verificationToken = null;

    user.verificationTokenExpires = null;

    await user.save();

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?verified=true`
    );

  } catch (error) {

    console.error("Verify email error:", error);

    return res.status(500).send(`
      <h2>Something went wrong while verifying your email.</h2>
    `);
  }
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in.",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether an account exists
    // This is safer for production.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const resetPasswordExpires =
      new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires =
      resetPasswordExpires;

    await user.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {

      await sendEmail({
        to: user.email,
        subject: "Reset Your Zentrivex Trade Password",
        html: resetPasswordTemplate(
          user.fullName,
          resetLink
        ),
      });

    } catch (emailError) {

      console.error(
        "Reset email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });

  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while processing your request.",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (req, res) => {
  try {

    const { token } = req.query;

    const {
      password,
      confirmPassword,
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link.",
      });
    }

    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in.",
    });

  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while resetting your password.",
    });
  }
};


// =====================================================
// GET CURRENT USER
// =====================================================

export const getCurrentUser = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    ).select(
      "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while getting your profile.",
    });
  }
};