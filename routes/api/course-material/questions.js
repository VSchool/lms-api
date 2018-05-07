const express = require("express");

const {
    Question,
    MultChoiceQuestion,
    TextQuestion
} = require("../../../models/api/course-material/questions.js");

const questionRouter = express.Router();

questionRouter.route("/")
    .get((req, res) => {
        Question.find(req.query, (err, qs) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(qs);
        });
    })
    .post((req, res) => {
        const { type } = req.query;
        if (req.user.admin) {
            let newQ;
            switch (type) {
                case "mult":
                    newQ = new MultChoiceQuestion(req.body);
                    break
                case "text":
                    newQ = new TextQuestion(req.body);
                    break;
                default:
                    return res.status(403).send({ message: "Query 'type' must be provided" })
            }
            newQ.save((err, savedQ) => {
                if (err) return res.status(500).send(err);
                res.status(201).send(savedQ);
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
    .delete((req, res) => {
        if (req.user.admin) {
            Question.deleteMany(req.query, (err) => {
                if (err) return res.status(500).send(err);
                res.status(204).send();
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })

questionRouter.route("/:qId")
    .get((req, res) => {
        const { qId } = req.params;
        Question.findOne({ _id: qId }, (err, q) => {
            if (err) return res.status(500).send(err);
            if (!q) return res.status(404).send({ message: "Question not found" })
            res.status(200).send(q);
        });
    })
    .delete((req, res) => {
        const { qId } = req.params;
        if (req.user.admin) {
            Question.deleteOne({ _id: qId }, (err) => {
                if (err) return res.status(500).send(err);
                if (!q) return res.status(404).send({ message: "Question not found" });
                res.status(204).send();
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
    .put((req, res) => {
        const { qId } = req.params;
        if (req.user.admin) {
            Question.findOneAndUpdate({ _id: qId }, req.body, { new: true }, (err, q) => {
                if (err) return res.status(500).send(err);
                if (!q) return res.status(404).send({ message: "Question not found" });
                res.status(200).send(q);
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    });

module.exports = questionRouter;