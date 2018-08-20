//dependencies
const express = require("express")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

//imports
const { AdminUser } = require("../../models/user.js")
const adminAuthRouter = express.Router()
const { adminsOnly } = require("../../customMiddleware")

adminAuthRouter.use(["/authorize", "/invite", "/signup"], expressJwt({ secret: process.env.SECRET }), adminsOnly)

// Regular login for existing admins
adminAuthRouter.post("/login", async (req, res) => {
    try {
        const user = await AdminUser.findOne({ email: req.body.email })
        if (!user) return res.status(401).send({ message: "Invalid email or password" })

        // Todo: Change .auth method to be promise-based
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
    const { email, name } = req.body
    try {
        const foundUser = await AdminUser.findOne({ email })
        if (foundUser) return res.status(403).send({ message: "User already exists" })
        const newAdmin = req.body
        newAdmin.admin = true
        const token = jwt.sign(newAdmin, process.env.SECRET, { expiresIn: "24h" })
        if (process.env.NODE_ENV === "production") {
            // Todo: send real email using gmail with OAuth2 OR a service like Sendgrid
            // (Gmail with plain un + pw is likely to go to junk mail these days)
            // Todo: Check if Hubspot has an SMTP to use instead of Sendgrid
        } else {
            // Create an on-the-fly email and send a fake email using ethereal.email
            // for use in development
            nodemailer.createTestAccount((err, account) => {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    auth: {
                        user: account.user,
                        pass: account.pass
                    },
                })

                const message = {
                    from: process.env.VSCHOOL_EMAIL,
                    to: email,
                    subject: "VSchool LMS Admin Authorization",
                    html: `
                            <div style="text-align: center">
                                <h2>MantisLMS Admin Invite</h2>
                                <p>Welcome to the team, ${name.first}! Here's your invite to join MantisLMS as an administrator.</p>
                                <p>Treat this email and link as if it were a password - don't give it out to anyone, and delete it when you're done signing up.</p>
                                <a href=${process.env.ADMIN_SIGNUP_URL + "?token=" + token + "&email=" + email + "&firstName=" + name.first + "&lastName=" + name.last }>Click here to sign up as an admin.</a>
                            </div>
                            `
                }
                transporter.sendMail(message, (err, info) => {
                    const messageUrl = nodemailer.getTestMessageUrl(info)
                    console.log(messageUrl)
                    return res.send({ messageId: messageUrl })
                })
            })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send(err)
    }
})

// Signup as an admin. Only available if you've been sent a link from the /invite endpoint
adminAuthRouter.post("/signup", async (req, res) => {
    try {
        const foundUser = await AdminUser.findOne({ email: req.body.email })
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
