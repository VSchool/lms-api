const mongoose = require("mongoose")
const { Schema } = mongoose

const branchLevelSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ["Static Websites", "Web Applications", "Programming Principles", "Version Control", "Database", "HTTP/API", "Troubleshooting/Debugging", "Project Management", "Deployment", "Problem Solving", "Career Prep"]
    },
    code: {
        type: String,
        required: true,
        enum: ["sw","wa", "pp","vc","db", "http","td", "pm", "dep", "ps", "cp"]
    },
    skills: [{
        type: String
    }],
    level: {
        type: Number,
        required: true
    },
    courseworkItemsToComplete: [{
        type: Schema.Types.ObjectId,
        ref: "Task"
    }]
})

module.exports = mongoose.model("BranchLevel", branchLevelSchema)
