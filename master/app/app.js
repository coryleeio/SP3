var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session      = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database')
var preflightCheck = require('./config/preflightCheck')
([
  'SESSION_SECRET',
  'HOST', 
  'PORT',
  'CORS_CLIENT_URL'
]);

var app = express();
mongoose.connect(configDB.url, function(err) {
  if (err) {
    console.log("Could not connect to database");
    throw err;
  }
});
mongoose.connection.db.dropCollection('servers', function(err, result) {
	if(err) {
		console.log(err);
	}
	console.log("Removed old servers from db")
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({ 
	secret: process.env.SESSION_SECRET,
	store: new MongoStore({mongooseConnection: mongoose.connection})
})); 
require('./config/passport')(passport); 
app.use(passport.initialize());
app.use(passport.session()); 

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_CLIENT_URL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require('./config/routes')(app, passport);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
