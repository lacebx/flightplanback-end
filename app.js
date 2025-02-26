const express = require("express");
const app = express();
const awardRoutes = require("./app/routes/award.routes");
const badgeRoutes = require("./app/routes/badge.routes");
const documentRoutes = require("./app/routes/document.routes");
const eventRoutes = require("./app/routes/event.routes");
const experienceRoutes = require("./app/routes/experience.routes");
const flightplanRoutes = require("./app/routes/flightplan.routes");
const taskRoutes = require("./app/routes/task.routes");

// existing code...
app.use("/api/awards", awardRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/flightplans", flightplanRoutes);
app.use("/api/tasks", taskRoutes);
// existing code... 