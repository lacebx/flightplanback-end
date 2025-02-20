const express = require("express");
const passport = require("passport");

module.exports = (app) => {
  const router = express.Router();

  // Google OAuth Login Route
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // Google OAuth Callback Route
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("http://localhost:8080/home"); // Redirect to Vue frontend
    }
  );

  // Get Logged-in User Info
  router.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Logout Route
  router.get("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.redirect("http://localhost:8080/login"); // Redirect to Vue frontend
    });
  });

  app.use(router);
};