const jwt = require("jsonwebtoken")
const { AdminUser, StudentUser } = require("../models/user")
const Course = require("../models/course")
const sendInviteEmail = require("./sendInviteEmail")


// This function doesn't use try... catch internally, so when you use it
// make sure to include a `.catch()` in your promise resolution to catch
// any errors that might occur
async function inviteNewUser(invitedUser) {
    try {
        let foundUser
        if (invitedUser.admin) {
            foundUser = await AdminUser.findOne({ email: invitedUser.email })
        } else {
            foundUser = await StudentUser.findOne({ email: invitedUser.email })
        }

        if (foundUser) return Promise.reject(new Error("User already exists"))

        // Get the full course info from the course id
        invitedUser.course = await Course.findById(invitedUser.course)
        if (process.env.NODE_ENV === "production") {
            // Todo: send real email using gmail with OAuth2 OR a service like Sendgrid
            // (Gmail with plain un + pw is likely to go to junk mail these days)
            // Todo: Check if Hubspot has an SMTP to use instead of Sendgrid
        } else {
            // Create an on-the-fly email and send a fake email using ethereal.email
            // for use in development
            const result = await sendInviteEmail(invitedUser)
            return result
        }
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = inviteNewUser
