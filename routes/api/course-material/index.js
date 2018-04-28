const express = require("express");

const CourseMaterialModel = require("../../../models/api/coursework-material/");

const courseMaterialRouter = express.Router();

// courseMaterialRouter.use("/:courseMatId/questions", require("./questions.js"));

courseMaterialRouter.route("/")
    .get((req, res) => {
        CourseMaterialModel.find(req.query, (err, material) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(material);
        })
    })
    .post((req, res) => {
        if (req.user.permissions.admin) {
            const newMaterial = new CourseMaterialModel(req.body);
            newMaterial.save((err, material) => {
                if (err) return res.status(500).send(err);
                res.status(201).send(material);
            })
        } else {
            res.status(401).send({ message: "Admin authorization required" })
        }
    })
    .delete((req, res) => {
        if (req.user.permissions.admin) {
            CourseMaterialModel.deleteMany(req.query, (err) => {
                if (err) return res.status(500).send(err);
                res.status(204).send();
            })
        } else {
            res.status(401).send({ message: "Admin authorization required" })
        }
    })

courseMaterialRouter.route("/:id")
    .get((req, res) => {
        CourseMaterialModel.findById(req.params.id, (err, materials) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(materials);
        })
    })


module.exports = courseMaterialRouter;
