const express = require("express")
const authRouter = express.Router()

authRouter.use("/admins", require("./admin"))
authRouter.use("/students", require("./student"))


module.exports = authRouter