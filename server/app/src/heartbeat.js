var requestPromise = require('request-promise');
var cronJob = require("cron").CronJob;
var serverConfig = require('../config/serverConfig');
var masterServerConfig = require('../config/masterServerConfig');
var SHA256 = require("crypto-js/sha256");
var digestedServerSecret = SHA256(serverConfig.shared_server_secret).toString();

module.exports = function(){
	var heartBeat = {
		host: serverConfig.host,
		port: serverConfig.port,
		load: 0.0,
		key: digestedServerSecret
	};

	var options = {
	    uri : 'http://' + masterServerConfig.host + ':' + masterServerConfig.port + '/server',
	    method : 'PUT',
	    json: heartBeat
	};

	new cronJob("*/2 * * * * *", function() {
	    requestPromise(options)
	        .catch(console.error);
	}, null, true);
};