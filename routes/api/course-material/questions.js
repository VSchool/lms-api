/*
* Commenting this whole file out until we decide to implement this feature
* Bob Ziroll - August 15th, 2018
* */

// const express = require("express")
// const questionRouter = express.Router()
// const {
//     Question,
//     MultChoiceQuestion,
//     TextQuestion
// } = require("../../../models/coursework-item/question.js")
// const { adminsOnly } = require("../../../customMiddleware")
//
// questionRouter.route("/")
//     .get((req, res) => {
//         Question.find(req.query, (err, qs) => {
//             if (err) return res.status(500).send(err)
//             res.status(200).send(qs)
//         })
//     })
//     .post(adminsOnly, (req, res) => {
//         const { type } = req.query
//         let newQ
//         switch (type) {
//             case "mult":
//                 newQ = new MultChoiceQuestion(req.body)
//                 break
//             case "text":
//                 newQ = new TextQuestion(req.body)
//                 break
//             default:
//                 return res.status(403).send({ message: "Query 'type' must be provided" })
//         }
//         newQ.save((err, savedQ) => {
//             if (err) return res.status(500).send(err)
//             res.status(201).send(savedQ)
//         })
//     })
//     .delete(adminsOnly, (req, res) => {
//         Question.deleteMany(req.query, (err) => {
//             if (err) return res.status(500).send(err)
//             res.status(204).send()
//         })
//     })
//
// questionRouter.route("/:qId")
//     .get((req, res) => {
//         const { qId } = req.params
//         Question.findOne({ _id: qId }, (err, q) => {
//             if (err) return res.status(500).send(err)
//             if (!q) return res.status(404).send({ message: "Question not found" })
//             res.status(200).send(q)
//         })
//     })
//     .delete(adminsOnly, (req, res) => {
//         const { qId } = req.params
//         Question.deleteOne({ _id: qId }, (err) => {
//             if (err) return res.status(500).send(err)
//             if (!q) return res.status(404).send({ message: "Question not found" })
//             res.status(204).send()
//         })
//     })
//     .put(adminsOnly, (req, res) => {
//         const { qId } = req.params
//         Question.findOneAndUpdate({ _id: qId }, req.body, { new: true }, (err, q) => {
//             if (err) return res.status(500).send(err)
//             if (!q) return res.status(404).send({ message: "Question not found" })
//             res.status(200).send(q)
//         })
//     })
//
// module.exports = questionRouter
