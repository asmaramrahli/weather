function sendMessage() {
	chrome.runtime.sendMessage({action: "getCurrentForecast"}, function(response) {
		if (response == null) {
			
			setTimeout(sendMessage, 2000); 
		} else {
			
			
			showResult(response);

		}
	});


	chrome.runtime.sendMessage({action: "getCity"}, function(response) {
		if (response == null) {
			
			setTimeout(sendMessage, 2000);
		} else {
			//alert(response);
			
			showCity(response);

		}
	});
}

function showResult(response) {
	console.log("popup:showResult");
	var statusDiv = document.getElementById("status");
	var icoImg = document.getElementById("ico");
	var temperatureDiv = document.getElementById("temperature");
	var cityNameDiv=document.getElementById("cityName");
	var t1 = document.getElementById("t1");
	var ico1 = document.getElementById("ico1");
	var t2 = document.getElementById("t2");
	var ico2 = document.getElementById("ico2");
	var t3 = document.getElementById("t3");
	var ico3 = document.getElementById("ico3");
	var next = document.getElementById("next");
	var hum=document.getElementById("hum");

	next.style.display="block";
	next.message="Next 3 Days";

	statusDiv.textContent = response.currently.summary;

	temperatureDiv.style.display = "block";
	temperatureDiv.textContent = response.currently.temperature.toString().split('.')[0] + "˚C";

	hum.style.display="block";
	hum.textContent="with "+response.currently.humidity*100+"% of humidity";

	t1.style.display = "block";
	t1.textContent = response.daily.data[1].apparentTemperatureMax.toString()+ "˚C";
	ico1.style.display = "block";
	ico1.src = chrome.extension.getURL("/" + response.daily.data[1].icon + ".png");
	t2.style.display = "block";
	t2.textContent = response.daily.data[2].apparentTemperatureMax.toString()+ "˚C";
	ico2.style.display = "block";
	ico2.src = chrome.extension.getURL("/" + response.daily.data[2].icon + ".png");
	t3.style.display = "block";
	t3.textContent = response.daily.data[3].apparentTemperatureMax.toString()+ "˚C";
	ico3.style.display = "block";
	ico3.src = chrome.extension.getURL("/" + response.daily.data[3].icon + ".png");

	icoImg.style.display = "block";
	icoImg.src = chrome.extension.getURL("/" + response.currently.icon + ".png");

	cityNameDiv.style.display = "block";
	cityNameDiv.textContent=response.message.currently;

	

}

function showCity(response) {
	console.log("popup:showResult");
	
	var cityNameDiv=document.getElementById("cityName");



	//alert(response);
	cityNameDiv.style.display = "block";
	cityNameDiv.textContent=response;

	

}


document.addEventListener('DOMContentLoaded', sendMessage);
