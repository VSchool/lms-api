const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind" };

const feedbackSchema = new Schema({
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignments",
        required: true,
    },
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
    comment: {
        type: String,
        required: true
    }
}, options);

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

const QuizFeedbackModel = FeedbackModel.discriminator(new Schema({
    questionNum: {
        type: Number,
        required: true
    },
}, options))


module.exports = {
    FeedbackModel,
    QuizFeedbackModel
}