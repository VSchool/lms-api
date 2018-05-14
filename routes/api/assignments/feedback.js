const express = require("express");
const feedbackRouter = express.Router({ mergeParams: true });
const {
    Feedback,
    CodingFeedback,
    QuizFeedback
} = require("../../../models/api/assignments/feedback.js");
const Assignment = require("../../../models/api/assignments/");

// Middleware to check for admin rights (allows you to avoid re-writing the if/else).
const { adminsOnly } = require("../customMiddleware");

feedbackRouter.route("/")
    .get((req, res) => {
        FeedbackModel.find(req.query, (err, feedback) => {
            if (err) return res.send(err);
            res.status(200).send(feedback);
        });
    })
    .post(adminsOnly, (req, res) => {
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
    })
    .delete(adminsOnly, (req, res) => {
        const { assignmentId } = req.params;
        FeedbackModel.deleteMany({ ...req.query, assignment: assignmentId }, (err) => {
            if (err) return res.status(500).send(err);
            res.status(204).send();
        })
    })

feedbackRouter.route("/:feedbackId")
    .get((req, res) => {
        FeedbackModel.findById(req.params.feedbackId, (err, feedback) => {
            if (err) return res.status(500).send(err);
            if (!feedback) return res.status(404).send({ message: "Feedback not found" })
            res.status(200).send(feedback);
        });
    })
    .delete(adminsOnly, (req, res) => {
        FeedbackModel.findByIdAndRemove(req.params.feedbackId, (err, feedback) => {
            if (err) return res.status(500).send(err);
            if (!feedback) return res.status(404).send({ message: "Feedback not found" });
            res.status(204).send();
        })
    })
    .put(adminsOnly, (req, res) => {
        const { assignmentId, feedbackId } = req.params;
        FeedbackModel.findOneAndUpdate({
            assignment: assignmentId,
            _id: feedbackId
        }, req.body, { new: true }, (err, feedback) => {
            if (err) return res.status(500).send(err);
            if (!feedback) return res.status(404).send({ message: "Feedback not found" });
            res.status(200).send(feedback);
        })
    })

module.exports = feedbackRouter;