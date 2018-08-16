/*
* Commenting this whole file out until we decide to implement this feature
* Bob Ziroll - August 15th, 2018
* */

// const express = require("express")
// const assignmentQRouter = express.Router()
//
// const AssignmentQ = require("../../../models/tasks/question")
//
// assignmentQRouter.route("/")
//     .post((req, res) => {
//         AssignmentQ.insertMany(req.body, (err, qs) => {
//             if (err) return res.status(500).send(err)
//             res.status(201).send(qs)
//         })
//     })
//     .get((req, res) => {
//         if (req.user.admin) {
//             AssignmentQ.find(req.query, (err, qs) => {
//                 if (err) return res.status(500).send(err)
//                 res.status(200).send(qs)
//             })
//         } else {
//             AssignmentQ.find({ student: req.user.id, ...req.query }, (err, qs) => {
//                 if (err) return res.status(500).send(err)
//                 res.status(200).send(qs)
//             })
//         }
//     })
//
// module.exports = assignmentQRouter