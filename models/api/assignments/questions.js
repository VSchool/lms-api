const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId, Mixed } = Schema.Types;

const assignmentQSchema = new Schema({
    question: {
        type: ObjectId,
        ref: "Questions",
        required: true
    },
    answerProvided: {
        type: Mixed,
    },
    isCorrect: Boolean
});

module.exports = mongoose.model("AssignmentQ", assignmentQSchema);



