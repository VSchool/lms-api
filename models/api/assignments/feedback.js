const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const options = { discriminatorKey: "kind" };

const feedbackSchema = new Schema({
    instructor: {
        type: ObjectId,
        ref: "Users",
        required: true
    },
    assignment: {
        type: ObjectId,
        ref: "Assignments",
        required: true,
    },
    student: {
        type: ObjectId,
        ref: "Users",
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, options);

const Feedback = mongoose.model("Feedback", feedbackSchema);

//THIS COUNTS FOR BOTH PROJECTS AND EXERCISES:
const CodingFeedback = Feedback.discriminator("CodingFeedback", new Schema({
    filename: {
        type: String,
        required: true
    },
    extension: {
        type: String,
        required: true
    },
    lineNum: {
        type: Number,
        default: ""
    },
}, options))

const QuizFeedback = Feedback.discriminator("QuizFeedback", new Schema({
    questionNum: {
        type: Number,
        required: true
    },
}, options))


module.exports = {
    Feedback,
    CodingFeedback,
    QuizFeedback
}