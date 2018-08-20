const mongoose = require("mongoose")
const { Schema } = mongoose

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: String
})

module.exports = mongoose.model("Event", eventSchema)
