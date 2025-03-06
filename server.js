import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {db} from './app/config/db.config.js';

dotenv.config();

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
        res.redirect(`http://localhost:8080/home`);
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
import {awardRouter} from './app/routes/award.routes.js';
import {badgeRouter} from './app/routes/badge.routes.js';
import {documentRouter} from './app/routes/document.routes.js';
import {eventRouter} from './app/routes/event.routes.js';
import {experienceRouter} from './app/routes/experience.routes.js';
import {flightplanRouter} from './app/routes/flightplan.routes.js';
import {taskRouter} from './app/routes/task.routes.js';
import {userRouter} from './app/routes/user.routes.js';

// Use routes
app.use("/api/awards", awardRouter);
app.use("/api/badges", badgeRouter);
app.use("/api/documents", documentRouter);
app.use("/api/events", eventRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/flightplans", flightplanRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Log DB configurations
console.log("DB Configurations:");
console.log(`Database Name: ${process.env.MYSQL_NAME}`);
console.log(`Database Host: ${process.env.MYSQL_HOST}`);
console.log(`Database Port: ${process.env.MYSQL_PORT}`);
console.log(`Database User: ${process.env.MYSQL_USER}`);
console.log(`Database Password: ${process.env.MYSQL_PASSWORD}`);

// Start server



//THIS WAS AN ATTEMPT TO CREATE A DATABASE IF IT DOESN'T EXIST ALREADY

// const dbName = process.env.MYSQL_DATABASE; // Your database name
// const dbUser = process.env.MYSQL_USER; // Your database user
// const dbPassword = process.env.MYSQL_PASSWORD; // Your database password
// const dbHost = process.env.MYSQL_HOST; // Your database host
// const dbDialect = process.env.MYSQL_DIALECT;

// const sequelize = new Sequelize(`postgres://${dbUser}:${dbPassword}@${dbHost}`, {
//   dialect: dbDialect, // Change to your DB dialect
// });

// // Function to create the database
// const createDatabaseIfNotExists = async () => {
//   try {
//     await sequelize.query(`CREATE DATABASE "${dbName}"`);
//     console.log(`Database "${dbName}" created successfully.`);
//   } catch (error) {
//     if (error.name === 'SequelizeDatabaseError' && error.original.code === '42P04') {
//       // Database already exists
//       console.log(`Database "${dbName}" already exists.`);
//     } else {
//       console.error('Error creating database:', error);
//     }
//   }
// };

// // Call the function to create the database
// createDatabaseIfNotExists()
//   .then(() => {
//     // Now initialize Sequelize with the database
//     const sequelizeWithDb = new Sequelize(dbName, dbUser, dbPassword, {
//       host: dbHost,
//       dialect: dbDialect, // Change to your DB dialect
//     });

//     // Sync models with the database
//     return sequelizeWithDb.sync({ force: false }); // Use 'alter: true' if needed
//   })
//   .then(() => {
//     console.log('Database and tables synchronized successfully.');
//   })
//   .catch((error) => {
//     console.error('Error initializing Sequelize:', error);
//   });



const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
  console.log("Server configurations:");
  console.log(`CORS Origin: http://localhost:8080`);
  console.log(`Session Secret: ${process.env.SESSION_SECRET || 'secretkey'}`);
  console.log(`Google Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
  console.log(`Google Client Secret: ${process.env.GOOGLE_CLIENT_SECRET}`);
});