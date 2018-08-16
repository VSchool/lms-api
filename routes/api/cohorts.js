const express = require("express")
const courseRouter = express.Router()
const Course = require("../../models/course")
const { adminsOnly } = require("../../customMiddleware")

courseRouter.route("/")
    .get(adminsOnly, (req, res) => {
        Course.find(req.query, (err, courses) => {
            if (err) return res.send(err)
            return res.status(200).send(courses)
        })
    })
    .post(adminsOnly, (req, res) => {
        const newCourse = new Course(req.body)
        newCourse.save((err, savedCourse) => {
            if (err) return res.send(err)
            return res.status(201).send(savedCourse)
        })
    })

courseRouter.route("/:id")
    .get((req, res) => {
        Course.findById(req.params.id, (err, course) => {
            if (err) return res.send(err)
            if (!course) return res.status(404).send({ message: "Course not found" })
            return res.status(200).send(course)
        })
    })
    .put(adminsOnly, (req, res) => {
        Course.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, course) => {
            if (err) return res.status(500).send(err)
            return res.status(200).send(course)
        })
    })
    .delete(adminsOnly, (req, res) => {
        Course.findByIdAndRemove(req.params.id, (err, course) => {
            if (err) return res.status(500).send(err)
            return res.status(204).send()
        })
    })


module.exports = courseRouter;