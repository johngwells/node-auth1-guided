const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');

const usersRouter = require("../users/users-router");
const authRouter = require('../router');

const restricted = require('../auth/restrict-middleware');

const server = express();

const sessionConfig = {
  name: 'monster',
  secret: 'keep it a secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // true in production
    httpOnly: true, // true means no access from JS
  },
  resave: false,
  saveUnintialized: true, // GDPR laws require to check with client
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
