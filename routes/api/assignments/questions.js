const express = require("express");
const questionRouter = express.Router({ mergeParams: true });

const {
    QuestionModel,
    MultChoiceQuestionModel,
    TextQuestionModel
} = require("../../../models/api/assignments/questions.js");
const { AssignmentsModel } = require("../../../models/api/assignments/");

questionRouter.route("/")
    .get((req, res) => {
        const { assignmentId } = req.params;
        QuestionModel.find({ ...req.query, assignment: assignmentId }, (err, foundQs) => {
            if (err) return res.send(err);
            if (!foundQs) return res.status(404).send({ message: "Assignment not found" });
            res.status(200).send(foundQs);
        });
    })
    .post((req, res) => {
        const { assignmentId } = req.params;
        if (req.user.permissions.admin) {
            AssignmentsModel.findById(assignmentId, (err, foundAssignment) => {
                if (err) return res.send(err);
                if (!foundAssignment) return res.status(404).send({ message: "Assignment not found" });
                if (foundAssignment.assignmentType !== "quiz") return res.status(403).send({ message: "Cannot add questions to non-quiz assignments" })
                let newQ;
                const body = { assignment: assignmentId, ...req.body };
                switch (req.query.type) {
                    case "mult":
                        newQ = new MultChoiceQuestionModel(body);
                        break;
                    case "text":
                        newQ = new TextQuestionModel(body);
                        break;
                    default:
                        return res.status(403).send({ message: "'type' query must be provided" })
                }
                newQ.save((err, savedQ) => {
                    if (err) return res.send(err);
                    res.status(201).send(savedQ);
                });
            });
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
    

module.exports = questionRouter;