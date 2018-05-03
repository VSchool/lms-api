const express = require("express");
const assignmentRouter = express.Router();

const AssignmentsModel = require("../../../models/api/assignments/");

assignmentRouter.route("/")
    .get((req, res) => {
        if (req.user.permissions.admin) {
            AssignmentsModel.find(req.query, (err, assignments) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(assignments);
            })
        } else {
            AssignmentsModel.find({ ...req.query, assignedTo: req.user.id }, (err, assignments) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(assignments);
            })
        }
    })
    // POST multiple assignments for each student, per cohort

module.exports = assignmentRouter;