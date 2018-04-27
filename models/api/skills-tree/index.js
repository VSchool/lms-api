const mongoose = require("mongoose");
const { Schema } = mongoose;

const skillsTreeSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    levelsCompleted: [{
        type: Schema.Types.ObjectId,
        ref: "BranchLevels",
        required: true
    }]
});

const SkillsTreeModel = mongoose.model("SkillsTrees", skillsTreeSchema);

module.exports = SkillsTreeModel;
