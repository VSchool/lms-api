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
    comment: {
        type: String,
        required: true
    }
}, options);

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

//THIS COUNTS FOR BOTH PROJECTS AND EXERCISES:
const CodingFeedbackModel = FeedbackModel.discriminator("CodingFeedback", new Schema({
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

const NonCodingFeedbackModel = FeedbackModel.discriminator("NonCodingFeedback", new Schema({
    questionNum: {
        type: Number,
        required: true
    },
}, options))


module.exports = {
    FeedbackModel,
    CodingFeedbackModel,
    NonCodingFeedbackModel
}