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
        const { assignmentId } = req.params;
        FeedbackModel.find({ ...req.query, assignment: assignmentId, }, (err, feedback) => {
            if (err) return res.send(err);
            res.status(200).send(feedback);
        });
    })
    .post((req, res) => {
        const { assignmentId } = req.params;
        if (req.user.permissions.admin) {
            AssignmentsModel.findById(assignmentId, (err, foundAssignment) => {
                if (err) return res.send(err);
                if (!assignment) return res.status(404).send({ message: "Assignment not found" })
                let newFeedback;
                const body = { ...req.body, assignment: assignmentId, instructor: req.user.id }
                switch (foundAssignment.kind) {
                    case "CodingAssignments":
                        newFeedback = new CodingFeedbackModel(body);
                        break;
                    case "QuizModel":
                        newFeedback = new NonCodingFeedbackModel(body);
                        break;
                    default:
                        return res.status(403).send({ message: "No assignment matches that kind" })
                }
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