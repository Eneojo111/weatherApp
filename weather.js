const weatherform = document.querySelector(".weatherform");
const search = document.querySelector(".search");
const card = document.querySelector(".card");
const apiKey = "45d58806a69b84cf696aea63124f5876";
const logout = document.querySelector(".fa-right-from-bracket");

weatherform.addEventListener("submit", async event => {
    event.preventDefault();
    const city = search.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayweatherInfo(weatherData);
            getForecast(city); // 🔥 Update weekly forecast when searching
        } catch (error) {
            console.error(error);
            displayError("City not found");
        }
    } else {
        displayError("Please Enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }
    return await response.json();
}

function displayweatherInfo(data) {
    const { name: city,
        main: { temp, humidity },
        weather: [{ description, id }] } = data;

    card.textContent = "";
    card.style.display = "flex";
    card.style.width = "650px";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descpDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descpDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmojiById(id);

    card.append(cityDisplay, tempDisplay, humidityDisplay, descpDisplay, weatherEmoji);
}

function getWeatherEmojiById(weatherID) {
    switch (true) {
        case (weatherID >= 200 && weatherID < 300): return "⛈️";
        case (weatherID >= 300 && weatherID < 600): return "🌧️";
        case (weatherID >= 600 && weatherID < 700): return "❄️";
        case (weatherID >= 700 && weatherID < 800): return "🌫️";
        case (weatherID === 800): return "☀️";
        case (weatherID > 800): return "☁️";
        default: return "❓";
    }
}

function displayError(message) {
    card.textContent = "";
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;

    card.appendChild(errorDisplay);
}

logout.addEventListener("click", function () {
    const userconfirm = confirm("Are you sure you want to logout?");
    if (userconfirm) {
        localStorage.clear();
        window.location.href = "login.html";
    }
});


//  WEEKLY FORECAST FUNCTION
async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();
        const days = document.querySelectorAll(".day");

        if (!data.list) return;

        for (let i = 0; i < 5; i++) {  
            const forecast = data.list[i * 8];
            if (!forecast) continue;

            const temp = Math.round(forecast.main.temp);
            const weatherId = forecast.weather[0].id;
            const emoji = getWeatherEmojiById(weatherId);

            days[i].innerHTML = `
                <div class="day-name">${days[i].dataset.day}</div>
                <div class="weather-emoji">${emoji}</div>
                <div class="temperature">${temp}°C</div>
            `;
        }

    } catch (error) {
        console.error("Forecast error:", error);
    }
}


getForecast("Lagos");




