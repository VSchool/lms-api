const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind", timestamps: true };

const DaySchema = new Schema({
    cohort: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Cohorts"
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    date: {
        type: Date,
        required: true  
    },
    label: {
        type: String
    }

}, options);

const DayModel = mongoose.model("Days", DaySchema);

const InSessionDay = DayModel.discriminator("InSessionDay", new Schema({
    sequence: {
        type: Number,
        required: true
    },
    attended: {
        type: Boolean,
        default: false
    },
    
}, options));

module.exports = {
    DayModel,
    InSessionDay
};