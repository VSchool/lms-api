const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const options = { discriminatorKey: "kind", timestamps: true };

const DaySchema = new Schema({
    cohort: {
        type: ObjectId,
        required: true,
        ref: "Cohort"
    },
    student: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    date: {
        type: Date,
        required: true
    },
    label: String
}, options);

const Day = mongoose.model("Day", DaySchema);

const InSessionDay = Day.discriminator("InSessionDay", new Schema({
    sequence: {
        type: Number,
        required: true
    },
    attended: {
        type: Boolean,
        default: true
    },
    tardy: {
        type: Boolean,
        default: false
    }
}, options));

module.exports = {
    Day,
    InSessionDay
};