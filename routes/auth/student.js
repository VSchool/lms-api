const express = require("express")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const crypto = require("crypto")
const { StudentUser } = require("../../models/user")
const Course = require("../../models/course")
const Module = require("../../models/module")
const sendInviteEmail = require("../../utils/sendInviteEmail")
const { adminsOnly } = require("../../customMiddleware")
const studentAuthRouter = express.Router()

studentAuthRouter.use(["/authorize", "/invite", "/signup"], expressJwt({ secret: process.env.SECRET }))

studentAuthRouter.post("/invite", adminsOnly, async (req, res) => {
    // The request body should include name.first, name.last, email, and courseId.
    // courseId is the ID of the course they're invited to join
    if (!req.body.name || !req.body.name.first || !req.body.name.last || !req.body.email || !req.body.courseId) {
        return res.status(400).send({ message: "You must include all required fields. Check the docs for more info." })
    }

    try {
        const newStudent = new StudentUser(req.body)

        // Set a temp password to satisfy the required attribute
        newStudent.password = crypto.randomBytes(5).toString("hex")
        const course = await Course.findById(req.body.courseId)
        const module0 = await Module.findOne({ sequenceNum: 0, courseId: course._id })
        newStudent.courses = [{ currentModule: module0, course }]
        await newStudent.save()
        const result = await sendInviteEmail(newStudent.secure())
        return res.status(201).send({ user: newStudent.secure(), message: result.message })
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

studentAuthRouter.post("/signup", async (req, res) => {
    try {
        const invitedUser = req.body
        invitedUser.admin = false
        const updatedStudent = await StudentUser.findByIdAndUpdate(
            req.user._id,
            invitedUser,
            { new: true }
        )
        const token = jwt.sign(
            updatedStudent.secure(),
            process.env.SECRET,
            { expiresIn: "24h" }
        )
        return res.status(200).send({ token, user: updatedStudent.secure() })
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

studentAuthRouter.post("/login", async (req, res) => {
    try {
        const student = await StudentUser.findOne({ email: req.body.email })
        if (!student) return res.status(401).send({ message: "Invalid email or password" })
        const isAuthorized = await student.auth(req.body.password)
        if (isAuthorized) {
            const token = jwt.sign(
                student.secure(),
                process.env.SECRET,
                { expiresIn: "24h" }
            )
            return res.send({ user: student.secure(), token })
        }
        return res.status(401).send({ message: "Invalid email or password" })
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

// VERIFY STUDENT HAS VALID TOKEN
studentAuthRouter.get("/me/from/token", async (req, res) => {
    try {
        const student = await StudentUser.findById(req.user._id)
        if (!student) return res.status(404).send({ message: "User not found" })
        return res.status(200).send(student.secure())
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

module.exports = studentAuthRouter
