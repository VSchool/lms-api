const mongoose = require("mongoose")
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const taskSchema = new Schema({
    // contains the meta data about this task
    coursework: {
        type: ObjectId,
        ref: "CourseworkItem",
        required: true
    },
    assignedTo: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        lowercase: true,
        enum: ["assigned", "submitted", "passed", "needs work"],
        default: "assigned",
        required: true
    },
    submissionUrl: String,
    feedback: String
}, { timestamps: true })  // add createdAt and updatedAt so we can better keep track of timeliness of their progress

module.exports = mongoose.model("Task", taskSchema)
