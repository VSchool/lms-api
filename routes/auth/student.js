//dependencies
const express = require("express")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const nodemailer = require("nodemailer")

//imports
const { StudentUserModel } = require("../../models/user.js")
const CohortModel = require("../../models/course.js")

const studentAuthRouter = express.Router()
studentAuthRouter.use(["/authorize"], expressJwt({ secret: process.env.SECRET }))

studentAuthRouter.route("/signup/:cohortId")
    .post((req, res) => {
        const { cohortId } = req.params
        CohortModel.findById(cohortId, (err, cohort) => {
            if (err) return res.send(err)
            if (!cohort) return res.status(400).send({ message: "Invalid cohort ID" })
            StudentUserModel.findOne({ email: req.body.email }, (err, student) => {
                if (err) return res.send(err)
                if (student) return res.status(403).send({ message: "Email already exists" })
                const newStudent = new StudentUserModel({ ...req.body, cohortId })
                newStudent.save((err, savedStudent) => {
                    if (err) return res.send(err)
                    const token = jwt.sign({
                        id: savedStudent._id,
                        cohortId
                    }, process.env.SECRET, { expiresIn: 1000 * 60 * 60 * 24 })
                    res.status(201).send({ success: true, token, user: savedStudent.secure() })
                })
            })
        })
    })
studentAuthRouter.route("/login")
    .post((req, res) => {
        StudentUserModel.findOne({ email: req.body.email }, (err, student) => {
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
studentAuthRouter.route("/authorize")
    .get((req, res) => {
        StudentUserModel.findById(req.user.id, (err, student) => {
            if (err) return res.send(err)
            if (!student) return res.status(404).send({ message: "User not found" })
            res.status(200).send(student.secure())
        })
    })

module.exports = studentAuthRouter
