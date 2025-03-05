const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();
const router = require("./routes/api");
const cookieParser = require("cookie-parser");
const corsDetails = {
  origin: "http://localhost:3001",
  credentials: true,
};
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsDetails));
app.use(cookieParser());
app.use(router);

app.use("/Storage", express.static("Storage"));
app.use(multer);


mongoose
  .connect("mongodb://127.0.0.1:27017/nextproject")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(5000, () => {
  console.log("Listening to 5000");
});
