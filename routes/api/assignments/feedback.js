const express = require("express");
const {
    FeedbackModel,
    CodingFeedbackModel,
    NonCodingFeedbackModel
} = require("../../../models/api/assignments/feedback.js");

const feedbackRouter = express.Router();

feedbackRouter.route("/")
    .get(req.query, (req, res) => {
        if (req.user.permissions.admin) {

        } else {
            res.status(403).send({message: "Admin authorization required"})
        }
    })