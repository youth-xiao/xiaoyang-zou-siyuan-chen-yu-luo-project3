const express = require("express");
const mongoose = require("mongoose");
const tweetApi = require("./server/tweet.server");
const userApi = require("./server/user.server");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/tweet", tweetApi);
app.use("/api/user", userApi);

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION;

mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB:"));

let frontend_dir = path.join(__dirname, "dist");
app.use(express.static(frontend_dir));
app.get("*", function (req, res) {
  console.log("received request");
  res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 3500, function () {
  console.log("Starting server now...");
});
