const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

// Set mongoose's promise to global promise
mongoose.promise = global.Promise;

// Set isProduction boolean
const isProduction = process.env.NODE_ENV === 'production';

// Initiate the app
const app = express();

// Configure the app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: {maxAge: 60000 }, resave:false, saveUninitialized: false }));
if (!isProduction) app.use(errorHandler());

// Configure Mongoose
mongoose.connect('mongodb://localhost/jwt-play');
mongoose.set('debug', true);

// Models & routes
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

// Error handlers and middleware
if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(8000, () => console.log('Server running on port 8000'));
