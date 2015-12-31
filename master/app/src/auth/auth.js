var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var digestedServerSecret = SHA256(process.env.SERVER_REGISTRATION_SECRET);
var Server = require('../models/server.js');
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
        console.log("checking server key....");
        if(process.env.SERVER_REGISTRATION_SECRET == null) {
            res.sendStatus(500);
            return;
        }
        if(req.body.key != null 
            && req.body.key == digestedServerSecret){
            return next();
        }   
        res.sendStatus(401);
    }
};