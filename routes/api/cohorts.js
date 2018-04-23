const express = require("express");
const cohortRouter = express.Router();
const CohortModel = require("../../models/api/cohorts.js");

cohortRouter.route("/")
    .get((req, res) => {
        CohortModel.find(req.query, (err, cohorts) => {
            if (err) return res.send(err);
            res.status(200).send(cohorts);
        });
    })
    .post((req, res) => {
        const newCohort = new CohortModel(req.body);
        newCohort.save((err, savedCohort) => {
            if (err) return res.send(err);
            res.status(201).send(savedCohort);
        });
    })

module.exports = cohortRouter;