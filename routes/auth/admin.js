//dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");

//imports
const { AdminUserModel } = require("../../models/users.js");
const adminAuthRouter = express.Router();
const { adminsOnly } = require("../api/customMiddleware");

adminAuthRouter.use(["/authorize", /* "/signup" */], expressJwt({ secret: process.env.SECRET }));

//ROOT SIGN UP
adminAuthRouter.route("/signup")
    .post((req, res) => {
        // if (!req.user.email) return res.status(403).send({ message: "User not authorized to be an admin" });
        AdminUserModel.findOne({ email: req.body.email }, (err, foundUser) => {
            if (err) return res.send(err);
            if (foundUser) return res.status(403).send({ message: "User already exists" });
            const admin = new AdminUserModel(req.body);
            admin.save((err, user) => {
                if (err) return res.send(err);
                const token = jwt.sign({
                    id: user._id,
                    admin: user.admin
                }, process.env.SECRET, { expiresIn: 1000 * 60 * 60 });
                res.status(201).send({ token, user: user.secure() });
            })
        })
    })
adminAuthRouter.route("/login")
    .post((req, res) => {
        AdminUserModel.findOne({ email: req.body.email }, (err, user) => {
            if (err) return res.send(err);
            if (!user) return res.status(401).send({ message: "Invalid username" })
            user.auth(req.body.password, (err, isAuthorized) => {
                if (err) return res.send(err);
                if (isAuthorized) {
                    const token = jwt.sign({
                        id: user._id,
                        admin: user.admin
                    }, process.env.SECRET, { expiresIn: 1000 * 60 * 60 });
                    res.status(201).send({ token, user: user.secure() });
                } else {
                    return res.status(401).send({ message: "Invalid password" });
                }
            })
        })
    });

// INVITE USER AS ADMIN
adminAuthRouter.route("/authorize/invite-admin")
    .post(adminsOnly, (req, res) => {
        const { email, name } = req.body;
        AdminUserModel.findOne({ email }, (err, foundUser) => {
            if (err) return res.send(err);
            if (foundUser) return res.status(403).send({ message: "User already exists" });
            const token = jwt.sign(req.body, process.env.SECRET, { expiresIn: 1000 * 60 * 60 * 24 });
            // TEST EMAIL ACCOUNT
            nodemailer.createTestAccount((err, account) => {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    auth: {
                        user: account.user,
                        pass: account.pass
                    },
                });
                // LINK WILL POINT TO ACTUAL SIGNUP/LANDING PAGE
                const message = {
                    from: process.env.ADMIN_SENDER_EMAIL,
                    to: email,
                    subject: "VSchool LMS Admin Authorization",
                    html: `
                                <div style="text-align: center">
                                    <h3>VSchool LMS Admin Authorization</h3>
                                    <p>Name: ${name.f} ${name.l}</p>
                                    <a href="#">${process.env.ADMIN_APP_ORIGIN_URL}?token=${token}</p>
                                </div>
                                `
                }
                transporter.sendMail(message, (err, info) => {
                    if (err) return res.status(500).send({ message: err.message });
                    res.status(200).send({ messageId: nodemailer.getTestMessageUrl(info) });
                })
            })
        });
    });

// VERIFY ADMIN HAS VALID TOKEN
adminAuthRouter.route("/authorize")
    .get((req, res) => {
        AdminUserModel.findById(req.user.id, (err, user) => {
            if (err) return res.send(err);
            if (!user) return res.status(401).send({ message: "User doesn't exist" })
            res.status(200).send(user.secure())
        });
    });


module.exports = adminAuthRouter;




