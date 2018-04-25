const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind" }

// STILL NEED SKILLS TREE REFERENCE
const assignmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    assignmentType: {
        type: String,
        enum: ["project", "exercise"],
        default: "exercise"
    },
    courseworkUrl: {
        type: String,
        required: true
    },
    dateAssigned: {
        type: Schema.Types.ObjectId,
        ref: "Days",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        enum: ["assigned", "unassigned", "submitted", "completed"],
        default: "unassigned",
        required: true
    },
}, options);

const AssignmentsModel = mongoose.model("Assignments", AssignmentsModel);

module.exports = {
    AssignmentsModel
}