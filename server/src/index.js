const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("../middlerware/auth");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.listen(3001, () => {
  console.log("local server on port 3001");
});

const database = [
  {
    name: "user1",
    email: "user1@gmail.com",
    password: "123",
  },
  {
    name: "user2",
    email: "user2@gmail.com",
    password: "123",
  },
  {
    name: "user3",
    email: "user3@gmail.com",
    password: "123",
  },
  {
    name: "user4",
    email: "user4@gmail.com",
    password: "123",
  },
  {
    name: "user5",
    email: "user5@gmail.com",
    password: "123",
  },
];

app.post("/login", (req, res) => {
  const { email } = req.body;
  const user = database.find((user) => user.email === email);

  if (!user) {
    res.status(404).json({ msg: "User not found" });
  }

  if (user.email !== req.body.email || user.password !== req.body.password) {
    res.status(401).send({ msg: "Invalid credentials..." });
  }

  const authToken = jwt.sign({ name: user.name }, "secret");

  res
    .status(200)
    .send({ auth: authToken, user: { name: user.name, email: user.email } });
});

app.get("/dashboard", authenticateJWT, (req, res) => {
  try {
    const name = req.user;
    res.status(200).send({ user: name });
  } catch {
    res.status(500).send({ msg: "server error" });
  }
});

app.get("/users", authenticateJWT, (req, res) => {
  try {
    const data = database.map((user) => {
      return { name: user.name, email: user.email };
    });
    res.status(200).send({ users: data });
  } catch {
    res.status(500).send({ msg: "server error" });
  }
});
