const express = require("express");
const cohortRouter = express.Router();
const Cohort = require("../../models/api/cohorts");
const { adminsOnly } = require("../customMiddleware");

cohortRouter.route("/")
    .get(adminsOnly, (req, res) => {
        Cohort.find(req.query, (err, cohorts) => {
            if (err) return res.send(err);
            res.status(200).send(cohorts);
        });
    })
    .post(adminsOnly, (req, res) => {
        const newCohort = new Cohort(req.body);
        newCohort.save((err, savedCohort) => {
            if (err) return res.send(err);
            res.status(201).send(savedCohort);
        });
    });

cohortRouter.route("/:id")
    .get((req, res) => {
        Cohort.findById(req.params.id, (err, cohort) => {
            if (err) return res.send(err);
            if (!cohort) return res.status(404).send({ message: "Cohort not found" })
            res.status(200).send(cohort);
        });
    })
    .put(adminsOnly, (req, res) => {
        Cohort.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, cohort) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(cohort);
        })
    })
    .delete(adminsOnly, (req, res) => {
        Cohort.findByIdAndRemove(req.params.id, (err, cohort) => {
            if (err) return res.status(500).send(err);
            res.status(204).send();
        })
    })


module.exports = cohortRouter;