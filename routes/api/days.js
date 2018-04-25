const express = require("express");
const dayRouter = express.Router();

const { DayModel, InSessionDay } = require("../../models/api/days.js");

dayRouter.route("/")
    .get((req, res) => {
        DayModel.find(req.query, (err, days) => {
            if (err) return res.send(err);
            res.status(200).send(days);
        });
    })
    .post((req, res) => {
        const { inSession } = req.query;
        let newDay;
        if (inSession)
            newDay = new InSessionDay(req.body);
        else
            newDay = new DayModel(req.body);
        newDay.save((err, savedDay) => {
            if (err) return res.send(err);
            res.status(201).send(savedDay);
        });
    });


module.exports = dayRouter;