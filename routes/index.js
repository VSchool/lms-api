const express = require("express")
const expressJwt = require("express-jwt")

const apiRouter = express.Router()

// apiRouter.use(expressJwt({ secret: process.env.SECRET }))

apiRouter.use("/users", require("./user"))
// apiRouter.use("/cohorts", require("./cohorts.js"))
// apiRouter.use("/tasks", require("./tasks/"))
// apiRouter.use("/assignment-qs", require("./tasks/questions"))
// apiRouter.use("/assignment-feedback", require("./tasks/feedback"))
// apiRouter.use("/coursework-item", require("./course-material/"))
// apiRouter.use("/coursework-item-qs", require("./course-material/questions"))
// apiRouter.use("/skills-tree-branches", require("./skills-tree/"))
// apiRouter.use("/branches", require("./skills-tree/branches"))

module.exports = apiRouter