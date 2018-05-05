const mongoose = require("mongoose");

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const courseMaterialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [String],
    courseworkUrl: {
        type: String,
        required: true
    },
    branchLevels: [{
        type: ObjectId,
        ref: "BranchLevel",
    }],
    assignmentType: {
        type: String,
        required: true,
        enum: ["project", "exercise", "interview", "quiz"]
    }
});

module.exports = mongoose.model("CourseMaterial", courseMaterialSchema);