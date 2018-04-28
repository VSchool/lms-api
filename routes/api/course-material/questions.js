const express = require("express");
const questionRouter = express.Router({ mergeParams: true });

questionRouter.route("/")
    
module.exports = questionRouter;