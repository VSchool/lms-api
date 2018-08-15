const mongoose = require("mongoose")
const { Schema } = mongoose

const moduleSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    name: String,
    description: {
        type: String,
        required: true
    },
    sequenceNum: {
        type: Number,
        required: true
    },
    // The array of required coursework items placed on this side
    // of the relationship so that a given CourseworkItem can be
    // reused across different modules, i.e. across more than one
    // course (FSJS & Frontend React, e.g.)
    requiredCoursework: [{
        type: Schema.Types.ObjectId,
        ref: "CourseworkItem"
    }]
})

module.exports = mongoose.model("Module", moduleSchema)
