const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2
const { BaseUser } = require("../models/user")
const jwt = require("jsonwebtoken")

async function sendInviteEmail(invitedUser) {
    try {
        let transporter
        if (process.env.NODE_ENV === "production") {
            const oauth2Client = new OAuth2(
                process.env.GOOGLE_OAUTH_CLIENT_ID,
                process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                "https://developers.google.com/oauthplayground"
            )

            oauth2Client.setCredentials({
                refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
            })

            const tokens = await oauth2Client.refreshAccessToken()
            const accessToken = tokens.credentials.access_token
            transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.VSCHOOL_EMAIL,
                    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                    refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })
            await transporter.verify()

        } else if (process.env.NODE_ENV === "development") {
            const account = await nodemailer.createTestAccount()
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                auth: {
                    user: account.user,
                    pass: account.pass
                },
            })
        }

        const token = jwt.sign(invitedUser, process.env.SECRET, { expiresIn: "24h" })
        let html, subject
        if (invitedUser.type === "AdminUser" && invitedUser.admin) {
            subject = "Here's your MantisLMS Admin Signup Link"
            html = `
                            <div style="text-align: center">
                                <h2>MantisLMS Admin Invite</h2>
                                <p>Welcome to the team, ${invitedUser.name.first}! Here's your invite to join MantisLMS as an administrator.</p>
                                <p>Treat this email and link as if it were a password - don't give it out to anyone, and delete it when you're done signing up.</p>
                                <a href=${process.env.NEW_USER_SIGNUP_URL + "?token=" + token }>Click here to sign up as an admin.</a>
                            </div>
                            `
        } else {
            subject = "Here's your MantisLMS Student Signup Link"
            html = `
                            <div style="text-align: center">
                                <h2>MantisLMS Student Invite</h2>
                                <p>Welcome to the ${invitedUser.courses[0].course.name} course at V School, ${invitedUser.name.first}! Here's your invite to join MantisLMS, V School's learning management system.</p>
                                <p>The link below will expire in 24 hours, so make sure to sign up ASAP.</p>
                                <p>Treat this email and link as if it were a password - don't give it out to anyone, and delete the email when you're done signing up.</p>
                                <a href=${process.env.NEW_USER_SIGNUP_URL + "?token=" + token }>Click here to sign up for MantisLMS.</a>
                            </div>
                    `
        }

        const message = {
            from: `V School <${process.env.VSCHOOL_EMAIL}>`,
            to: invitedUser.email,
            subject,
            html
        }

        const info = await transporter.sendMail(message)
        if (process.env.NODE_ENV === "production") {
            return { message: `Email successfully sent to ${info.accepted.join(", ")}` }
        } else {
            const messageUrl = nodemailer.getTestMessageUrl(info)
            console.log(messageUrl)
            return { message: messageUrl }
        }
    } catch (e) {
        console.error(e)
        // Remove the user that was invited so they can be invited again without duplication errors
        await BaseUser.findByIdAndRemove(invitedUser._id)
        throw new Error(e)
    }
}

module.exports = sendInviteEmail
