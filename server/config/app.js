// importing necessary modules
let createError = require('http-errors'); // used for handling HTTP errors
let express = require('express'); // main framework for building web applications
let path = require('path'); // provides utilities for working with file and directory paths
let cookieParser = require('cookie-parser'); // middleware to parse cookies
let logger = require('morgan'); // HTTP request logger middleware

// initializing the Express application
let app = express();
let cors = require('cors');

// Create user model instance
let userModel = require('../model/User');
let User = userModel.User;

// importing route handlers
let indexRouter = require('../routes/index'); // main route (home page)
let usersRouter = require('../routes/users');
let surveyRouter = require('../routes/survey'); // route for survey-related endpoints

// view engine setup
app.set('views', path.join(__dirname, '../views')); // setting the directory for view templates
app.set('view engine', 'ejs'); // setting EJS as the template/view engine

// Express session and Passport middleware
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let flash = require('connect-flash');

// Implement user authentication using Passport
passport.use(User.createStrategy()); // Use Passport local strategy for user authentication
passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// initialize passport and sessions
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false
}));

// Initialize flash messages (for showing success or error messages)
app.use(flash());

// Set up Passport to manage user authentication and sessions
app.use(passport.initialize());
app.use(passport.session());

// Connecting to MongoDB using Mongoose
const mongoose = require('mongoose');
let DB = require('./db'); // importing the database configuration (URI)
mongoose.connect(DB.URI)
  .then(() => console.log('Connected with MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// MongoDB connection handling
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error')); // logs error if connection fails
mongoDB.once('open', () => {
  console.log("Connected with MongoDB"); // logs message once connected to the database
});

// setting up middleware for logging requests and parsing incoming data
app.use(logger('dev')); // logs HTTP requests in the console
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false })); // parses incoming requests with URL-encoded payloads
app.use(cookieParser()); // parses cookies from incoming requests
app.use(express.static(path.join(__dirname, '../../public'))); // serves static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../../node_modules'))); // serves static files from 'node_modules'

// Defining routes for the application
app.use('/', indexRouter); // Using 'indexRouter' for the root URL
app.use('/surveyslist', surveyRouter); // Using 'surveyRouter' for the '/surveyslist' URL

// catch 404 errors and forward to error handler
app.use(function (req, res, next) {
  next(createError(404)); // creates a 404 error and passes it to the next middleware
});

// error handler middleware
app.use(function (err, req, res, next) {
  // setting local variables, only providing error details in development mode
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // rendering the error page
  res.status(err.status || 500); // sets the response status code (defaulting to 500 if not specified)
  res.render('error', { title: 'Error' }); // renders the 'error' view with a title
});

// exporting the 'app' module to be used in other files
module.exports = app;
