//DARKSKY API KEY cc776ae16966c9515b6e9ef5c31fd6e5
// https://api.darksky.net/forecast/cc776ae16966c9515b6e9ef5c31fd6e5/37.8267,-122.4233


window.addEventListener('load', function () {

	let latitude;
	let longitude;
	let geoAccuracy;
	const apiKey = 'cc776ae16966c9515b6e9ef5c31fd6e5';

	//GRABING UI ELEMENTS
	let currentLocation = document.querySelector('.timezone');
	let currentDate = document.querySelector('.currently-time');
	let currentTemp = document.querySelector('.currently-temperature');
	let currentIcon = document.querySelector('.currently-icon');
	let currentSummary = document.querySelector('.currently-summary');
	let currentTempHigh = document.querySelector('.temperaturehl.high');
	let currentTempLow = document.querySelector('.temperaturehl.low');

	let currentHourTime = document.querySelector('.hourly-time');
	let currentHourIcon = document.querySelector('.hourly-icon');
	let currentHourDegree = document.querySelector('.hourly-degree');



	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (showPosition) {
			latitude = showPosition.coords.latitude
			longitude = showPosition.coords.longitude
			geoAccuracy = showPosition.coords.accuracy.toFixed(1);

			console.log(latitude, longitude);

			const api = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?units=auto`

			console.log(api);

			//GRAB DATA FROM DARKSKY API

			$.ajax({
				url: api,
				method: 'GET',
				dataType: 'jsonp',
			}).then(function (data) {
				console.log(data);

				//Hide Loading screen
				$(".loading-container").fadeOut();

				//DECONSTRUCT DATA FROM CURRENTLY OBJECT
				const { time, temperature, summary, icon } = data.currently;
				const { timezone } = data;
				const { temperatureMax } = data.daily.data[0];
				const { temperatureMin } = data.daily.data[0];

				//DECONSTRUCT DATA FROM HOURLY OBJECT
				let currentHourly = data.hourly.data;
				console.log(currentHourly.splice(-12, 12));
				currentHourly.splice(-12, 12);

				currentHourly = function () {
					let currentHourObj = currentHourly.map(function (item) {
						//console.log(item);

						//Format timestamp
						let hourFormat = item.time;
						hourFormat = new Date(hourFormat * 1000);
						hourFormat = hourFormat.toLocaleString({ hourCycle: 'h12' }).split(",");
						hourFormat = hourFormat[1].replace(":00:00", " ").toUpperCase();
						//console.log(hourFormat);

						let currentHourHtml = `
						<div class="hourly-wrapper">
							<div class="hourly-time">${hourFormat}</div>
							<div class=""><canvas class="hourly-icon" width="45" height="45" data-icon="${item.icon}"></canvas></div>
							<div class="hourly-degree">${item.temperature.toFixed(0)}<span>°</span></div>
					    </div>`;
						return currentHourHtml;

					});
					// currentHourObj.filter(function (item) {
					// 	let currentHourFiltered = item.temperature
					// 	//console.log(currentHourFilter);
					// 	return currentHourFiltered
					// })
					$('.hourly-container').append(currentHourObj);

				}();


				let location = timezone.split('/');
				location.shift();
				// console.log(location);
				// console.log(time);

				// console.log(temperature);
				// console.log(`icon: ${icon}`);
				// console.log(summary);

				//console.log(`Temp high: ${temperatureMax}`);
				//console.log(`Temp low: ${temperatureMin}`);

				//SET DOM ELEMENTS FORM THE API w-currently-container
				currentLocation.textContent = location;
				currentDate.textContent = time;
				currentTemp.textContent = temperature.toFixed(0);
				currentIcon.appendChild = icon;
				currentSummary.textContent = summary;
				currentTempHigh.textContent = temperatureMax.toFixed(0);
				currentTempLow.textContent = temperatureMin.toFixed(0);


				//SET CURRENT MAIN ICONS
				setIcons(icon, document.querySelector('.w-icon'));

				//SET HOURLY ICONS
				//setHourIcons(icon, document.querySelector('.hourly-icon'));
				setHourIcons(document.getElementsByClassName('hourly-icon'));



			}).catch(function (error) {
				console.log("Something went wrong");
			});
		});
	}

	//Skycon
	function setIcons(icon, iconID) {
		const skycons = new Skycons({
			color: "white",
			monochrome: false,
		});
		// console.log(skycons);
		// 	var skycons = new Skycons({
		// 		"monochrome": false,
		// 		"colors" : {
		// 		"cloud" : "#F00"
		// 	}
		//  });
		const currentIcon = icon.replace(/-/g, '_').toUpperCase();
		skycons.play();
		skycons.set(iconID, Skycons[currentIcon]);
	}

	function setHourIcons(iconID) {

		for (let i = 0; i < iconID.length; i++) {
			const weatherIcon = iconID[i];
			const icon = weatherIcon.getAttribute('data-icon');

			const skycons = new Skycons({
				color: "white",
				monochrome: false,
			});
			// console.log(skycons);
			// 	var skycons = new Skycons({
			// 		"monochrome": false,
			// 		"colors" : {
			// 		"cloud" : "#F00"
			// 	}
			//  });
			const currentHourIcon = icon.replace(/-/g, '_').toUpperCase();
			//skycons.play();
			skycons.set(weatherIcon, Skycons[currentHourIcon]);
		}
	}

	//Date convert
	currentDate = new Date();
	$('.currently-time').append(currentDate.toDateString());


	//Tab Nav

	$(document).ready(function () {

		$('ul.tabs li').click(function () {
			var tab_id = $(this).attr('data-tab');

			$('ul.tabs li').removeClass('current');
			$('.tab-content').removeClass('current');

			$(this).addClass('current');
			$("#" + tab_id).addClass('current');
		})

	})


})



