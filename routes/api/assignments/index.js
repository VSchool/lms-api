const express = require("express");
const assignmentRouter = express.Router();

const Assignment = require("../../../models/api/assignments/");

assignmentRouter.route("/")
    .get((req, res) => {
        if (req.user.admin) {
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
    .post((req, res) => {
        Assignment.insertMany(req.body, (err, assignments) => {
            if (err) return res.status(500).send(err);
            res.status(201).send(assignments);
        });
    })

module.exports = assignmentRouter;