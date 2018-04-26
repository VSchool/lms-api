const express = require("express");
const questionRouter = express.Router();

const {
    QuestionModel,
    MultChoiceQuestionModel,
    TextQuestionModel
} = require("../../../models/api/assignments/questions.js");

questionRouter.route("/")
    .get(req.query, (req, res) => {
        QuestionModel.find();
    })

modue.exports = questionRouter;