const express = require("express");
const expressJwt = require("express-jwt");

const apiRouter = express.Router();

apiRouter.use(expressJwt({ secret: process.env.SECRET }));
apiRouter.use("/cohorts", require("./cohorts.js"));
apiRouter.use("/days", require("./days.js"));

module.exports = apiRouter;