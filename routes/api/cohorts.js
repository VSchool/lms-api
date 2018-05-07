const express = require("express");
const cohortRouter = express.Router();
const Cohort = require("../../models/api/cohorts");

cohortRouter.route("/")
    .get((req, res) => {
        if (req.user.admin) {
            Cohort.find(req.query, (err, cohorts) => {
                if (err) return res.send(err);
                res.status(200).send(cohorts);
            });
        } else {
            res.status(403).send({ message: "Admin authorization required" })
        }
    })
    .post((req, res) => {
        if (req.user.admin) {
            const newCohort = new Cohort(req.body);
            newCohort.save((err, savedCohort) => {
                if (err) return res.send(err);
                res.status(201).send(savedCohort);
            });
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    });

cohortRouter.route("/:id")
    .get((req, res) => {
        Cohort.findById(req.params.id, (err, cohort) => {
            if (err) return res.send(err);
            if (!cohort) return res.status(404).send({ message: "Cohort not found" })
            res.status(200).send(cohort);
        });
    })
    .put((req, res) => {
        if (req.user.admin) {
            Cohort.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, cohort) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(cohort);
            })
        } else {
            res.status(403).send({ message: "Admin authorization required" });
        }
    })
    .delete((req, res) => {
        if (req.user.admin) {
            Cohort.findByIdAndRemove(req.params.id, (err, cohort) => {
                if (err) return res.status(500).send(err);
                res.status(204).send();
            })
        } else {
            res.status(403).send({ message: "Root authorization required" });
        }
    })


module.exports = cohortRouter;