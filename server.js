import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import {db} from "./app/config/db.config.js"; // Ensure you have the correct file extension

const app = express();
dotenv.config();

// Correct the corsOptions object and typo in origin


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the flightplan application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); // Fixed template literal
});