const express = require("express");
const expressJwt = require("express-jwt");

const apiRouter = express.Router();

apiRouter.use(expressJwt({ secret: process.env.SECRET }));
apiRouter.use("/cohorts", require("./cohorts.js"));
apiRouter.use("/days", require("./days.js"));
//add assignments later
apiRouter.use("/course-material", require("./course-material/"));
apiRouter.use("/skills-tree", require("./skills-tree/"));
apiRouter.use("/branches", require("./skills-tree/branches.js"));

module.exports = apiRouter;