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
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        enum: ["assigned", "unassigned", "submitted", "completed"],
        default: "unassigned",
        required: true
    },
}, options);

const AssignmentsModel = mongoose.model("Assignments", AssignmentsModel);

//BOTH PROJECTS AND EXERCISES:
const CodingAssignmentsModel = AssignmentsModel.discriminator("CodingAssignments", new Schema({
    githubUrl: {
        type: String,
        required: true
    },
    assignmentType: {
        type: String,
        required: true,
        enum: ["project", "exercise"]
    }
}, options));

//INTERVIEW AND QUIZZES 
const NonCodingAssignmentsModel = AssignmentsModel.discriminator("NonCodingAssignments", new Schema({
    assignmentType: {
        type: String,
        required: true,
        enum: ["quiz", "interview"]
    }
}, options))

module.exports = {
    AssignmentsModel,
    CodingAssignmentsModel,
    NonCodingAssignmentsModel
}