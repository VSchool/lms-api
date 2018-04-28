const mongoose = require("mongoose");

const { Schema } = mongoose;

const courseMaterialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    courseworkUrl: {
        type: String,
        required: true
    },
    branchLevels: [{
        type: Schema.Types.ObjectId,
        ref: "BranchLevel",
    }],
    assignmentType: {
        type: String,
        required: true,
        enum: ["project", "exercise", "interview", "quiz"]
    }
});

const CourseMaterialModel = mongoose.model("CourseMaterial", courseMaterialSchema);

module.exports = CourseMaterialModel;