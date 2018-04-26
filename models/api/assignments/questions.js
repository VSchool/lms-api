const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { discriminatorKey: "kind" }

const questionSchema = new Schema({
    assignment: {
        type: Schema.Types.ObjectId,
        required: true
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

const MultChoiceQuestionModel = mongoose.model("MultChoiceQuestions", new Schema({
    options: [{
        type: String,
        required: true
    }],
    correctIndex: {
        type: Number,
        required: true
    },
    answerProvided: {
        type: Number
    }
}, options));

const TextQuestionModel = mongoose.model("TextQuestions", new Schema({
    answerText: {
        type: String,
        required: true
    },
    answerProvided: {
        type: String
    }
}, options))

module.exports = {
    QuestionModel,
    MultChoiceQuestionModel,
    TextQuestionModel
}