const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind" }

// STILL NEED SKILLS TREE REFERENCE
const assignmentSchema = new Schema({
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
    dateAssigned: {
        type: Schema.Types.ObjectId,
        ref: "Days",
        required: true
    },
    branchLevels: [{
        type: Schema.Types.ObjectId,
        ref: "BranchLevel",
    }],
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        enum: ["assigned", "unassigned", "submitted", "passed", "failed"],
        default: "unassigned",
        required: true
    },
    assignmentType: {
        type: String,
        required: true,
        enum: ["project", "exercise", "interview", "quiz"]
    }
}, options);

const AssignmentsModel = mongoose.model("Assignments", assignmentSchema);

//BOTH PROJECTS AND EXERCISES:
const CodingAssignmentsModel = AssignmentsModel.discriminator("CodingAssignments", new Schema({
    githubUrl: {
        type: String,
        required: true
    }
}, options));

const QuizModel = AssignmentsModel.discriminator("QuizModel", new Schema({

}, options))

module.exports = {
    AssignmentsModel,
    CodingAssignmentsModel,
    QuizModel
}