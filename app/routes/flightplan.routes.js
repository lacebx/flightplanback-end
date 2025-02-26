const express = require("express");
const passport = require("passport");
const db = require("../models").default;
const Flightplan = db.flightplan;

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

  // Create a new flightplan
  router.post("/", async (req, res) => {
    try {
      const flightplan = await Flightplan.create(req.body);
      res.status(201).json(flightplan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all flightplans
  router.get("/", async (req, res) => {
    try {
      const flightplans = await Flightplan.findAll();
      res.status(200).json(flightplans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a flightplan by ID
  router.get("/:id", async (req, res) => {
    try {
      const flightplan = await Flightplan.findByPk(req.params.id);
      if (flightplan) {
        res.status(200).json(flightplan);
      } else {
        res.status(404).json({ message: "Flightplan not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update a flightplan by ID
  router.put("/:id", async (req, res) => {
    try {
      const [updated] = await Flightplan.update(req.body, {
        where: { flightplanID: req.params.id }
      });
      if (updated) {
        const updatedFlightplan = await Flightplan.findByPk(req.params.id);
        res.status(200).json(updatedFlightplan);
      } else {
        res.status(404).json({ message: "Flightplan not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a flightplan by ID
  router.delete("/:id", async (req, res) => {
    try {
      const deleted = await Flightplan.destroy({
        where: { flightplanID: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Flightplan not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.use(router);
};