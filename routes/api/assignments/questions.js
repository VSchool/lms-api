const express = require("express");
const assignmentQRouter = express.Router();

const AssignmentQ = require("../../../models/api/assignments/questions");

assignmentQRouter.route("/")
    .post((req, res) => {
        AssignmentQ.insertMany(req.body, (err, qs) => {
            if (err) return res.status(500).send(err);
            res.status(201).send(qs);
        });
    })
    .get((req, res) => {
        if(req.user.admin){

        } else {
            AssignmentQ.find()
        }
    })

module.exports = assignmentQRouter;