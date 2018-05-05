const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const options = {discriminatorKey: "kind"}

const questionSchema = new Schema({
    courseMaterial: {
        type: ObjectId,
        ref: "CourseMaterial",
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    href: String,
}, options);

const QuestionModel = mongoose.model("Question", questionSchema);

const MultChoiceQuestionModel = QuestionModel.discriminator("MultChoiceQuestion", new Schema({
    options: [{
        type: String,
        required: true
    }],
    correctIndex: {
        type: Number,
        required: true
    },
}, options));

const TextQuestionModel = QuestionModel.discriminator("TextQuestion", new Schema({
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