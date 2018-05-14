const express = require("express");
const courseMaterialRouter = express.Router();
const CourseMaterial = require("../../../models/api/course-material/");
const Cohort = require("../../../models/api/cohorts");
const { adminsOnly } = require("../customMiddleware");

courseMaterialRouter.route("/")
    .get((req, res) => {
        if (req.user.admin) {
            CourseMaterial.find(req.query, (err, material) => {
                if (err) return res.status(500).send(err);
                res.status(200).send(material);
            })
        } else {
            Cohort.findById(req.user.cohortId, (err, cohort) => {
                if (err) return res.status(500).send(err);
                if (!cohort) return res.status(404).send({ message: "Cohort not found" });
                CourseMaterial.find({ classType: cohort.classType, ...req.query }, (err, material) => {
                    if (err) return res.status(500).send(err);
                    res.status(200).send(material);
                })
            })

        }

    })
    .post(adminsOnly, (req, res) => {
        const newMaterial = new CourseMaterial(req.body);
        newMaterial.save((err, material) => {
            if (err) return res.status(500).send(err);
            res.status(201).send(material);
        })
    })
    .delete(adminsOnly, (req, res) => {
        CourseMaterial.deleteMany(req.query, (err) => {
            if (err) return res.status(500).send(err);
            res.status(204).send();
        })
    })

courseMaterialRouter.route("/:id")
    .get((req, res) => {
        CourseMaterial.findById(req.params.id, (err, materials) => {
            if (err) return res.status(500).send(err);
            if (!materials) return res.status(404).send({ message: "Material not found" })
            res.status(200).send(materials);
        })
    })
    .put(adminsOnly, (req, res) => {
        CourseMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedMat) => {
            if (err) return res.status(500).send(err);
            if (!updatedMat) return res.status(404).send({ message: "Material not found" });
            res.status(200).send(updatedMat);
        })
    })
    .delete(adminsOnly, (req, res) => {
        CourseMaterial.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.status(500).send(err);
            res.status(204).send();
        })
    })

module.exports = courseMaterialRouter;
