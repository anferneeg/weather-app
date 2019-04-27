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

	//GRABING UI ELEMENTS FOR TOMORROW
	let tomorrowTemp = document.querySelector('.tomorrow-temperature');
	let tomorrowSum = document.querySelector('.tomorrow-summary');
	let tomorrowTempHigh2 = document.querySelector('.tomorrow-temperaturehl.high');
	let tomorrowTempLow = document.querySelector('.tomorrow-temperaturehl.low');

	//GRABING UI ELEMENTS FOR 10 DAY
	// let forcastDate = document.querySelector('.forcast-date');
	// let forcastSummary = document.querySelector('.forcast-summary');
	// let forcastHighDegree = document.querySelector('.forcast-high-degree');
	// let forcastLowDegree = document.querySelector('.forcast-low-degree');
	// let forcastIcon = document.querySelector('.forcast-icon-wrapper');


	console.log(tomorrowTempHigh2, tomorrowTempLow);


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

				// FORMAT UNIX TIME (with moment.js)
				let currentDateFormat = moment.unix(time).format('llll');
				$('.currently-time').append(currentDateFormat);

				//DECONSTRUCT DATA FROM DAILY OBJECT (TOMORROW)
				const { icon: iconTomorrow } = data.daily.data[1];
				const { temperatureHigh: tomorrowTempHigh } = data.daily.data[1];
				const { summary: tomorrowSummary } = data.daily.data[1];
				const { temperatureMax: tomorrowTemperatureMax } = data.daily.data[1];
				const { temperatureMin: tomorrowTemperatureMin } = data.daily.data[1];
				// console.log(tomorrowTemperatureMax.toFixed(0), tomorrowTemperatureMin.toFixed(0));

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
							<div><canvas class="hourly-icon" width="45" height="45" data-icon="${item.icon}"></canvas></div>
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


				//DECONSTRUCT DATA FROM CURRENTLY DAILY OBJECT (FORCAST)
				let forcastData = data.daily.data;
				console.log(forcastData);
				// forcastData.splice(-12, 12);

				let { time: forcastDate, temperatureHigh: forcastTempHigh, temperatureLow: forcastTempLow, icon: iconForcast, summary: forcastSummary } = data.daily.data;

				// FORMAT UNIX TIME (with moment.js)
				forcastDate = moment.unix(forcastDate).format('llll')
				// console.log(moment(time).format('MMMM Do YYYY, h:mm:ss a'));
				console.log(forcastDate);

				forcastData = function () {
					let forcastObj = forcastData.map(function (item) {
						//console.log(item);

						let forcastHtml = `
						<div class="forcast-wrapper">
						<div class="forcast-date-summary">
						  <div class="forcast-date">${item.forcastDate}</div>
						  <div class="forcast-summary">${item.icon}</div>
						</div>
						<div><canvas class="forcast-icon-wrapper" width="45" height="45" data-icon-forcast="${item.icon}"></canvas></div>
						<div class="forcast-temp-wrapper">
						  <div class="forcast-high">
							<div class="forcast-high-degree">${item.temperatureHigh.toFixed(0)}
							  <span>°</span>
							</div>
						  </div>
						  <div class="forcast-low">
							<div class="forcast-low-degree">${item.temperatureLow.toFixed(0)}
							  <span>°</span>
							</div>
						  </div>
						</div>
					  </div>`;
						return forcastHtml;

					});

					$('.forcast-container').append(forcastObj);

				}();

				//Location split
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
				// currentDate.textContent = time;
				currentTemp.textContent = temperature.toFixed(0);
				currentIcon.appendChild = icon;
				currentSummary.textContent = summary;
				currentTempHigh.textContent = temperatureMax.toFixed(0);
				currentTempLow.textContent = temperatureMin.toFixed(0);

				//SET DOM ELEMENTS FORM THE API Tomorrow 
				tomorrowTemp.textContent = tomorrowTempHigh.toFixed(0);
				tomorrowSum.textContent = tomorrowSummary;
				// tomorrowTempHigh2.textContent = tomorrowTemperatureMax.toFixed(0);
				tomorrowTempLow.textContent = tomorrowTemperatureMin.toFixed(0);


				//CALL CURRENT MAIN ICONS
				setIcons(icon, document.querySelector('.w-icon'));
				setTomorrowIcons(iconTomorrow, document.querySelector('.t-w-icon'));

				//CALL HOURLY ICONS
				setHourIcons(document.getElementsByClassName('hourly-icon'));

				//CALL FORCAST ICONS
				setForcastIcons(document.getElementsByClassName('forcast-icon-wrapper'));



			}).catch(function (error) {
				console.log("Something went wrong");
			});
		});
	}

	//Skycon icon for Today screen
	function setIcons(icon, iconID) {
		const skycons = new Skycons({
			color: "#fff",
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

	//Skycon icon for Today Hourly 
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
			skycons.play();
			skycons.set(weatherIcon, Skycons[currentHourIcon]);
		}
	}

	//Skycon icon for Tomorrow screen 
	function setTomorrowIcons(iconTomorrow, iconID) {
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
		const tomorrowIcon = iconTomorrow.replace(/-/g, '_').toUpperCase();
		skycons.play();
		skycons.set(iconID, Skycons[tomorrowIcon]);
	}

	//Skycon icon for Forcast 
	function setForcastIcons(iconID) {

		for (let i = 0; i < iconID.length; i++) {
			const forcastIcon = iconID[i];
			const icon = forcastIcon.getAttribute('data-icon-forcast');

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
			const forcastWeatherIcon = icon.replace(/-/g, '_').toUpperCase();
			skycons.play();
			skycons.set(forcastIcon, Skycons[forcastWeatherIcon]);
		}
	}



	//Today Date current
	// currentDate = new Date();
	// $('.currently-time').append(currentDate.toDateString());

	// let currentDateFormat = moment(time).format('llll');
	// $('.currently-time').append(currentDateFormat);

	//Tomorrows Date
	var d = new Date();
	var tomorrowDate = d.getDate() + 1;
	d.setDate(tomorrowDate);
	$('.tomorrow-time').append(d.toDateString());


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



