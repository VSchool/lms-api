const express = require("express")
const courseworkItemRouter = express.Router()
const CourseworkItem = require("../../../models/coursework-item/")
const Course = require("../../../models/course")
const { adminsOnly } = require("../../../customMiddleware")

courseworkItemRouter.route("/")
    .get((req, res) => {
        if (req.user.admin) {
            CourseworkItem.find(req.query, (err, material) => {
                if (err) return res.status(500).send(err)
                return res.status(200).send(material)
            })
        } else {
            Course.findById(req.user.cohortId, (err, cohort) => {
                if (err) return res.status(500).send(err)
                if (!cohort) return res.status(404).send({ message: "Cohort not found" })
                CourseworkItem.find({ classType: cohort.classType, ...req.query }, (err, material) => {
                    if (err) return res.status(500).send(err)
                    return res.status(200).send(material)
                })
            })
        }
    })
    .post(adminsOnly, (req, res) => {
        const newMaterial = new CourseworkItem(req.body)
        newMaterial.save((err, material) => {
            if (err) return res.status(500).send(err)
            return res.status(201).send(material)
        })
    })
    .delete(adminsOnly, (req, res) => {
        CourseworkItem.deleteMany(req.query, (err) => {
            if (err) return res.status(500).send(err)
            return res.status(204).send()
        })
    })

courseworkItemRouter.route("/:id")
    .get((req, res) => {
        CourseworkItem.findById(req.params.id, (err, materials) => {
            if (err) return res.status(500).send(err)
            if (!materials) return res.status(404).send({ message: "Material not found" })
            return res.status(200).send(materials)
        })
    })
    .put(adminsOnly, (req, res) => {
        CourseworkItem.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedMat) => {
            if (err) return res.status(500).send(err)
            if (!updatedMat) return res.status(404).send({ message: "Material not found" })
            return res.status(200).send(updatedMat)
        })
    })
    .delete(adminsOnly, (req, res) => {
        CourseworkItem.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.status(500).send(err)
            return res.status(204).send()
        })
    })

module.exports = courseworkItemRouter
