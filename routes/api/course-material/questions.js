const express = require("express");
const questionRouter = express.Router({ mergeParams: true });

questionRouter.route("/")
// BASIC
// get all questions belonging to assignment / query

// ADMIN
// post question (text, mult)
// delete all q's to assignment
// edit all q's to assignment

// BASIC
// get one q

// ADMIN
//  delete one q
//  edit one q

    
module.exports = questionRouter;