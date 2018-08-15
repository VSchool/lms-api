/*
* Commenting this file out until we decide to implement our own quizzing system
* Bob Ziroll - August 15th, 2018
* */

// const mongoose = require("mongoose")
// const { Schema } = mongoose
// const { ObjectId } = Schema.Types
//
// const options = { discriminatorKey: "kind" }
//
// const questionSchema = new Schema({
//     courseworkItem: {
//         type: ObjectId,
//         ref: "CourseworkItem",
//         required: true,
//     },
//     questionText: {
//         type: String,
//         required: true
//     },
//     questionNum: {
//         type: Number,
//         required: true,
//     },
//     href: String,
// }, options)
//
// const Question = mongoose.model("Question", questionSchema)
//
// const MultChoiceQuestion = Question.discriminator("MultChoiceQuestion", new Schema({
//     options: [{
//         type: String,
//         required: true
//     }],
//     correctIndex: {
//         type: Number,
//         required: true
//     },
// }, options))
//
// const TextQuestion = Question.discriminator("TextQuestion", new Schema({
//     answerText: {
//         type: String,
//         required: true
//     },
// }, options))
//
// module.exports = {
//     Question,
//     MultChoiceQuestion,
//     TextQuestion
// }