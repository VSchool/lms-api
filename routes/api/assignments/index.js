const express = require("express");

const { AssignmentsModel, CodingAssignmentsModel, QuizModel } = require("../../../models/api/assignments/");

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
    });
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
    .delete((req, res) => {
        if (req.permissions.admin) {
            AssignmentsModel.findByIdAndRemove(req.params.id, (err, assignment) => {
                if (err) res.status(500).send(err);
                res.status(204).send();
            })
        } else {
            res.status(401).send({ message: "Admin authorization required" })
        }
    })

module.exports = assignmentsRouter;
