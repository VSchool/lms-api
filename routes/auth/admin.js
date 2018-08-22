const express = require("express")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const { AdminUser } = require("../../models/user.js")
const { adminsOnly } = require("../../customMiddleware")
const { inviteNewUser } = require("../../utils/inviteNewUser")
const adminAuthRouter = express.Router()

adminAuthRouter.use(["/authorize", "/invite", "/signup"], expressJwt({ secret: process.env.SECRET }), adminsOnly)

// Regular login for existing admins
adminAuthRouter.post("/login", async (req, res) => {
    try {
        const { email } = req.body
        const user = await AdminUser.findOne({ email })
        console.log(user)
        if (!user) return res.status(401).send({ message: "Invalid email or password" })

        // Todo: Change .auth method to be promise-based using util.promisify
        user.auth(req.body.password, (err, isAuthorized) => {
            if (err) throw err
            if (isAuthorized) {
                const token = jwt.sign(
                    user.secure(),
                    process.env.SECRET,
                    { expiresIn: "24h" }
                )
                return res.send({ user: user.secure(), token })
            } else {
                return res.status(401).send({ message: "Invalid email or password" })
            }
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(err)
    }
})

// Get user's info based on the provided token (if page is refreshed, e.g.)
adminAuthRouter.get("/authorize", async (req, res) => {
    try {
        const user = await AdminUser.findById(req.user.id)
        if (!user) return res.status(404).send({ message: "User doesn't exist" })
        return res.status(200).send(user.secure())
    } catch (err) {
        if (err) return res.send(err)
    }
})

// Invite a new admin to the team. Must be done by another admin.
adminAuthRouter.post("/invite", async (req, res) => {
    try {
        const invitedUser = req.body
        invitedUser.admin = true
        const response = await inviteNewUser(invitedUser)
        return res.send(response.message)
    } catch (e) {
        return res.status(500).send(e.message)
    }
})

// Signup as an admin. Only available if you've been sent a link from the /invite endpoint
adminAuthRouter.post("/signup", async (req, res) => {
    try {
        const foundUser = await AdminUser.findOne({ email: req.user.email })
        if (foundUser) return res.status(400).send({ message: "A user with that email already exists" })
        const admin = new AdminUser(req.body)
        const user = await admin.save()
        const token = jwt.sign(
            user.secure(),
            process.env.SECRET,
            { expiresIn: "24h" }
        )
        return res.status(201).send({ token, user: user.secure() })
    } catch (err) {
        console.error(err)
        if (err) return res.status(500).send(err)
    }
})

module.exports = adminAuthRouter
