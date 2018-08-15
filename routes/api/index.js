const express = require("express")
const expressJwt = require("express-jwt")

const apiRouter = express.Router()

apiRouter.use(expressJwt({ secret: process.env.SECRET }))
apiRouter.use("/cohorts", require("./cohorts.js"))
apiRouter.use("/tasks", require("./assignments/"))
apiRouter.use("/assignment-qs", require("./assignments/questions"))
apiRouter.use("/assignment-feedback", require("./assignments/feedback"))
apiRouter.use("/coursework-item", require("./course-material/"))
apiRouter.use("/coursework-item-qs", require("./course-material/questions"))
apiRouter.use("/skills-tree", require("./skills-tree/"))
apiRouter.use("/branches", require("./skills-tree/branches"))

module.exports = apiRouter