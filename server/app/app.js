var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var passportSocketIo = require("passport.socketio");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database');
var cookieParser = require('cookie-parser')
var auth      = require('./src/auth');

var preflightCheck = require('./config/preflightCheck')
([
	'MASTER_SERVER_HOST',
	'MASTER_SERVER_PORT',
	'HOST',
	'PORT',
	'SESSION_SECRET',
	'SERVER_REGISTRATION_SECRET'
]);

mongoose.connect(configDB.url, function(err) {
  if (err) {
    console.log("Could not connect to database");
    throw err;
  }
});
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,      
  secret:       process.env.SESSION_KEY,   
  store:        new MongoStore({mongooseConnection: mongoose.connection}),        
  success:      auth.onAuthorizeSuccess,  
  fail:         auth.onAuthorizeFail 
}));

require('./config/passport')(passport); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(cookieParser());

require('./src/heartbeat')();
require('./src/network').routes(app, io);
server.listen(3000);
