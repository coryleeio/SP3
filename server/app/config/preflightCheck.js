var checkPresenceEnvironmentVariables = function(arr){
	arr.forEach(function(element){
		if(process.env[element] == null) {
		  msg = "Must define " + element;
		  throw msg;
		}
	});
}

module.exports = checkPresenceEnvironmentVariables;