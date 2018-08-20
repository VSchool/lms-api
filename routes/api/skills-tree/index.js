const express = require("express")
const skillsTreeRouter = express.Router()
const SkillsTree = require("../../../models/skills-tree-branches/")
const { adminsOnly, studentsOnly } = require("../../../customMiddleware")

skillsTreeRouter.route("/")
    .get(adminsOnly, (req, res) => {
        SkillsTree.find(req.query, (err, foundTree) => {
            if (err) return res.send(err)
            res.status(200).send(foundTree)
        })
    })
    .post(studentsOnly, (req, res) => {
        const body = { student: req.user.id }
        const newTree = new SkillsTree(body)
        newTree.save((err, savedTree) => {
            if (err) return res.send(err)
            res.status(201).send(savedTree)
        })
    })

skillsTreeRouter.route("/:id")
    .get((req, res) => {
        if (req.user.admin) {
            SkillsTree.findById(req.params.id, (err, foundTree) => {
                if (err) return res.send(err)
                res.status(200).send(foundTree)
            })
        } else {
            SkillsTree.findOne({ _id: req.params.id, student: req.user.id }, (err, foundTree) => {
                if (err) return res.send(err)
                res.status(200).send(foundTree)
            })
        }
    })

skillsTreeRouter.route("/:id/add-skills")
    .post(studentsOnly, (req, res) => {
        SkillsTree.findOne({ _id: req.params.id, student: req.user.id }, (err, tree) => {
            if (err) return res.send(err)
            req.body.levels.forEach(level => tree.levelsCompleted.addToSet(level))
            tree.save((err, newTree) => {
                if (err) return res.send(err)
                res.status(201).send(newTree)
            })
        })
    })

module.exports = skillsTreeRouter
