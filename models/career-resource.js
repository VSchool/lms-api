const mongoose = require("mongoose")
const { Schema } = mongoose

const careerResourceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: String,
    description: String,
    imgUrl: String
})

module.exports = mongoose.model("CareerResource", careerResourceSchema)
