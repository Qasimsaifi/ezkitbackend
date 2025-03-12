const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
const bcrypt = require("bcryptjs");

// Register a new user
exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    profilePicture,
    address,
    dateOfBirth,
    gender,
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({
      name,
      email,
      password,
      phoneNumber,
      profilePicture,
      address,
      dateOfBirth,
      gender,
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "265d" }
    );

    // Set cookie in all environments
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "lax", // Use "lax" for better compatibility
      maxAge: 3600000 * 24 * 100,
      path: "/", // Ensure the cookie is accessible across the entire site
    });

    res.status(201).json({
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "265d" }
    );

    // Set cookie in all environments
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "lax", // Use "lax" for better compatibility
      maxAge: 3600000 * 24 * 100, // 1 hour
      path: "/", // Ensure the cookie is accessible across the entire site
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth authentication
exports.googleAuth = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: "265d" }
  );

  // Set cookie in all environments
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 3600000 * 24 * 100,
    path: "/",
  });

  // Redirect to the profile page
  res.redirect("http://localhost:3000/profile");
};

// Logout a user
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "lax", // Use "lax" for better compatibility
    path: "/", // Ensure the cookie path matches
  });
  console.log("Logged out");
  res.json({ message: "Logged out successfully" });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset - EZKIT Labs",
      text: `Reset your password: http://localhost:3000/reset-password/${token}`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
