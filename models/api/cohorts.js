const mongoose = require("mongoose");
const { Schema } = mongoose;

const CohortSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    classType: {
        type: String,
        required: true,
        enum: ["FSJS", "XD"]
    },
    year: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true,
        enum: ["PT", "FT"]
    }
}, { timestamps: true });

const CohortModel = mongoose.model("Cohorts", CohortSchema);
module.exports = CohortModel;