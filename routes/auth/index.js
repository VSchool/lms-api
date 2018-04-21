const express = require("express");
const authRouter = express.Router();

authRouter.use("/admin", require("./admin.js"))


module.exports = authRouter;