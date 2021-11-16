// 1) Node Modules
const express = require("express");
const mongoose = require("mongoose");
require("./config/db");
const compression = require("compression");
const helmet = require("helmet");

// 2) local Modules
const appSettings = require("./middleware/appSettings.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// 3) Express Router
const mainRouter = require("./routes/mainRouter");

// 4) Express App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());

// 5) Middleware
app.use(appSettings.corsHeaders);
app.use(mainRouter);

// 6) Check if the server is running
app.get("/test", (req, res, next) => {
  res.json({ test: "working..." }).status(200).end();
});

// 7) Error Handling
app.use(notFound);
app.use(errorHandler);

// 9) Export the app to index.js
// Note: I split the app into two files, one for the server and one for the testCases
// this is because I wanted to keep the testCases clean and not have to worry about
module.exports = app;
// The server is listening and running in index.js file on port 8080
