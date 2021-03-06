
(function () {
    'use strict';
    var displayCity = document.getElementById("city");                  // get DOM references.
    var displayCountry = document.getElementById("country");
    var displayTemperature = document.getElementById("temperature");
    var displayDegreeSymbol = document.getElementById("degreeSymbol");
    var displayHumidity = document.getElementById("humidity");
    var displayConditions = document.getElementById("conditions");
    var displayWinds = document.getElementById("winds");
    var displayPressure = document.getElementById("pressure");
    var displaySunrise = document.getElementById("sunrise");
    var displaySunset = document.getElementById("sunset");
    var button = document.getElementById("unit");
    var backgroundPicture = "https://wallpaperboat.com/wp-content/uploads/2019/08/Background-Firewatch-Art-Landscape-Minimalism.jpg"; // set default background picture.
    var cityName = "";
    var regionName = "";
    var countryName = "";
    var locationString = "";
    var latitude = "";
    var longitude = "";
    var countryUnits = "metric";                                        // set default measurement system to metric.
    var temperature = "";
    var windSpeed = "";
    var windDirection = "";
    var humidity = "";
    var pressure = "";
    var pressureSymbol = "kPa";                                         // set default pressure units.
    var sunrise = "";
    var sunset = "";
    var currentWeather = "";
    var tempSymbol = "C";                                               // set default temperature units.
    var windSymbol = 'km/h';                                            // set default wind speed units.
    var iconURL = "";

    /* function locationByIP() sets user's location information based upon the user's IP address
     * using the webservice at https://ipinfo.io/ */
    function locationByIP() {
        var locationRequest = new XMLHttpRequest();
        locationRequest.onreadystatechange = function () {
            if (locationRequest.readyState === 4 && locationRequest.status === 200) {  // ready state 'complete.'
                var locationObj = JSON.parse(locationRequest.responseText);            // parse JSON response.
                cityName = locationObj.city;                            // extract user's city, region, country.
                regionName = locationObj.region;
                countryName = locationObj.country;
                locationString = locationObj.loc.split(',');           // split loc ( loc": "45.0834,-64.4988" )
                latitude = Number(locationString[0]);
                longitude = Number(locationString[1]);
                setCountryUnits();                                      // set units of measure, imperial or metric.
                getWeatherData();                                       // get user's local weather.
            }
        };
        locationRequest.open("GET", 'https://ipinfo.io/json', true);     // true sets asynchronous mode.
        locationRequest.send();                                         // send the information request to website.
    }

    /* function setCountryUnits() determines if user's country uses imperial or metric units of measure. */
    function setCountryUnits() {
        if (countryName === 'US' || countryName === 'LY') {             // in year 2016 only USA and Libya not metric.
            countryUnits = 'imperial';
        }
    }

    /* function getWeatherData() queries openweathermap.org for local weather at user's longitude and latitude. */
    function getWeatherData() {
        var url = 'https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' +  // build query url.
            longitude + '&APPID=608f2325a0ac32149fd498a3ebf24641' +
            '&units=' + countryUnits + '&preventCache=' + new Date();   // Date prevents caching old data.
        var weatherRequest = new XMLHttpRequest();
        weatherRequest.onreadystatechange = function () {
            if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
                var obj = JSON.parse(weatherRequest.responseText);
                processResponse(obj);                     // call processResponse() passing in local weather data.
            }
        };
        weatherRequest.open("GET", url, true);                          // true sets asynchronous mode.
        weatherRequest.send();                                          // send the information request to website.
    }

    /* function processResponse() receives local weather data and updates weather data variables. */
    function processResponse(obj) {
        temperature = Math.round(obj.main.temp);
        if (countryUnits === 'metric') {                                // checks if metric country.
            windSpeed = Math.round(obj.wind.speed * 18 / 5);            // convert meter/sec to km/hour. (metric)
            pressure = Math.round(obj.main.pressure) / 10;              // convert to kPa from hPa. (metric)
        }
        else {                                                          // else use imperial units.
            windSpeed = Math.round(obj.wind.speed);
            pressure = Math.round(obj.main.pressure);
        }
        windDirection = degreeToCardinal(obj.wind.deg);      // convert from degrees to cardinal wind direction.
        currentWeather = obj.weather[0].description;
        humidity = obj.main.humidity;
        var sunriseDateObj = unixTimeToLocal(obj.sys.sunrise);          // convert to user's time zone, pretty format.
        sunrise = sunriseDateObj.toLocaleTimeString();
        var sunsetDateObj = unixTimeToLocal(obj.sys.sunset);            // convert to user's time zone, pretty format.
        sunset = sunsetDateObj.toLocaleTimeString();
        iconURL = 'https://cors.5apps.com/?uri=http://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';  // fetch correct weather icon.
        weatherPicture();                         // set appropriate background picture to local weather conditions.
        displayRefresh();                         // update webpage with new data.
    }

    /* For Refreshing Weather */
    function displayRefresh() {
        displayCity.innerHTML = cityName;
        displayCountry.innerHTML = regionName + ", " + countryName;
        displayTemperature.innerHTML = temperature;
        displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
        displayConditions.innerHTML = currentWeather;
        displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
        displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        displayHumidity.innerHTML = "Humidity: " + humidity + "%";
        displaySunrise.innerHTML = "Sunrise at " + sunrise;
        displaySunset.innerHTML = "Sunset at " + sunset;
        var newElement = document.createElement('img');                 // new DOM element for weather icon.
        newElement.src = iconURL;
        newElement.setAttribute("id", "icons");
        document.getElementById("icon").appendChild(newElement);
        var image = backgroundPicture;
        var referenceMainWrapper = document.getElementById("main-wrapper");
        referenceMainWrapper.style.backgroundImage = 'url(' + image + ')';
        referenceMainWrapper.style.backgroundSize = "100% auto";
    }

    /* for smart metric ppl who does not use dumb imperial like america . */
    function toggleUnits() {
        if (countryUnits === 'metric') {                           // check if currently set to imperial or metric.
            tempSymbol = 'F';
            windSymbol = 'miles/hour';
            countryUnits = 'imperial';
            pressureSymbol = 'mb';
            button.innerHTML = 'Use Metric Units';
            temperature = Math.round((temperature * 9 / 5) + 32);       // convert temperature to 'fahrenheit'.
            displayTemperature.innerHTML = temperature;
            displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
            windSpeed = Math.round(windSpeed / 1.609344);               // convert wind speed to 'miles/hr'.
            displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
            pressure = pressure * 10;                                   // convert pressure to 'mb'.
            displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        }
        else {
            tempSymbol = 'C';
            countryUnits = 'metric';
            windSymbol = 'km/hour';
            pressureSymbol = 'kPa';
            button.innerHTML = 'Use Imperial Units';
            temperature = Math.round((temperature - 32) * 5 / 9);       // convert temperature to 'celsius'.
            displayTemperature.innerHTML = temperature;
            displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
            windSpeed = Math.round(windSpeed * 1.609344);               // convert wind speed to 'Km/h'.
            displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
            pressure = pressure / 10;                                   // convert pressure to'KPa'.
            displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        }
    }

    /* function unixTimeToLocal() is passed a date set in unix time, and returns a Date object in the user's
     * local time. */
    function unixTimeToLocal(unix) {
        var local = new Date(0);
        local.setUTCSeconds(unix);
        return local;
    }

    /* Function to convert direction of the wind to north south etc */
    function degreeToCardinal(degree) {
        if (degree > 337.5 && degree < 22.5) {
            return "N";
        } else if (degree > 22.5 && degree < 67.5) {
            return "NE";
        } else if (degree > 67.5 && degree < 112.5) {
            return "E";
        } else if (degree > 112.5 && degree < 157.5) {
            return "SE";
        } else if (degree > 157.5 && degree < 202.5) {
            return "S";
        } else if (degree > 202.5 && degree < 247.5) {
            return "SW";
        } else if (degree > 247.5 && degree < 292.5) {
            return "W";
        } else if (degree > 292.5 && degree < 337.5) {
            return "NW";
        }
    }

    /* function weatherPicture() sets the background picture to match the current local weather conditions. */ 
  /* I think this is useless for the UI, may take it out after revision */
    function weatherPicture() {
        switch (true) {
            case /\bclear\b/i.test(currentWeather):                     // match u
        }
    }


    document.getElementById("unit").onclick = function () {             // add event listener to 'change units' button.
        toggleUnits();                                                  // on button click toggle units of measurement.
    };
    locationByIP();                                                     // main entry point for program execution.
})();


