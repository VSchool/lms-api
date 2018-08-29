const express = require("express")
const taskRouter = express.Router()
const Task = require("../../../models/task")

taskRouter.route("/")
    .get((req, res) => {
        if (req.user.admin) {
            Task.find((err, tasks) => {
                if (err) return res.status(500).send(err)
                return res.status(200).send(tasks)
            })
        } else {
            Task.find({ assignedTo: req.user.id }, (err, tasks) => {
                if (err) return res.status(500).send(err)
                return res.status(200).send(tasks)
            })
        }
    })
    .post((req, res) => {
        Task.insertMany(req.body, (err, tasks) => {
            if (err) return res.status(500).send(err)
            res.status(201).send(tasks)
        })
    })

module.exports = taskRouter
