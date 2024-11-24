// importing the mongoose library to interact with MongoDB

//const { Collection, default: mongoose } = require("mongoose");

const mongoose = require("mongoose");

let surveyModel = mongoose.Schema({
    Name: String,
    JobTitle: String,
    Satisfaction: String,
    DurationOfEmployment: Number,
    Improvments: String
},

{
    collection:"Job_surveys"
});
module.exports =mongoose.model('Survey',surveyModel);
