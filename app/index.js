const express = require("express");
const redis = require("redis");

const app = express();
const PORT = 3000;


const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
  },
  password: process.env.REDIS_PASSWORD || ""
});


client.connect().catch(console.error);


app.get("/health", (req, res) => {
  res.json({ status: "UP", message: "App is healthy" });
});


let requestLogs = [];
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  requestLogs.push(log);


  if (requestLogs.length > 100) {
    requestLogs.shift();
  }

  next();
});

app.get("/logs", (req, res) => {
  res.type("text/plain").send(requestLogs.join("\n"));
});


app.get("/redis-status", async (req, res) => {
  try {
    await client.set("status-check", "OK");
    const value = await client.get("status-check");

    res.json({
      redis: "connected",
      test_key: value,
    });
  } catch (err) {
    res.json({
      redis: "error",
      message: err.message,
    });
  }
});


app.get("/redis-info", async (req, res) => {
  try {
    const info = await client.info();
    res.type("text/plain").send(info);
  } catch (err) {
    res.status(500).send("Redis ERROR: " + err.message);
  }
});


app.get("/", (req, res) => {
  res.send("DevOps Automation App Running with Redis + Nginx + Jenkins!");
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
