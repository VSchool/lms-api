const express = require("express");
const feedbackRouter = express.Router({ mergeParams: true });

const {
    Feedback,
    CodingFeedback,
    QuizFeedback
} = require("../../../models/api/assignments/feedback.js");
const Assignment = require("../../../models/api/assignments/");

feedbackRouter.route("/")
    .get((req, res) => {
        FeedbackModel.find(req.query, (err, feedback) => {
            if (err) return res.send(err);
            res.status(200).send(feedback);
        });
    })
    .post((req, res) => {
        if (req.user.admin) {
            Assignment.findById(req.body.assignment)
                .populate("courseMaterial assignmentType")
                .exec((err, foundAssignment) => {
                    if (err) return res.send(err);
                    if (!foundAssignment) return res.status(404).send({ message: "Assignment not found" })
                    let newFeedback;
                    const body = { student: foundAssignment.assignedTo, instructor: req.user.id, ...req.body };
                    switch (foundAssignment.courseMaterial.assignmentType) {
                        case "quiz":
                            newFeedback = new QuizFeedback(body);
                            break;
                        default:
                            newFeedback = new CodingFeedback(body);
                    }
                    newFeedback.save((err, savedFeedback) => {
                        if (err) return res.send(err);
                        res.status(201).send(savedFeedback);
                    })
                })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
    .delete((req, res) => {
        if (req.user.admin) {
            const { assignmentId } = req.params;
            FeedbackModel.deleteMany({ ...req.query, assignment: assignmentId }, (err) => {
                if (err) return res.status(500).send(err);
                res.status(204).send();
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
feedbackRouter.route("/:feedbackId")
    .get((req, res) => {
        FeedbackModel.findById(req.params.feedbackId, (err, feedback) => {
            if (err) return res.status(500).send(err);
            if (!feedback) return res.status(404).send({ message: "Feedback not found" })
            res.status(200).send(feedback);
        });
    })
    .delete((req, res) => {
        if (req.user.admin) {
            FeedbackModel.findByIdAndRemove(req.params.feedbackId, (err, feedback) => {
                if (err) return res.status(500).send(err);
                if (!feedback) return res.status(404).send({ message: "Feedback not found" });
                res.status(204).send();
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
    .put((req, res) => {
        if (req.user.admin) {
            const { assignmentId, feedbackId } = req.params;
            FeedbackModel.findOneAndUpdate({ assignment: assignmentId, _id: feedbackId }, req.body, { new: true }, (err, feedback) => {
                if (err) return res.status(500).send(err);
                if (!feedback) return res.status(404).send({ message: "Feedback not found" });
                res.status(200).send(feedback);
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })

module.exports = feedbackRouter;