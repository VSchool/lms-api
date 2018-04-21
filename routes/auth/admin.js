//dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");

//imports
const { AdminUserModel } = require("../../models/users.js");

const adminAuthRouter = express.Router();

adminAuthRouter.use(["/authorize", "/signup"], expressJwt({ secret: process.env.SECRET }));

//ROOT SIGN UP FOR DEV ONLY
// adminAuthRouter.route("/root-signup")
//     .post((req, res) => {
//         AdminUserModel.findOne({ email: req.body.email }, (err, foundUser) => {
//             if (err) return res.send(err);
//             if (foundUser) return res.status(401).send({ success: false, message: "User already exists" });
//             const admin = new AdminUserModel(req.body);
//             admin.save((err, user) => {
//                 if (err) return res.send(err);
//                 const token = jwt.sign({
//                     id: user._id,
//                     permissions: user.permissions
//                 }, config.SECRET, { expiresIn: 1000 * 60 * 60 });
//                 res.status(201).send({ success: true, token, user: user.secure() });
//             })
//         })
//     });
adminAuthRouter.route("/signup")
    .post((req, res) => {
        if (!req.user.email) return res.status(403).send({ message: "User not authorized to be an admin" });
        AdminUserModel.findOne({ email: req.user.email }, (err, foundUser) => {
            if (err) return res.send(err);
            if (foundUser) return res.status(401).send({ success: false, message: "User already exists" });
            const admin = new AdminUserModel({ ...req.body, ...req.user });
            admin.save((err, user) => {
                if (err) return res.send(err);
                const token = jwt.sign({
                    id: user._id,
                    permissions: user.permissions
                }, process.env.SECRET, { expiresIn: 1000 * 60 * 60 });
                res.status(201).send({ success: true, token, user: user.secure() });
            })
        })
    })
adminAuthRouter.route("/login")
    .post((req, res) => {
        AdminUserModel.findOne({ email: req.body.email }, (err, user) => {
            if (err) return res.send(err);
            if (!user) return res.status(401).send({ success: false, message: "Invalid username" })
            user.auth(req.body.password, (err, isAuthorized) => {
                if (err) return res.send(err);
                if (isAuthorized) {
                    const token = jwt.sign({
                        id: user._id,
                        permissions: user.permissions
                    }, process.env.SECRET, { expiresIn: 1000 * 60 * 60 });
                    res.status(201).send({ success: true, token, user: user.secure() });
                } else {
                    return res.status(401).send({ success: false, message: "Invalid password" });
                }
            })
        })
    });

adminAuthRouter.route("/authorize")
    .post((req, res) => {
        const { email, name } = req.body;
        if (req.user.permissions.rootAccess) {
            AdminUserModel.findOne({ email }, (err, foundUser) => {
                if (err) return res.send(err);
                if (foundUser) return res.status(401).send({ success: false, message: "User already exists" });
                const token = jwt.sign(req.body, process.env.SECRET, { expiresIn: 1000 * 60 * 60 * 24 });
                nodemailer.createTestAccount((err, account) => {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        auth: {
                            user: account.user,
                            pass: account.pass
                        },
                    });
                    const message = {
                        from: "bturner@vschool.io",
                        to: email,
                        subject: "VSchool LMS Admin Authorization",
                        html: `
                                <div style="text-align: center">
                                    <h3>VSchool LMS Admin Authorization</h3>
                                    <p>Name: ${name.f} ${name.l}</p>
                                    <a href="#">http://lms.vschool.io/admin-signup?token=${token}</p>
                                </div>
                                `
                    }
                    transporter.sendMail(message, (err, info) => {
                        if (err) return res.status(500).send({ message: err.message });
                        res.status(200).send({ messageId: nodemailer.getTestMessageUrl(info) });
                    })
                })
            });
        } else {
            res.status(403).send({ message: "Unauthorized action" });
        }
    })
// authorize an admin:
// create a jwt using user email as payload
// send link containing jwt via email

//click on link, add token to local storage
// send to signup page


module.exports = adminAuthRouter;




