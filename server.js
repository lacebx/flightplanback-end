const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const dbConfig = require("./app/config/db.config");
const { faker } = require('@faker-js/faker');
const db = require("./app/models");
const adminRoutes = require("./app/routes/admin.routes");
const bcrypt = require('bcrypt');
const notificationRoutes = require('./app/routes/notification.routes');

const app = express();

// Configure CORS to allow your frontend (assumed at http://localhost:8080)
app.use(cors({
  origin: 'http://localhost:8080',
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
  callbackURL: 'http://localhost:8082/auth/google/callback', // Adjust backend port if needed
},
(accessToken, refreshToken, profile, done) => {
  console.log("Access Token:", accessToken);
  console.log("Profile:", profile);

  if (!profile) {
    return done(new Error("Authentication failed: No profile received."), null);
  }

  // Check if the user email ends with @eagles.oc.edu
  if (!profile.emails[0].value.endsWith('@eagles.oc.edu')) {
    return done(new Error("Unauthorized email domain."), null);
  }

  // Generate a valid idNumber
  const generateIdNumber = () => `15${faker.number.int({ min: 10000, max: 99999 })}`;

  // Check if the user exists in the database
  db.user.findOrCreate({
    where: { email: profile.emails[0].value }, // Use email to check existence
    defaults: {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      role: 'student',
      major: faker.commerce.department(), // Random major
      semester: faker.number.int({ min: 1, max: 8 }), // Random semester
      idNumber: generateIdNumber() // Generate valid idNumber
    }
  }).then(([user, created]) => {
    if (created) {
      console.log('New user created:', user);
    } else {
      console.log('User already exists:', user);
    }
    return done(null, user);
  }).catch(err => {
    console.error('Error finding or creating user:', err);
    return done(err, null);
  });
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
      req.session.save(async (err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.redirect("/");
        }
        console.log("User authenticated successfully:", req.user);
        console.log("User role:", req.user.role);

        // Check if the user needs to set a password
        if (!req.user.password) {
          // Redirect to password setup page
          return res.redirect("http://localhost:8080/setup-password");
        }

        // Redirect based on user role
        if (req.user.role === "admin" || req.user.role === "student staff") {
          res.redirect(`http://localhost:8080/admin`);
        } else if (req.user.role === "student") {
          res.redirect(`http://localhost:8080/home`);
        } else {
          res.redirect("/"); // Default redirect if role is not recognized
        }
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
const registrationRoutes = require("./app/routes/registration.routes");
const userRoutes = require("./app/routes/user.routes");
const taskCompletionRoutes = require("./app/routes/taskCompletion.routes");
const eventAttendanceRoutes = require("./app/routes/eventAttendance.routes");
const strengthRoutes = require("./app/routes/strength.routes");

// Use routes
app.use("/api/awards", awardRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/flightplans", flightplanRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", registrationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task-completions", taskCompletionRoutes);
app.use("/api/event-attendances", eventAttendanceRoutes);
app.use("/api/strengths", strengthRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Endpoint to register for an event
app.post('/api/events/:eventId/register', (req, res) => {
  const { eventId } = req.params;
  const { email, isVisible } = req.body;

  db.user.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return db.eventAttendance.create({
        userId: user.id,
        eventId,
        attended: false, // Initially not attended
        isVisible
      });
    })
    .then(() => res.status(200).json({ message: 'Registered successfully' }))
    .catch(err => {
      console.error('Error registering for event:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Endpoint to fetch registered events
app.get('/api/users/:userId/registered-events', (req, res) => {
  const { userId } = req.params;

  db.eventAttendance.findAll({ where: { userId }, include: [db.event] })
    .then(events => res.json(events))
    .catch(err => {
      console.error('Error fetching registered events:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Logic to update points when an event is attended
app.put('/api/events/:eventId/attend', (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  console.log(`User ${userId} is attending event ${eventId}`);

  db.eventAttendance.findOne({ where: { userId, eventId } })
    .then(attendance => {
      if (!attendance) {
        console.error(`Attendance record not found for user ${userId} and event ${eventId}`);
        return res.status(404).json({ message: 'Attendance record not found' });
      }

      attendance.attended = true;
      return attendance.save();
    })
    .then(() => db.event.findByPk(eventId))
    .then(event => {
      if (!event) {
        console.error(`Event not found with ID ${eventId}`);
        throw new Error('Event not found');
      }
      return db.user.findByPk(userId).then(user => {
        user.points += event.earnablepoints; // Use earnablepoints from event
        console.log(`User ${userId} awarded ${event.earnablepoints} points for attending event ${eventId}`);
        return user.save();
      });
    })
    .then(() => res.status(200).json({ message: 'Attendance recorded and points awarded' }))
    .catch(err => {
      console.error('Error updating attendance:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Logic to update tasks completed count
app.put('/api/tasks/:taskId/complete', (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  console.log(`User ${userId} is completing task ${taskId}`);

  db.taskCompletion.findOne({ where: { userId, taskId } })
    .then(taskCompletion => {
      if (!taskCompletion) {
        console.error(`Task completion record not found for user ${userId} and task ${taskId}`);
        return res.status(404).json({ message: 'Task completion record not found' });
      }

      taskCompletion.completed = true;
      return taskCompletion.save();
    })
    .then(() => db.task.findByPk(taskId))
    .then(task => {
      if (!task) {
        console.error(`Task not found with ID ${taskId}`);
        throw new Error('Task not found');
      }
      return db.user.findByPk(userId).then(user => {
        user.points += task.earnablepoints; // Use earnablepoints from task
        console.log(`User ${userId} awarded ${task.earnablepoints} points for completing task ${taskId}`);
        return user.save();
      });
    })
    .then(() => res.status(200).json({ message: 'Task marked as completed and points awarded' }))
    .catch(err => {
      console.error('Error updating task completion:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Endpoint to fetch admin dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    console.log('Fetching admin stats from the database...');
    const totalStudents = await db.user.count();
    console.log('Total Students:', totalStudents);

    const activeEvents = await db.event.count({ where: { eventtype: 'active' } });
    console.log('Active Events:', activeEvents);

    const pendingTasks = await db.task.count({ where: { completed: false } });
    console.log('Pending Tasks:', pendingTasks);

    res.json({
      totalStudents,
      activeEvents,
      pendingTasks
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Endpoint to set password
app.post('/auth/set-password', async (req, res) => {
  const { password } = req.body;
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({ password: hashedPassword }, { where: { id: req.user.id } });
    res.status(200).json({ message: "Password set successfully" });
  } catch (err) {
    console.error("Error setting password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint for email and password login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    req.login(user, function (err) {
      if (err) {
        return res.status(500).json({ message: 'Login error' });
      }
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: 'Session save error' });
        }
        res.status(200).json({ message: 'Login successful' });
      });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  console.log("Server configurations:");
  console.log(`CORS Origin: http://localhost:8080`);
  console.log(`Session Secret: ${process.env.SESSION_SECRET || 'secretkey'}`);
  console.log(`Google Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
  console.log(`Google Client Secret: ${process.env.GOOGLE_CLIENT_SECRET}`);
});