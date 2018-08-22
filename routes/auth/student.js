const express = require("express")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const mongoose = require("mongoose")
const { StudentUser } = require("../../models/user")
const Course = require("../../models/course")
const Module = require("../../models/module")
const { inviteNewUser } = require("../../utils/inviteNewUser")
const { adminsOnly } = require("../../customMiddleware")
const studentAuthRouter = express.Router()

studentAuthRouter.use(["/authorize", "/invite", "/signup"], expressJwt({ secret: process.env.SECRET }))

studentAuthRouter.post("/invite", adminsOnly, async (req, res) => {
    // The request body for this request should include name.first, name.last, email, and course.
    // course is the ID of the course they're invited to

    if (!req.body.course) {
        return res.status(400).send({ message: "You must pick a course for this student to be enrolled in." })
    }

    try {
        const invitedUser = req.body
        invitedUser.admin = false
        const response = await inviteNewUser(invitedUser)
        return res.send(response.message)
    } catch (e) {
        return res.status(500).send(e.message)
    }
})

studentAuthRouter.post("/signup", async (req, res) => {
    try {
        const invitedUser = req.body
        const newStudent = new StudentUser(invitedUser)
        await newStudent.save()
        const module0 = await Module.findOne({sequenceNum: 0, courseId: req.user.course})
        newStudent.courses.push({course: req.user.course, currentModule: module0._id})
        await newStudent.save()
        await StudentUser.populate(newStudent, [{path: "courses.course"}, {path: "courses.currentModule"}])
        const token = jwt.sign(
            newStudent.secure(),
            process.env.SECRET,
            { expiresIn: "24h" }
        )
        return res.status(201).send({ token, user: newStudent.secure() })
    } catch (e) {
        console.log("There was a problem")
        return res.status(500).send(e)
    }
})

studentAuthRouter.post("/login", async (req, res) => {
    StudentUser.findOne({ email: req.body.email }, (err, student) => {
        if (err) return res.send(err)
        if (!student) return res.status(404).send({ message: "User not found" })
        student.auth(req.body.password, (err, isAuthorized) => {
            if (err) return res.send(err)
            if (isAuthorized) {
                const token = jwt.sign({
                    id: student._id,
                    cohortId: student.cohortId
                }, process.env.SECRET, { expiresIn: 1000 * 60 * 60 })
                res.status(201).send({ token, user: student.secure() })
            } else {
                return res.status(403).send({ message: "Invalid email/password combination" })
            }
        })
    })
})

// VERIFY STUDENT HAS VALID TOKEN
studentAuthRouter.get("/authorize", async (req, res) => {
    StudentUser.findById(req.user.id, (err, student) => {
        if (err) return res.send(err)
        if (!student) return res.status(404).send({ message: "User not found" })
        res.status(200).send(student.secure())
    })
})

module.exports = studentAuthRouter
