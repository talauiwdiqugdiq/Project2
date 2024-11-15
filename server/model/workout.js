// importing the mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// defining the schema for the workout model
let workoutModel = mongoose.Schema(
  {
    Name: String,              // field for the name of the workout (string type)
    WorkoutType: String,       // field for the type of workout 
    ExerciseDetails: String,   // field for additional details or exercises involved
    Duration: Number,          // field for duration of the workout in minutes (number type)
    PerformanceRating: Number  // field for rating the performance (number type)
  },
  {
    collection: "Workout_tracker" // specifying the MongoDB collection name
  }
);

// exporting the model to be used in other parts of the application
module.exports = mongoose.model('Workout', workoutModel);
