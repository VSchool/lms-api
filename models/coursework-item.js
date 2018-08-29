const mongoose = require("mongoose")
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const courseworkItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    taskType: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["assignment", "lesson", "interview", "quiz"]
    },
    moduleId: {
        type: ObjectId,
        ref: "Module",
    },
    url: {
        type: String,
        required: true
    },
    sequenceNum: {
        type: Number,
        required: true
    },
    submissionRequired: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("CourseworkItem", courseworkItemSchema)
