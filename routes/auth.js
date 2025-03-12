const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  authController.googleAuth
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/logout", authController.logout); // Add logout route

module.exports = router;
