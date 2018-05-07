const express = require("express");
const expressJwt = require("express-jwt");

const apiRouter = express.Router();

apiRouter.use(expressJwt({ secret: process.env.SECRET }));
apiRouter.use("/cohorts", require("./cohorts.js"));
apiRouter.use("/days", require("./days.js"));
apiRouter.use("/assignments", require("./assignments/"));
apiRouter.use("/assignment-qs", require("./assignments/questions"));
apiRouter.use("/course-material", require("./course-material/"));
apiRouter.use("/course-material-qs", require("./course-material/questions"));
apiRouter.use("/skills-tree", require("./skills-tree/"));
apiRouter.use("/branches", require("./skills-tree/branches"));

module.exports = apiRouter;