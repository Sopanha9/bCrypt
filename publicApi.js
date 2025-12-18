require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 8080;

// Centralize and validate the JWT secret
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "dev-secret-change-me";
if (!process.env.ACCESS_TOKEN_SECRET) {
  console.warn(
    "Warning: ACCESS_TOKEN_SECRET is not set. Using a temporary development secret. Set it in a .env file."
  );
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  // we will pretent this is user login success
  const username = req.body.username;
  const user = { name: username };

  // genereate jsonwebtoken
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

  // send token to client
  res.json({ accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const accessTokenGenrate = ACCESS_TOKEN_SECRET;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, accessTokenGenrate, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/posts", authenticateToken, (req, res) => {
  res.json([
    {
      message: `Hello ${req.user.name} here is your secret token`,
      data: accessTokenGenrate,
    },
  ]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
