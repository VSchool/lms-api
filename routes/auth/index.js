const express = require("express");
const authRouter = express.Router();

authRouter.use("/admin", require("./admin.js"));
authRouter.use("/student", require("./student.js"));


module.exports = authRouter;