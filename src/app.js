require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const articlesRouter = require("./articles/articles-router");
const app = express();
const { NODE_ENV } = require("./config");
const morganOption = NODE_ENV === "production";
const usersRouter = require("./users/users-router");
const commentsRouter = require("./comments/comments-router");

app.use(morgan(morganOption));
app.use(helmet());

app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);
// app.use(articlesRouter)

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;