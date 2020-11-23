const express = require("express");

const path = require("path");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 4000;
var crypto = require("crypto");

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.options("access", cors());
app.use(cors());
app.get("/access", cors(), (req, res) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization === "Basic lumen54321") {
    res.status(200).json({
      status: 200,
      message: crypto.randomBytes(20).toString("hex"),
    });
  } else {
    res.status(403).json({
      status: 403,
      message: "Forbidden access",
    });
  }
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
