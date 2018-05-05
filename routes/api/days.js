const express = require("express");
const dayRouter = express.Router();

//models
const { Day, InSessionDay } = require("../../models/api/days");

//utils
const { daySortCallback } = require("./utils");

dayRouter.route("/")
    .get((req, res) => {
        if (req.user.admin) {
            Day.find(req.query, (err, days) => {
                if (err) return res.send(err);
                res.status(200).send(days.sort(daySortCallback));
            });
        } else {
            Day.find({ student: req.user.id, cohort: req.user.cohortId, ...req.query }, (err, days) => {
                if (err) return res.send(err);
                res.status(200).send(days.sort(daySortCallback));
            })
        }
    })
    .post((req, res) => {
        InSessionDay.insertMany(req.body.inSessions, (err, inSessions) => {
            if (err) return res.status(500).send(err);
            Day.insertMany(req.body.noSessions, (err, noSessions) => {
                if (err) return res.status(500).send(err);
                res.status(201).send([...inSessions, ...noSessions].sort(daySortCallback));
            })
        })

    });

module.exports = dayRouter;
