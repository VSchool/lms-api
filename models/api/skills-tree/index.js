const mongoose = require("mongoose");
const { Schema } = mongoose;

const SkillsTreeSchema = new Schema({
    studentId:{
        type: Schema.Types.ObjectId,
        ref: "Students",
        required: true
    },
    levelsCompleted: [{
        type: Schema.Types.ObjectId,
        ref: "Levels"
    }]
});

// Skills Tree Model
    // student: student ID
    // levelsCompleted: [branch level IDs]

// Branch Level Model
    // branchName: ("Web Applications")
    // branchId: ("wa")
    // skills: ["Understand JSON", "Forms", etc.]
    // level: 1