const express = require("express");
const redis = require("redis");

const client = redis.createClient({
  socket: { host: process.env.REDIS_HOST },
  password: process.env.REDIS_PASSWORD
});

client.connect();

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Automated DevOps App 🌐");
});

app.get("/health", (req, res) => res.json({ status: "healthy" }));

app.listen(3000, () => console.log("App running on port 3000"));
