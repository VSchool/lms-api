const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind" }

const questionSchema = new Schema({
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignments",
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    //FOR LINKS TO IMAGES, SITES, ETC
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
    answerProvided: {
        type: Number,
        default: null
    }
}, options));

const TextQuestionModel = QuestionModel.discriminator("TextQuestions", new Schema({
    answerText: {
        type: String,
        required: true
    },
    answerProvided: {
        type: String,
        default: null
    }
}, options))

module.exports = {
    QuestionModel,
    MultChoiceQuestionModel,
    TextQuestionModel
}