var Server = require('../models/server.js');
var serverConfig = require('../../config/serverConfig');
module.exports = {
    isLoggedIn: function(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    },
    serverKeyIsValid: function(req, res, next) {
        if(serverConfig.serverRegistrationSecret == null) {
            res.sendStatus(500);
            return;
        }
        if(req.body.key != null 
            && req.body.key == serverConfig.serverRegistrationSecret){
            return next();
        }   
        res.sendStatus(401);
    }
};