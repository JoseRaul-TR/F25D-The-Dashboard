document.addEventListener('DOMContentLoaded', () => {

    const openWeatherApiKey = ''; // <–– * IMPORTANT!!!! * Fill in OpenWeather API key before test! 
    
    // DOM element references
    const temperatureDiv = document.getElementById('temperature');
    const descriptionDiv = document.getElementById('description');
    const weatherIconDiv = document.getElementById('weatherIcon');
    const forecastDiv = document.getElementById('forecast');
    const detailsDiv = document.getElementById('details');
    const errorDiv = document.getElementById('weatherError');
    const useGeolocationButton = document.getElementById('useGeolocation');
    const locationNameInput = document.getElementById('locationName');
    const fetchCustomWeatherButton = document.getElementById('fetchCustomWeather');
    const locationInfoDiv = document.getElementById('locationInfo');
    const configWheel = document.getElementById('configWheel');
    const locationControls = document.getElementById('locationControls');
    const locationConfig = document.getElementById('locationConfig');


    // Function to fetch weather data from OpenWeather API
    async function fetchWeatherData(urlCurrent, urlForecast) {
        if (!openWeatherApiKey) {
            alert("Please enter your OpenWeather API key in the code.");
            throw new Error("API key not provided."); // Console error
        }

        try {
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(urlCurrent),
                fetch(urlForecast)
            ]);

            // Handle errors for current weather fetch
            if (!currentResponse.ok) {
                const errorData = await currentResponse.json();
                let errorMessage = `Failed to fetch current weather: ${errorData.message || currentResponse.statusText}`;
                if (errorData.cod === '404') {
                    errorMessage = `City not found.`;
                }
                throw new Error(errorMessage);
            }

            // Handle errors for forecast fetch (non-critical, log as warning)
            if (!forecastResponse.ok) {
                const errorData = await forecastResponse.json();
                console.warn(`Failed to fetch forecast data: ${errorData.message || forecastResponse.statusText}`);
                return { currentWeather: await currentResponse.json(), forecastData: null }; // Allow current weather even if forecast fails
            }

            return {
                currentWeather: await currentResponse.json(),
                forecastData: await forecastResponse.json()
            };

        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            displayError(error.message.startsWith('City not found.') ? `Kunde inte hitta orten: ${locationNameInput.value}` : "Något gick fel vid hämtning av väderdata."); // Message to user
            return { currentWeather: null, forecastData: null };
        }
    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        if (data && data.main && data.weather && data.weather.length > 0 && data.name && data.sys && data.sys.country) {
            const temperatureCelsius = Math.round(data.main.temp - 273.15);
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const cityName = data.name;
            const countryCode = data.sys.country;

            locationInfoDiv.textContent = `${cityName}, ${countryCode}`;
            temperatureDiv.textContent = `${temperatureCelsius}°C`;
            descriptionDiv.textContent = description.charAt(0).toUpperCase() + description.slice(1);
            weatherIconDiv.innerHTML = `<img src="${iconUrl}" alt="${description}">`;
            errorDiv.textContent = ''; // Clear any previous content
        } else {
            displayError("Kunde inte visa aktuell väderinformation."); // Message to user
        }
    }

    // Function to display weather forecast
    function displayForecast(data) {

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

            for (const dateKey in dailyForecast) {
                if (dateKey !== today) {
                    const dayData = dailyForecast[dateKey];
                    const middayData = dayData.find(item => new Date(item.dt * 1000).getHours() >= 12 && new Date(item.dt * 1000).getHours() < 15) || dayData[0];
                    if (middayData) {
                        const date = new Date(middayData.dt * 1000);
                        const temp = Math.round(middayData.main.temp - 273.15);
                        const iconCode = middayData.weather[0].icon;
                        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                        const dayOfWeek = new Date(middayData.dt * 1000).toLocaleDateString('sv-SE', { weekday: 'long' });
                        const dayNumber = date.getDate();
                        const month = date.toLocaleDateString('sv-SE', { month: 'long'});
                        const description = middayData.weather[0].description;

                        forecastItemsHTML += `
                            <div class="forecast-item">
                                <p class="forecast-day">${dayOfWeek}, ${dayNumber} ${month}</p>
                                <div class="forecast-icon-details">
                                    <div class="forecast-icon">
                                        <img clas="forecast-icon" src="${iconUrl}" alt="${middayData.weather[0].description}">
                                    </div>
                                    <div class="forecast-temperature-description">
                                        <p class="forecast-temperature">${temp}°C</p>
                                        <p class="forecast-description">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
            }
            forecastDiv.innerHTML = forecastItemsHTML;
        } else {
            console.warn("No forecast available.");
            forecastDiv.textContent = 'Ingen prognos tillgänglig.'; // Message to user
        }
    }

    // Function to display error messages to the user (in Swedish)
    function displayError(message) {
        errorDiv.textContent = message;
        temperatureDiv.textContent = '';
        descriptionDiv.textContent = '';
        weatherIconDiv.innerHTML = '';
        forecastDiv.textContent = '';
        detailsDiv.innerHTML = '';
        locationInfoDiv.textContent = '';
    }

    // Function to get weather by coordinates
    async function getWeatherByCoords(latitude, longitude) {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&lang=sv`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&lang=sv`;

        const { currentWeather, forecastData } = await fetchWeatherData(currentWeatherUrl, forecastUrl);

        if (currentWeather) {
            displayCurrentWeather(currentWeather);
            localStorage.setItem('lastLocation', `${currentWeather.name}, ${currentWeather.sys.country}`); // Store location in localStorage
        }

        if (forecastData) {
            displayForecast(forecastData);
        }
    }

    // Function to get weather by city name
    async function getWeatherByCity(city) {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&lang=sv`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherApiKey}&lang=sv`;

        const { currentWeather, forecastData } = await fetchWeatherData(currentWeatherUrl, forecastUrl);

        if (currentWeather) {
            displayCurrentWeather(currentWeather);
            localStorage.setItem('lastLocation', city); // Store city for custom location
        } else {
            displayError(`Kunde inte hitta orten: ${city}`); // Message to user
            return;
        }

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
                    console.error("Error retrieving location:", error);
                    alert("Kunde inte hämta din plats. Ange en ort manuellt."); // Error retrieving location
                    locationControls.style.display = 'flex'; // Show manual input controls
                }
            );
        } else {
            alert("Din webbläsare stöder inte geolokalisering. Ange en ort manuellt."); // Error retrieving location
            locationControls.style.display = 'flex'; // Show manual input controls
        }
    }

    // Event listener for the config wheel to toggle location controls and icon
    if (configWheel && locationConfig) {
        configWheel.addEventListener('click', () => {
            locationConfig.classList.toggle('controls-visible');
            const configWheelIcon = configWheel.querySelector('i');
            if (configWheelIcon) {
                if (configWheelIcon.classList.contains('fa-cog')) {
                    configWheelIcon.classList.remove('fa-cog');
                    configWheelIcon.classList.add('fa-times');
                } else {
                    configWheelIcon.classList.remove('fa-times');
                    configWheelIcon.classList.add('fa-cog');
                }
            }
        });
    }

    // Event listener for using geolocation
    if (useGeolocationButton) {
        useGeolocationButton.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                        if (locationControls) {
                            locationControls.style.display = 'none'; // Hide controls after action
                        }
                        // Ensure config wheel shows cog after geolocation success
                        const configWheelIcon = configWheel.querySelector('i');
                        if (configWheelIcon && configWheelIcon.classList.contains('fa-times')) {
                            configWheelIcon.classList.remove('fa-times');
                            configWheelIcon.classList.add('fa-cog');
                        }
                        if (locationConfig && locationConfig.classList.contains('controls-visible')) {
                            locationConfig.classList.remove('controls-visible');
                        }
                    },
                    error => {
                        console.error("Error retrieving location:", error);
                        displayError("Kunde inte hämta din plats."); // Message to user
                        if (locationControls) {
                            locationControls.style.display = 'flex'; // Show manual input controls
                        }
                    }
                );
            } else {
                displayError("Din webbläsare stöder inte geolokalisering."); // Message to user
                if (locationControls) {
                    locationControls.style.display = 'flex'; // Show manual input controls
                }
            }
        });
    }

    // Event listener for fetching weather for a custom location (when button is clicked)
    if (fetchCustomWeatherButton) {
        fetchCustomWeatherButton.addEventListener('click', () => {
            const city = locationNameInput.value.trim();
            if (city) {
                getWeatherByCity(city);
                if (locationControls) {
                    locationControls.style.display = 'none'; // Hide controls after action
                }
                // Ensure config wheel shows cog after custom weather fetch
                const configWheelIcon = configWheel.querySelector('i');
                if (configWheelIcon && configWheelIcon.classList.contains('fa-times')) {
                    configWheelIcon.classList.remove('fa-times');
                    configWheelIcon.classList.add('fa-cog');
                }
                if (locationConfig && locationConfig.classList.contains('controls-visible')) {
                    locationConfig.classList.remove('controls-visible');
                }
            } else {
                displayError("Ange en ort."); // Message to user
            }
        });
    }

    // Event listener for pressing Enter in the locationName input
    if (locationNameInput) {
        locationNameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission if any
                fetchCustomWeatherButton.click(); // Trigger the button's click event
            }
        });
    }

    // Initial load
    loadWeatherOnStartup();
});