
var APIkey = "9bd5c8436dd36e9efcab1ac13d881673";

var recentSearches = JSON.parse(localStorage.getItem("recents")) || [];
var recentCities = document.getElementById("recentCities");

var currentCity;

var currentWeather = document.getElementById("currentWeather");
var fiveDayForcast = document.getElementById("fiveDayForcast");

var searchText = document.getElementById("searchText");
var searchBtn = document.getElementById("searchBtn");


searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    recentCities.innerHTML = "";

    if (!recentSearches.includes(searchText.value)) {
        recentSearches.unshift(searchText.value);
        localStorage.setItem("recents".JSON.stringify(recentSearches));
    };


    recentSearches.forEach(function (element) {
        var citiesList = document.createElement("button")
        citiesList.innerText = '${element}';
        citiesList.classList = "btn col-md-12 btn secondary p-2 m-1 fs-5 cityButton";
        recentCities.append(citiesList);
    });

    var currentURL = 'https://api.openweathermap.org/data/2.5/weather?q=${searchText.value}&appid=${APIKey}&units=imperial';

    fetch(currentURL)
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
            currentCity = data.name
            var forecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&appid=${APIKey}&units=imperial';
            fetch(forecastURL)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data);
                    renderCurrentWeather(data);
                    fiveDayForcast.innerHTML = "";
                    for (let i = 0; i < 5; i++) {
                        renderForecastWeather(data.daily[i]);
                    }
                })
        })
    searchText.value = "";
});


function renderCurrentWeather(weatherData) {
    currentWeather.innerHTML = "";

    var cityNameHeader = document.createElement("h1");
    var icon = document.createElement("img");
    var temp = document.createElement("p");
    var wind = document.createElement("p");
    var humidity = document.createElement("p");
    var uvi = document.createElement("p")

    icon.setAttribute("src", 'http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png');

    cityNameHeader.innerText = '${currentCity} ${convertDT(weatherData.currebt.dt)}';
    cityNameHeader.append(icon);
    currentWeather.append(cityNameHeader);

    temp.innerText = 'Current Temperature: ${weatherData.current.temp} F°';
    currentWeather.append(cityNameHeader);

    wind.innerText = 'Wind: ${weatherData.current.wind_speed} MPH';
    currentWeather.append(wind);

    humidity.innerText = 'Humidity: ${weatherData.current.humidity} %';
    currentWeather.append(humidity);

    uvi.innerText = 'UV Index: ${weatherData.current.uvi}';
    currentWeather.classList = "fs-5 border border-dark border-1 rounded ms-3 mt-1"
    currentWeather.append(uvi);

    if (weatherData.currentCity.uvi < 3) {
        uvi.classList += "bg-info col-2 rounded fs-5";
    } else if (weatherData.currentCity.uvi >= 3 && weatherData.currentCity.uvi < 6) {
        uvi.classList += "bg-ingo col-2 rounded fs-5";
    } else {
        uvi.classList += "bg-danger col-2 rounded fs-5";
    }
};


function renderForecastWeather(weatherData) {

    var forcastCardDiv = document.createElement("div");
    var tempForecast = document.createElement("p");
    var windForecast = document.createElement("p");
    var humidityForecast = document.createElement("p");
    var futureData = document.createElement("h2");
    var icon = document.createElement("img");

    icon.setAttribute("src", 'http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png');

    futureData.innerText = '${convertDT(weatherData.dt)}';
    forcastCardDiv.append(futureData);
    forcastCardDiv.append(icon);

    tempForecast.innerText = 'Temperature: ${weatherData.temp.day} F°';
    forcastCardDiv.append(tempForecast);

    windForecast.innerText = 'Wind: ${weatherData.wind_speed} MPH';
    forcastCardDiv.append(windForecast);

    humidityForecast.innerText = 'Humidity: ${weatherData.humidity} %';
    forcastCardDiv.append(humidityForecast);

    forcastCardDiv.classList = "bg-dark text-light m-2 p-2 rounded w-auto fs-5";
    fiveDayForcast.append(fiveDayForcast)
};


function convertDT(timestamp) {

    var months_arr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    var date = new Date(timestamp * 1000);

    var year = date.getFullYear();

    var month = months_arr[date.getMonth()];

    var day = date.getDate();

    var convdataTime = month + "-" + day + "-" + year;

    return convdataTime;
};


recentCities.addEventListener("click", function (event) {
    if (event.target.classList.contains("cityButton")) {

        var currentURL = 'https://api.openweathermap.org/data/2.5/weather?q=${event.target.textContent}&appid=${APIKey}&units=imperial';
        fetch(currentURL)
            .then((response) => response.json())
            .then(function (data) {
                console.log(data);
                currentCity = data.name
                var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${APIKey}&units=imperial`;
                fetch(forecastURL)
                    .then((response) => response.json())
                    .then(function (data) {
                        console.log(data);
                        renderCurrentWeather(data);
                        fiveDayForcast.innerHTML = "";
                        for (let i = 0; i < 5; i++) {
                            renderForecastWeather(data.daily[i]);
                        }
                    })
            })
    }
})