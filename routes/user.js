const express = require("express")
const crypto = require("crypto")
const userRouter = express.Router()
const { StudentUser, AdminUser } = require("../models/user")
const { adminsOnly } = require("../customMiddleware")
const sendInviteEmail = require("../utils/sendInviteEmail")

userRouter.get("/students", async (req, res) => {
    try {
        const students = await StudentUser.find()
        const secureStudentDocs = students.map(doc => doc.secure())
        return res.send(secureStudentDocs)
    } catch (err) {
        return res.status(500).send(err)
    }
})


// Updating a student's info (not including password) done with this route
// If you want to update a student's password, /auth/users/passwordreset
// should be used instead
userRouter.put("/students/:id", async (req, res) => {
    try {
        // get the user doc and update the password
        const updatedStudent = await StudentUser.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        const token = jwt.sign(updatedStudent.secure(), process.env.SECRET, { expiresIn: "24h" })
        return res.send({token, user: updatedStudent.secure()})
    } catch (e) {
        return res.status(500).send(e)
    }
})

userRouter.post("/students/:id/courses", async (req, res) => {
    try {

    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = userRouter
