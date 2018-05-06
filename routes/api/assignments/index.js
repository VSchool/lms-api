const express = require("express");
const assignmentRouter = express.Router();

const Assignment = require("../../../models/api/assignments/");
const { Question } = require("../../../models/api/course-material/questions");
const { AssignmentQ } = require("../../../models/api/assignments/questions");

assignmentRouter.route("/")
    .get((req, res) => {
        if (req.user.permissions.admin) {
            AssignmentsModel.find(req.query, (err, assignments) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(assignments);
            })
        } else {
            AssignmentsModel.find({ ...req.query, assignedTo: req.user.id, cohort: req.user.cohortId }, (err, assignments) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(assignments);
            })
        }
    })
    // POST multiple assignments for each student, per cohort
    .post((req, res) => {
        Assignment.insertMany(req.body, (err, assignments) => {
            if (err) return res.status(500).send(err);
            res.status(201).send(assignments);
        });
    })

module.exports = assignmentRouter;