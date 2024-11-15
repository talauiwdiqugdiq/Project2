// importing necessary modules
var express = require('express'); // express framework for building web applications
var router = express.Router(); // creating a router object to define routes
let mongoose = require('mongoose'); // importing mongoose for MongoDB operations

// importing the Workout model
let Workout = require('../model/workout.js'); 
const workout = require('../model/workout.js'); // redundant import, can be removed
let workoutController = require('../controllers/workout.js'); // importing the workout controller (not used in this code)

/* Read Operation - Get route for displaying the workout list */
router.get('/', async (req, res, next) => {
  try {
    // fetching all workout records from the database
    const WorkoutList = await Workout.find(); 
    // rendering the 'list' view template with the workout data
    res.render('Workout/list', {
      title: 'Workout Tracker', // page title
      WorkoutList: WorkoutList  // passing the list of workouts to the view
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Workout/list', {
      error: 'Error on the server'
    });
  }
});

/* Create Operation - Get route for displaying the Add Page */
router.get('/add', async (req, res, next) => {
  try {
    // rendering the 'add' view template to create a new workout
    res.render('Workout/add', {
      title: 'Create a Workout Tracker' // page title
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Workout/list', {
      error: 'Error on the server'
    });
  }
});

/* Create Operation - Post route for processing the Add Page */
router.post('/add', async (req, res, next) => {
  try {
    // creating a new workout object with data from the request body
    let newWorkout = Workout({
      "Name": req.body.Name,
      "WorkoutType": req.body.WorkoutType,
      "ExerciseDetails": req.body.ExerciseDetails,
      "Duration": req.body.Duration,
      "PerformanceRating": req.body.PerformanceRating,
      "FitnessGoalSetting": req.body.FitnessGoalSetting // optional field not defined in the model schema
    });
    // saving the new workout to the database
    Workout.create(newWorkout).then(() => {
      res.redirect('/workoutlist'); // redirecting to the workout list page after creation
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Workout/list', {
      error: 'Error on the server'
    });
  }
});

/* Update Operation - Get route for displaying the Edit Page */
router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id; // retrieving workout ID from the URL parameter
    const workoutToEdit = await Workout.findById(id); // fetching the workout data by ID
    // rendering the 'edit' view template with the fetched workout data
    res.render('Workout/edit', {
      title: 'Edit Workout Tracker', // page title
      Workout: workoutToEdit // passing the workout data to the view
    });
  } catch (err) {
    console.error(err); // logging error to the console
    next(err); // passing the error to the next middleware
  }
});

/* Update Operation - Post route for processing the Edit Page */
router.post('/edit/:id', async (req, res, next) => {
  try {
    let id = req.params.id; // retrieving workout ID from the URL parameter
    // creating an updated workout object with data from the request body
    let updatedWorkout = Workout({
      "_id": id, // ensuring the ID is set to the existing workout ID
      "Name": req.body.Name,
      "WorkoutType": req.body.WorkoutType,
      "ExerciseDetails": req.body.ExerciseDetails,
      "Duration": req.body.Duration,
      "PerformanceRating": req.body.PerformanceRating
    });
    // updating the workout in the database by ID
    Workout.findByIdAndUpdate(id, updatedWorkout).then(() => {
      res.redirect('/workoutlist'); // redirecting to the workout list page after update
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Workout/list', {
      error: 'Error on the server'
    });
  }
});

/* Delete Operation - Get route to perform Delete Operation */
router.get('/delete/:id', async (req, res, next) => {
  try {
    let id = req.params.id; // retrieving workout ID from the URL parameter
    // deleting the workout from the database by ID
    Workout.deleteOne({ _id: id }).then(() => {
      res.redirect('/workoutlist'); // redirecting to the workout list page after deletion
    });
  } catch (error) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Workout/list', {
      error: 'Error on the server'
    });
  }
});

// exporting the router to be used in the main application
module.exports = router;
