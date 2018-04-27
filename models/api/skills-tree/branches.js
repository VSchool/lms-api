const mongoose = require("mongoose");
const { Schema } = mongoose;

const branchLevelSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ["Static Websites", "Web Applications", "Programming Principles", "Version Control", "Database", "HTTP/API", "Troubleshooting/Debugging", "Project Management", "Deployment","Problem Solving", "Career Prep"]
    },
    branchCode: {
        type: String,
        required: true,
        enum: ["sw","wa", "pp","vcs","db", "http","t/d", "pm", "d", "ps", "cp"]
    },
    skills: [{
        type: String
    }],
    level: {
        type: Number,
        required: true
    }
});

const BranchLevelModel = mongoose.model("BranchLevel", branchLevelSchema);

module.exports = BranchLevelModel;