const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind" }

const questionSchema = new Schema({
    courseMaterial: {
        type: Schema.Types.ObjectId,
        ref: "CourseMaterial",
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    href:{
        type: String,
    }
}, options);

const QuestionModel = mongoose.model("Questions", questionSchema);

const MultChoiceQuestionModel = QuestionModel.discriminator("MultChoiceQuestions", new Schema({
    options: [{
        type: String,
        required: true
    }],
    correctIndex: {
        type: Number,
        required: true
    },
}, options));

const TextQuestionModel = QuestionModel.discriminator("TextQuestions", new Schema({
    answerText: {
        type: String,
        required: true
    },
}, options))

module.exports = {
    QuestionModel,
    MultChoiceQuestionModel,
    TextQuestionModel
}