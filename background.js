var APIKEY = 'ef7ef9ab6fdd433465ec52e4be88dc7a';
var latitude = 0;
var longitude = 0;
var lastResult;
var city;

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }

    if (callback) {
    	callback();
    }
}

function showPosition(position) {
	console.log("background:showPosition");
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;

	getJSON('https://api.darksky.net/forecast/' + APIKEY + '/' + 
		latitude + ',' + longitude + '?units=si&lang=en&exclude=minutely,hourly,alerts,flags', 
		function(result) {
			chrome.browserAction.setIcon({
	            path: "/" + result.currently.icon + ".png"
	        });

	       
	        lastResult = result;
	        
	        city = getCity(latitude, longitude);
	        
console.log(result);

		});

	

}

function getCity(latitude, longitude) {
console.log("background:getCity");
  var apikey = '309d3d51fce0479781ae3da0de676238';
  
  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' +encodeURIComponent(apikey)
    + '&q=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
  // see full list of possible response codes:
  // https://opencagedata.com/api#codes

    if (request.status == 200){ 
    	console.log("background:success");
      // Success!
      var data = JSON.parse(request.responseText);
     city=data.results[0].components.city + " " +data.results[0].components.country;
      console.log("background: "+ city);
      return city;
    } else if (request.status <= 500){ 
    // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log(data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
return null;




}
function getJSON(url, callback) {
	var x = new XMLHttpRequest();
	x.open('GET', url);
	x.responseType = 'json';
	x.onload = function() {
		callback(x.response);
	};
	x.send();
}

function showError(error) {
	var statusDiv = document.getElementById("status");

    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}

chrome.runtime.onInstalled.addListener(function() {
	chrome.alarms.create("forecast", {
	   delayInMinutes: 0,
	   periodInMinutes: 100
	});
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
	getLocation();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("background onMessage.addListener")
	if (request.action == "getCurrentForecast") {
		if (lastResult) {
			
			sendResponse(lastResult);
		} else {
			getLocation(function() {
				
				sendResponse(lastResult) ;
			});
		}
	}


	if (request.action == "getCity") {
		if (city) {
			console.log("city is in if "+ city);
			sendResponse(city);
		} else {
			getLocation(function() {
				
				sendResponse(city) ;
			});
		}
	}
});
