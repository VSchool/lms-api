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
            if (foundUser) return res.status(403).send({ message: "User already exists" });
            const admin = new AdminUserModel({ ...req.body, ...req.user });
            admin.save((err, user) => {
                if (err) return res.send(err);
                const token = jwt.sign({
                    id: user._id,
                    permissions: user.permissions
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
                        permissions: user.permissions
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
    .post((req, res) => {
        const { email, name } = req.body;
        if (req.user.permissions.rootAccess) {
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
                    const fakeOrigin = "http://lms.vschool.io/admin-signup";
                    const message = {
                        from: "bturner@vschool.io",
                        to: email,
                        subject: "VSchool LMS Admin Authorization",
                        html: `
                                <div style="text-align: center">
                                    <h3>VSchool LMS Admin Authorization</h3>
                                    <p>Name: ${name.f} ${name.l}</p>
                                    <a href="#">${fakeOrigin}?token=${token}</p>
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
            res.status(403).send({ message: "Admin access denied" });
        }
    });

// GIVE ADMIN ROOT ACCESS
adminAuthRouter.route("/authorize/allow-root/:id")
    .post((req, res) => {
        if (req.user.permissions.rootAccess) {
            AdminUserModel.findById(req.params.id, (err, admin) => {
                if (err) return res.send(err);
                if (!admin) return res.status(404).send({ message: "User not found" });
                if (admin.permissions.rootAccess) return res.status(403).send({ message: "Admin already has root access" });
                if (!admin.permissions.admin) return res.status(403).send({ message: "User is not an admin" })
                admin.update({ $set: { "permissions.rootAccess": true } }, { new: true }, (err, ok) => {
                    if (err) return res.send(err);
                    res.status(200).send(admin.secure());
                })
            })
        } else {
            res.status(403).send({ message: "Root access denied" })
        }
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




