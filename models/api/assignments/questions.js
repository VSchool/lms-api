const mongoose = require("mongoose");
const { Schema } = mongoose;

const assignmentQSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "Questions",
        required: true
    },
    answerProvided: {
        type: Schema.Types.Mixed,
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
});

const AssignmentQModel = new assignmentQSchema("AssignmentQ", assignmentQSchema);



