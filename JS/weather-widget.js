const openWeatherApiKey = ''; // <–– Fill in OpenWeather API key before test! ************** IMPORTANT!!!!

const temperatureDiv = document.getElementById('temperature');
const descriptionDiv = document.getElementById('description');
const weatherIconDiv = document.getElementById('weatherIcon');
const forecastDiv = document.getElementById('forecast');
const detailsDiv = document.getElementById('details');
const errorDiv = document.getElementById('weatherError');
const useGeolocationButton = document.getElementById('useGeolocation');
const customLocationInputDiv = document.getElementById('customLocationInput');
const toggleCustomLocationButton = document.getElementById('toggleCustomLocation');
const locationNameInput = document.getElementById('locationName');
const fetchCustomWeatherButton = document.getElementById('fetchCustomWeather');
const currentLocationInfoDiv = document.getElementById('currentLocationInfo');
const todayTextDiv = document.getElementById('todayText');

// Function to fetch weather data from OpenWeather API
async function fetchOpenWeatherApiData(url) {
    if (!openWeatherApiKey) {
        alert("Please enter your OpenWeather API key in the code.");
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data from API:', error);
        displayError("Något gick fel vid hämtning av väderdata.");
        return null;
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    if (data && data.main && data.weather && data.weather.length > 0 && data.name && data.sys && data.sys.country) {
        const temperatureCelsius = (data.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const cityName = data.name;
        const countryCode = data.sys.country;

        currentLocationInfoDiv.textContent = `${cityName}, ${countryCode}`;
        todayTextDiv.textContent = 'Idag';
        temperatureDiv.textContent = `${temperatureCelsius}°C`;
        descriptionDiv.textContent = description.charAt(0).toUpperCase() + description.slice(1);
        weatherIconDiv.innerHTML = `<img src="${iconUrl}" alt="${description}">`;
        errorDiv.textContent = ''; // Clear any previous error messages
    } else {
        displayError("Kunde inte visa aktuell väderinformation.");
    }
}

// Function to display weather forecast
function displayForecast(data) {
    forecastDiv.innerHTML = ''; // Clear previous content

    if (data && data.list) {
        const dailyForecast = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = [];
            }
            dailyForecast[date].push(item);
        });

        const today = new Date().toLocaleDateString();
        let forecastItemsHTML = '';

        for (const date in dailyForecast) {
            if (date !== today) { // Exclude today's forecast
                const dayData = dailyForecast[date];
                const middayData = dayData.find(item => new Date(item.dt * 1000).getHours() >= 12 && new Date(item.dt * 1000).getHours() < 15) || dayData[0];
                if (middayData) {
                    const temp = (middayData.main.temp - 273.15).toFixed(1);
                    const iconCode = middayData.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                    const dayOfWeek = new Date(middayData.dt * 1000).toLocaleDateString('sv-SE', { weekday: 'short' });

                    forecastItemsHTML += `
                        <div class="forecast-item">
                            <strong>${dayOfWeek}</strong><br>
                            <img src="${iconUrl}" alt="${middayData.weather[0].description}" style="width: 50px;"><br>
                            ${temp}°C
                        </div>
                    `;
                }
            }
        }
        forecastDiv.innerHTML = forecastItemsHTML; // Populate the existing forecastDiv
    } else {
        console.warn("Ingen prognosdata tillgänglig.");
        forecastDiv.textContent = 'Ingen prognos tillgänglig.';
    }
}

// Function to display error messages
function displayError(message) {
    errorDiv.textContent = message;
    temperatureDiv.textContent = '';
    descriptionDiv.textContent = '';
    weatherIconDiv.innerHTML = '';
    forecastDiv.textContent = '';
    detailsDiv.innerHTML = '';
    currentLocationInfoDiv.textContent = '';
    todayTextDiv.textContent = '';
}

// Function to get weather by coordinates
async function getWeatherByCoords(latitude, longitude) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&lang=sv`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&lang=sv`;

    const currentWeatherData = await fetchOpenWeatherApiData(currentWeatherUrl);
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
        localStorage.setItem('lastLocation', `${currentWeatherData.name}, ${currentWeatherData.sys.country}`); // Store location
    }

    const forecastData = await fetchOpenWeatherApiData(forecastUrl);
    if (forecastData) {
        displayForecast(forecastData);
    }
}

// Function to get weather by city name
async function getWeatherByCity(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&lang=sv`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherApiKey}&lang=sv`;

    const currentWeatherData = await fetchOpenWeatherApiData(currentWeatherUrl);
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
        localStorage.setItem('lastLocation', `${currentWeatherData.name}, ${currentWeatherData.sys.country}`); // Store location
    }

    const forecastData = await fetchOpenWeatherApiData(forecastUrl);
    if (forecastData) {
        displayForecast(forecastData);
    }
}

// Function to first load weather based on stored location, geolocation or ask location to user
function loadWeatherOnStartup() {
    const storedLocation = localStorage.getItem('lastLocation');
    if (storedLocation) {
        getWeatherByCity(storedLocation);
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error("Fel vid hämtning av plats:", error);
                alert("Kunde inte hämta din plats. Ange en ort manuellt.");
                customLocationInputDiv.style.display = 'block'; // Show manual input
            }
        );
    } else {
        alert("Din webbläsare stöder inte geolokalisering. Ange en ort manuellt.");
        customLocationInputDiv.style.display = 'block'; // Show manual input
    }
}

// Event listener for using geolocation (manual button click)
useGeolocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error("Fel vid hämtning av plats:", error);
                displayError("Kunde inte hämta din plats. Försök ange en ort manuellt.");
            }
        );
    } else {
        displayError("Din webbläsare stöder inte geolokalisering.");
    }
});

// Event listener to toggle custom location input
toggleCustomLocationButton.addEventListener('click', () => {
    customLocationInputDiv.style.display = customLocationInputDiv.style.display === 'none' ? 'block' : 'none';
});

// Event listener for fetching weather for a custom location
fetchCustomWeatherButton.addEventListener('click', () => {
    const city = locationNameInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        displayError("Ange en ort.");
    }
});

// Initial load
loadWeatherOnStartup();