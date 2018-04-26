const mongoose = require("mongoose");
const { Schema } = mongoose;

const skillsTreeSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Students",
        required: true
    },
    levelsCompleted: [{
        type: Schema.Types.ObjectId,
        ref: "BranchLevels"
    }]
});

const SkillsTreeModel = mongoose.model("SkillsTrees", skillsTreeSchema);
