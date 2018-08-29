const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const expressJwt = require("express-jwt")
const { AdminUser } = require("../../models/user.js")
const { adminsOnly } = require("../../customMiddleware")
const sendInviteEmail = require("../../utils/sendInviteEmail")
const adminAuthRouter = express.Router()

adminAuthRouter.use(["/me/from/token", "/invite", "/signup"], expressJwt({ secret: process.env.SECRET }), adminsOnly)

// Invite a new admin to the team. Must be done by another admin.
// The request body should include name.first, name.last, and email
adminAuthRouter.post("/invite", async (req, res) => {
    if (!req.body.name || !req.body.name.first || !req.body.name.last || !req.body.email) {
        return res.status(400).send({ message: "You must include all required fields. Check the docs for more info." })
    }

    try {
        const newAdmin = new AdminUser(req.body)
        newAdmin.password = crypto.randomBytes(5).toString("hex")
        await newAdmin.save()
        const result = await sendInviteEmail(newAdmin.secure())
        return res.status(201).send({ user: newAdmin.secure(), message: result.message })
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

// Signup as an admin. Only available if you've been sent a link from the /invite endpoint
adminAuthRouter.post("/signup", async (req, res) => {
    try {
        const invitedUser = req.body
        invitedUser.admin = true
        const updatedAdmin = await AdminUser.findByIdAndUpdate(
            req.user._id,
            invitedUser,
            { new: true }
        )
        const token = jwt.sign(
            updatedAdmin.secure(),
            process.env.SECRET,
            { expiresIn: "24h" }
        )
        return res.status(201).send({ token, user: updatedAdmin.secure() })
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

// Regular login for existing admins
adminAuthRouter.post("/login", async (req, res) => {
    try {
        const admin = await AdminUser.findOne({ email: req.body.email })
        if (!admin) return res.status(401).send({ message: "Invalid email or password" })
        const isAuthorized = await admin.auth(req.body.password)
        if (isAuthorized) {
            const token = jwt.sign(
                admin.secure(),
                process.env.SECRET,
                { expiresIn: "24h" }
            )
            return res.send({ user: admin.secure(), token })
        }
        return res.status(401).send({ message: "Invalid email or password" })
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

// Get user's info based on the provided token (if page is refreshed, e.g.)
adminAuthRouter.get("/me/from/token", async (req, res) => {
    try {
        const admin = await AdminUser.findById(req.user._id)
        if (!admin) return res.status(404).send({ message: "User not found" })
        return res.status(200).send(user.secure())
    } catch (e) {
        console.error(e)
        return res.status(500).send(e)
    }
})

module.exports = adminAuthRouter
