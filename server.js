const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const dbConfig = require("./app/config/db.config");

const app = express();

// Configure CORS to allow your frontend (assumed at http://localhost:8081)
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure sessions (use secure: true with HTTPS in production)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Setup Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback', // Adjust backend port if needed
},
(accessToken, refreshToken, profile, done) => {
  console.log("Access Token:", accessToken);
  console.log("Profile:", profile);

  if (!profile) {
    return done(new Error("Authentication failed: No profile received."), null);
  }
  // In a production app, you would look up or create the user in your database here.
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes

// Home route (for testing)
app.get('/', (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

// Google Authentication Routes
app.get("/auth/google", passport.authenticate('google', { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate('google', { failureRedirect: "/" }),
  (req, res) => {
    // Ensure the user is logged in and the session is saved before redirecting
    req.login(req.user, function (err) {
      if (err) {
        console.error("Login error:", err);
        return res.redirect("/");
      }
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.redirect("/");
        }
        console.log("User authenticated successfully:", req.user);
        // Redirect to your frontend home page with user info as query parameters
        res.redirect(`http://localhost:8081/home`);
      });
    });
  }
);

// Protected route to fetch authenticated user info
app.get("/auth/user", (req, res) => {
  console.log("Session:", req.session);
  console.log("req.isAuthenticated():", req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Protected profile route
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("User not authenticated");
  }
  res.json({
    displayName: req.user.displayName,
    email: req.user.emails[0].value,
  });
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }
    req.session.destroy();
    res.redirect("/");
  });
});

// Include route files
const awardRoutes = require("./app/routes/award.routes");
const badgeRoutes = require("./app/routes/badge.routes");
const documentRoutes = require("./app/routes/document.routes");
const eventRoutes = require("./app/routes/event.routes");
const experienceRoutes = require("./app/routes/experience.routes");
const flightplanRoutes = require("./app/routes/flightplan.routes");
const taskRoutes = require("./app/routes/task.routes");

// Use routes
app.use("/api/awards", awardRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/flightplans", flightplanRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Log DB configurations
console.log("DB Configurations:");
console.log(`Database Name: ${dbConfig.DB}`);
console.log(`Database Host: ${dbConfig.HOST}`);
console.log(`Database Port: ${dbConfig.PORT}`);
console.log(`Database User: ${dbConfig.USER}`);
console.log(`Database Password: ${dbConfig.PASSWORD}`);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log("Server configurations:");
  console.log(`CORS Origin: http://localhost:8080`);
  console.log(`Session Secret: ${process.env.SESSION_SECRET || 'secretkey'}`);
  console.log(`Google Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
  console.log(`Google Client Secret: ${process.env.GOOGLE_CLIENT_SECRET}`);
});