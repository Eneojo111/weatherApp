const weatherform = document.querySelector(".weatherform");
const search = document.querySelector(".search");
const card = document.querySelector(".card");
const apiKey = "45d58806a69b84cf696aea63124f5876"

weatherform.addEventListener("submit", async event => {

    event.preventDefault();
    const city = search.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayweatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please Enter a city");
    }

});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }
    return await response.json()
}

function displayweatherInfo(data) {
    const { name: city,
        main: { temp, humidity },
        weather: [{ description, id }] } = data;
        // console.log(data)

    card.textContent = "";
    card.style.display = "flex"

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descpDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descpDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);


    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descpDisplay.classList.add("descpDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descpDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherID) {
    switch (true) {
        case (weatherID >= 200 && weatherID < 300):
            return "⚡";
        case (weatherID >= 300 && weatherID < 400):
            return "🌧️";
        case (weatherID >= 500 && weatherID < 600):
            return "🌧️";
        case (weatherID >= 600 && weatherID < 700):
            return "❄️";
        case (weatherID >= 700 && weatherID < 800):
            return "🌫️";
        case (weatherID === 800):
            return "☀️";
        case (weatherID >= 801 && weatherID < 810):
            return "☁️";
        default:
            return "❓❓❓";
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}