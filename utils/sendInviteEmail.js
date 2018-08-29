const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

async function sendInviteEmail(invitedUser) {
    try {
        const account = await nodemailer.createTestAccount()
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            auth: {
                user: account.user,
                pass: account.pass
            },
        })

        const token = jwt.sign(invitedUser, process.env.SECRET, { expiresIn: "24h" })
        let html, subject
        if (invitedUser.type === "AdminUser" && invitedUser.admin) {
            subject = "Here's your MantisLMS Admin Signup Link"
            html = `
                            <div style="text-align: center">
                                <h2>MantisLMS Admin Invite</h2>
                                <p>Welcome to the team, ${invitedUser.name.first}! Here's your invite to join MantisLMS as an administrator.</p>
                                <p>Treat this email and link as if it were a password - don't give it out to anyone, and delete it when you're done signing up.</p>
                                <a href=${process.env.ADMIN_SIGNUP_URL + "?token=" + token }>Click here to sign up as an admin.</a>
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
                                <a href=${process.env.STUDENT_SIGNUP_URL + "?token=" + token }>Click here to sign up for MantisLMS.</a>
                            </div>
                            `
        }

        const message = {
            from: process.env.VSCHOOL_EMAIL,
            to: invitedUser.email,
            subject,
            html
        }

        const info = await transporter.sendMail(message)
        const messageUrl = nodemailer.getTestMessageUrl(info)
        console.log(messageUrl)
        return { message: messageUrl }
    } catch (e) {
        console.error(e)
        throw new Error(e)
    }
}

module.exports = sendInviteEmail
