require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const cors = require('cors');
const connectDB = require('./config/database');

//
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);



// Connect to MongoDB
connectDB();

// MiddleWare
app.use(express.json());
app.use(cors()); // Cho phép tất cả nguồn gốc

// Routes
const apiRoutes = require("./routes/index.js");
app.use("/api", apiRoutes);

server.listen(port, "0.0.0.0", () => {
    console.log(`Server started on port ${port}`);
  });