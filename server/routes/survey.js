// importing necessary modules
var express = require('express'); // express framework for building web applications
var router = express.Router(); // creating a router object to define routes
let mongoose = require('mongoose'); // importing mongoose for MongoDB operations

// importing the survey model
let Survey = require('../model/survey.js'); 
const survey = require('../model/survey.js'); // redundant import, can be removed
let surveyController = require('../controllers/survey.js'); // importing the survey controller (not used in this code)
function requireAuth(req,res,next)
{
  if(!req.isAuthenticated())
  {
    return res.redirect('/login');
  }
  next();
}
/* Read Operation - Get route for displaying the surveys list */
router.get('/', async (req, res, next) => {
  try {
    // fetching all survey records from the database
    const SurveyList = await Survey.find(); 
    // rendering the 'list' view template with the survey data
    res.render('Survey/list', {
      title: 'Survey Tracker', // page title
      displayName: req.user ? req.user.displayName:'',
      SurveyList: SurveyList  // passing the list of surveys to the view
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Survey/list', {
      error: 'Error on the server'
    });
  }
});

/* Create Operation - Get route for displaying the Add Page */
router.get('/add', async (req, res, next) => {
  try {
    // rendering the 'add' view template to create a new survey
    res.render('Survey/add', {
      title: 'Create a Survey Tracker' // page title
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Survey/list', {
      error: 'Error on the server'
      
    });
  }
});

/* Create Operation - Post route for processing the Add Page */
router.post('/add', async (req, res, next) => {
  try {
    // creating a new survey object with data from the request body
    let newSurvey = Survey({
      "Name":req.body.Name,
      "JobTitle":req.body.JobTitle,
      "Satisfaction":req.body.Satisfaction,
      "DurationOfEmployment":req.body.DurationOfEmployment,
      "Improvments":req.body.Improvments
    });
    // saving the new survey to the database
    Survey.create(newSurvey).then(() => {
      res.redirect('/surveyslist'); // redirecting to the surveys list page after creation
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Survey/list', {
      error: 'Error on the server'
    });
  }
});

/* Update Operation - Get route for displaying the Edit Page */
router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id; // retrieving survey ID from the URL parameter
    const surveyToEdit = await Survey.findById(id); // fetching the survey data by ID
    // rendering the 'edit' view template with the fetched survey data
    res.render('Survey/edit', {
      title: 'Edit Survey Tracker', // page title
      displayName: req.user ? req.user.displayName:'',
      Survey: surveyToEdit // passing the survey data to the view
    });
  } catch (err) {
    console.error(err); // logging error to the console
    next(err); // passing the error to the next middleware
  }
});

/* Update Operation - Post route for processing the Edit Page */
router.post('/edit/:id', async (req, res, next) => {
  try {
    let id = req.params.id; // retrieving survey ID from the URL parameter
    // creating an updated survey object with data from the request body
    let updatedSurvey = Survey({
      "_id": id, // ensuring the ID is set to the existing survey ID
      "Name":req.body.Name,
      "JobTitle":req.body.JobTitle,
      "Satisfaction":req.body.Satisfaction,
      "DurationOfEmployment":req.body.DurationOfEmployment,
      "Improvments":req.body.Improvments
    });
    // updating the survey in the database by ID
    Survey.findByIdAndUpdate(id, updatedSurvey).then(() => {
      res.redirect('/surveyslist'); // redirecting to the surveys list page after update
    });
  } catch (err) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('Survey/list', {
      error: 'Error on the server'
    });
  }
});

/* Delete Operation - Get route to perform Delete Operation */
router.get('/delete/:id', async (req, res, next) => {
  try {
    let id = req.params.id; // retrieving survey ID from the URL parameter
    // deleting the survey from the database by ID
    Survey.deleteOne({ _id: id }).then(() => {
      res.redirect('/surveyslist'); // redirecting to the survey list page after deletion
    });
  } catch (error) {
    console.error(err); // logging error to the console
    // rendering the 'list' view with an error message
    res.render('surveys/list', {
      error: 'Error on the server'
    });
  }
});

// exporting the router to be used in the main application
module.exports = router;
