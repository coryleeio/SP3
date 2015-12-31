var requestPromise = require('request-promise');
var cronJob = require("cron").CronJob;
var serverConfig = require('../config/serverConfig');
var masterServerConfig = require('../config/masterServerConfig');

module.exports = function(){
	var heartBeat = {
		host: serverConfig.host,
		port: serverConfig.port,
		load: 0.0,
		key: masterServerConfig.serverRegistrationSecret
	};
	var masterServerUrl = 'http://' + masterServerConfig.host + ':' + masterServerConfig.port + '/server';
	var options = {
	    uri : masterServerUrl,
	    method : 'PUT',
	    json: heartBeat
	};
	new cronJob("*/2 * * * * *", function() {
	    requestPromise(options)
	        // .catch(console.error);
	}, null, true);
};