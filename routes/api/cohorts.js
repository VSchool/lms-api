const express = require("express");
const cohortRouter = express.Router();
const CohortModel = require("../../models/api/cohorts.js");

cohortRouter.route("/")
    .get((req, res) => {
        if (req.user.permissions.admin) {
            CohortModel.find(req.query, (err, cohorts) => {
                if (err) return res.send(err);
                res.status(200).send(cohorts);
            });
        } else {
            res.status(403).send({ message: "Admin authorization required" })
        }
    })
    .post((req, res) => {
        const newCohort = new CohortModel(req.body);
        newCohort.save((err, savedCohort) => {
            if (err) return res.send(err);
            res.status(201).send(savedCohort);
        });
    });

cohortRouter.route("/:id")
    .get((req, res) => {
        if (req.user.permissions.admin) {
            CohortModel.findById(req.params.id, (err, cohort) => {
                if (err) return res.send(err);
                res.status(200).send(cohort);
            })
        } else {
            //ensures student user can only access their own cohort
            CohortModel.findById(req.user.id), (err, cohort) => {
                if (err) return res.send(err);
                res.status(200).send(cohort);
            }
        }
    })


module.exports = cohortRouter;