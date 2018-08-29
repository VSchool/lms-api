const express = require("express")
const authRouter = express.Router()

// TODO: Figure out why errors aren't sending to the client.
// (It's sending an empty object instead of the error)
authRouter.use("/admins", require("./admin"))
authRouter.use("/students", require("./student"))

module.exports = authRouter
