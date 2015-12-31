var scopes = ['https://www.googleapis.com/auth/plus.me','profile', 'email'];
var network = require('./network');

function checkAuth() {
  if(googleClientId != null && googleClientId != "" && googleClientId != undefined && googleClientId != 'undefined') {
    gapi.auth.authorize({client_id: googleClientId, scope: scopes, immediate: true}, handleAuthResult);
  }
  else {
    var playButton = $(".main-login");
    playButton.click(handlePlayClick);
    var googleButton = $(".google-login");
    var facebookButton = $(".facebook-login");
    googleButton.css('display', 'none');
    facebookButton.css('display', 'none');
  }

}

// Idempotent auth handler.
function handleAuthResult(authResult) {
  var googleButton = $(".google-login");
  var facebookButton = $(".facebook-login");
	var playButton = $(".main-login");
	if (authResult && !authResult.error) {
      // authenticated
      googleButton.css('display', 'none');
      facebookButton.css('display', 'none');
      playButton.text("Play");
      makeApiCall();
    } else {
      // not authenticated
      facebookButton.css('display', '');
      facebookButton.css('display', '');
      googleButton.click(handleGoogleClick);
	}
    playButton.click(handlePlayClick);
}

function handlePlayClick(event) {
  console.log('handling play click.')
    $.ajax({
       url: "/server",
       type: "GET",
       success: function(response) {
        var gameUrl = "http://" + response.host + ":" + response.port;
        network.connectToGameServer(gameUrl);
        $('.loginModal').modal('hide');
       },
       error: function(messages) {
         alert("Could not connect to server.");
       }
     });
}

function handleGoogleClick(event) {
// Step 3: get authorization to use private data
gapi.auth.authorize({client_id: googleClientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
	// Step 4: Load the Google+ API
	gapi.client.load('plus', 'v1').then(function() {
	  // Step 5: Assemble the API request
	  var request = gapi.client.plus.people.get({
	    'userId': 'me'
	  });
	  // Step 6: Execute the API request
	  request.then(function(resp) {
	  window.location.href = '/auth/google'; // authenticate with 
	    // Do Stuff
	  }, function(reason) {
	    console.log('Error: ' + reason.result.error.message);
	  });
	});
}


var intervalID = setInterval(function(){
  if(gapi != null) {
    window.setTimeout(checkAuth,1);
    clearInterval(intervalID);
  }
},500);


// Display modal when first arriving on page.
// Initialize tooltips
 $('.loginModal').modal({
     backdrop: 'static',
     keyboard: false
 })
 $('.loginModal').modal('show');
 $('[data-toggle="tooltip"]').tooltip(); 
