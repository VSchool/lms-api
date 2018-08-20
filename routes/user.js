const express = require("express")
const userRouter = express.Router()
const { StudentUser, AdminUser } = require("../models/user")
const { adminsOnly } = require("../customMiddleware")

userRouter.get("/students", async (req, res) => {
    try {
        const students = await StudentUser.find()
        const secureStudentDocs = students.map(doc => doc.secure())
        return res.send(secureStudentDocs)
    } catch(err) {
        return res.status(500).send(err)
    }
})

userRouter.post("/students", async (req, res) => {
    try {
        const newUser = new StudentUser({
            name: {first: "Bob", last: "Ziroll"},
            email: "bziroll@vschool.io",
            password: "bob"
        })
        const student = await newUser.save()
        const secureStudent = student.secure()
        return res.send(secureStudent)
    } catch (err) {
        return res.status(500).send(err)
    }
})

module.exports = userRouter