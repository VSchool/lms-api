const mongoose = require("mongoose")
const { Schema } = mongoose

const courseSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        enum: ["part-time", "full-time", "mastery-based"],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Course", courseSchema)
