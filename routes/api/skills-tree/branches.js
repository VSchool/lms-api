const express = require("express");
const branchLevelRouter = express.Router();

const BranchLevelModel = require("../../../models/api/skills-tree/branches.js");

branchLevelRouter.route("/")
    .get((req, res) => {
        if (req.user.permissions.admin) {
            BranchLevelModel.find(req.query, (err, foundBranches) => {
                if (err) return res.send(err);
                res.status(200).send(foundBranches);
            });
        } else {
            res.status(403).send({ message: "Admin authorization required" })
        }
    })
    .post((req, res) => {
        if (req.user.permissions.admin) {
            const newBranch = new BranchLevelModel(req.body);
            newBranch.save((err, savedBranch) => {
                if (err) return res.send(err);
                res.status(201).send(savedBranch);
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" })
        }
    })

module.exports = branchLevelRouter;