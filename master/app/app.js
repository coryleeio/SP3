var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session      = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database')

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
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(session({ 
	secret: process.env.SESSION_KEY,
	store: new MongoStore({mongooseConnection: mongoose.connection})
})); 
require('./config/passport')(passport); 
app.use(passport.initialize());
app.use(passport.session()); 

require('./config/routes')(app, passport);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
