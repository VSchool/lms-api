const express = require("express");

const { AssignmentsModel, CodingAssignmentsModel, QuizModel } = require("../../../models/api/assignments/");
const { QuestionModel } = require("../../../models/api/assignments/questions.js");
const { FeedbackModel } = require("../../../models/api/assignments/feedback.js");

const assignmentsRouter = express.Router();
assignmentsRouter.use("/:assignmentId/feedback", require("./feedback.js"));
assignmentsRouter.use("/:assignmentId/questions", require("./questions.js"));

assignmentsRouter.route("/")
    .get((req, res) => {
        if (req.user.permissions.admin)
            // get all assignments that match query if admin
            AssignmentsModel.find(req.query, (err, foundAssignments) => {
                if (err) return res.send(err);
                res.status(200).send(foundAssignments);
            })
        else
            // get all students' assignments
            AssignmentsModel.find({ ...req.query, assignedTo: req.user.id }, (err, foundAssignments) => {
                if (err) return res.send(err);
                res.status(200).send(foundAssignments);
            })
    })
    .post((req, res) => {
        const { type } = req.query;
        if (req.user.permissions.admin) {
            let newAssignment;
            if (type === "quiz") {
                newAssignment = new QuizModel(req.body);
            } else if (type === "code") {
                newAssignment = new CodingAssignmentsModel(req.body);
            } else {
                return res.status(403).send({ message: "no matching query 'type' was found" })
            }
            newAssignment.save((err, savedAssignment) => {
                if (err) return res.send(err);
                res.status(201).send(savedAssignment);
            })
        } else {
            res.status(401).send({ message: "Admin authorization required" })
        }
    })
    .delete((req, res) => {
        if (req.user.permissions.admin) {
            AssignmentsModel.find(req.query)
                .exec((err, assignments) => {
                    if (err) return res.status(500).send(err);
                    if (!assignments) return res.status(404).send({ message: "No assignments found" })
                    assignments.forEach(assignment => {
                        const query = { assignment: assignment._id };
                        FeedbackModel.deleteMany(query, err => err ? res.status(500).send(err) : null);
                        QuestionModel.deleteMany(query, err => err ? res.status(500).send(err) : null);
                        assignment.remove(err => err ? res.status(500).send(err) : null);
                    });
                    res.status(204).send();
                });
        } else {
            res.status(401).send({ message: "Admin authorization required" })
        }
    })

assignmentsRouter.route("/:id")
    .get((req, res) => {
        if (req.user.permissions.admin) {
            AssignmentsModel.findById(req.params.id, (err, assignment) => {
                if (err) return res.status(500).send(err);
                if (!assignment) return res.status(404).send({ message: "Assignment not found" });
                res.status(200).send(assignment);
            })
        } else {
            AssignmentsModel.findOne({ _id: req.params.id, assignedTo: req.user.id }, (err, assignment) => {
                if (err) return res.status(500).send(err);
                if (!assignment) return res.status(404).send({ message: "Assignment not found" });
                res.status(200).send(assignment);
            })
        }
    })
    .put((req, res) => {
        if (req.user.permissions.admin) {
            AssignmentsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, assignment) => {
                if (err) return res.status(500).send(err);
                if (!assignment) return res.status(404).send({ message: "Assignment not found" });
                res.status(200).send(assignment);
            })
        } else {
            AssignmentsModel.findOneAndUpdate({ _id: req.params.id, assignedTo: req.user.id }, req.body, { new: true }, (err, assignment) => {
                if (err) return res.status(500).send(err);
                if (!assignment) return res.status(404).send({ message: "Assignment not found" });
                res.status(200).send(assignment);
            })
        }
    })

module.exports = assignmentsRouter;
