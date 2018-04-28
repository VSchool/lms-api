const mongoose = require("mongoose");

const { Schema } = mongoose;

const assignmentSchema = new Schema({
    dateAssigned: {
        type: Schema.Types.ObjectId,
        ref: "Days",
        required: true
    },
    courseMaterial: {
        type: Schema.Types.ObjectId,
        ref: "CourseMaterial",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    cohortId: {
        type: Schema.Types.ObjectId,
        ref: "Cohorts",
        required: true
    },
    status: {
        type: String,
        enum: ["assigned", "unassigned", "submitted", "passed", "failed"],
        default: "unassigned",
        required: true
    },
});

const AssignmentsModel = mongoose.model("Assignments", assignmentSchema);

module.exports = AssignmentsModel