const express = require("express");
const feedbackRouter = express.Router({ mergeParams: true });

const {
    FeedbackModel,
    CodingFeedbackModel,
    NonCodingFeedbackModel
} = require("../../../models/api/assignments/feedback.js");
const { AssignmentsModel } = require("../../../models/api/assignments/");


feedbackRouter.route("/")
    .get((req, res) => {
        FeedbackModel.find({ ...req.query, assignment: req.params.assignmentId }, (err, feedback) => {
            if (err) return res.send(err);
            res.status(200).send(feedback);
        });
    })
    .post((req, res) => {
        if (req.user.permissions.admin) {
            AssignmentsModel.findById(req.params.assignmentId, (err, foundAssignment) => {
                if (err) return res.send(err);
                let newFeedback;
                switch (foundAssignment.kind) {
                    case "CodingAssignments":
                        newFeedback = new CodingFeedbackModel(req.body);
                        break;
                    case "QuizModel":
                        newFeedback = new NonCodingFeedbackModel(req.body);
                        break;
                    default:
                        return res.status(403).send({ message: "'type' query must be provided" })
                }
                newFeedback.assignment = req.params.assignmentId;
                newFeedback.instructor = req.user.id;
                newFeedback.save((err, savedFeedback) => {
                    if (err) return res.send(err);
                    res.status(201).send(savedFeedback);
                })
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    });


module.exports = feedbackRouter;