const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const skillsTreeSchema = new Schema({
    student: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    levelsCompleted: [{
        type: ObjectId,
        ref: "BranchLevel",
        required: true
    }]
});

module.exports = mongoose.model("SkillsTree", skillsTreeSchema);
