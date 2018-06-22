const express = require("express");
const branchLevelRouter = express.Router();
const BranchLevel = require("../../../models/api/skills-tree/branches.js");
const { adminsOnly } = require("../customeMiddleware");

// Middleware to check if user is admin. If no, reject.
branchLevelRouter.use(adminsOnly);

branchLevelRouter.route("/")
    .get((req, res) => {
        BranchLevel.find(req.query, (err, foundBranches) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(foundBranches);
        });

    })
    .post((req, res) => {
        const newBranch = new BranchLevel(req.body);
        newBranch.save((err, savedBranch) => {
            if (err) return res.status(500).send(err);
            res.status(201).send(savedBranch);
        });
    });

module.exports = branchLevelRouter;
