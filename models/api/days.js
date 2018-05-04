const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const options = {discriminatorKey: "kind", timestamps: true};

const DaySchema = new Schema({
    cohort: {
        type: ObjectId,
        required: true,
        ref: "Cohorts"
    },
    student: {
        type: ObjectId,
        required: true,
        ref: "Users"
    },
    date: {
        type: Date,
        required: true
    },
    label: String
}, options);

const DayModel = mongoose.model("Days", DaySchema);

const InSessionDay = DayModel.discriminator("InSessionDay", new Schema({
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
    DayModel,
    InSessionDay
};