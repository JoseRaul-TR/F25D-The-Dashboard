document.addEventListener('DOMContentLoaded', function() {
    const weatherWidget = document.getElementById('weather');
    const temperatureDiv = document.getElementById('temperature');
    const descriptionDiv = document.getElementById('description');
    const weatherIconDiv = document.getElementById('weatherIcon');
    const forecastDiv = document.getElementById('forecast');
    const detailsDiv = document.getElementById('details');
    const weatherErrorDiv = document.getElementById('weatherError');

    const useGeolocationButton = document.getElementById('useGeolocation');
    const customLocationInputDiv = document.getElementById('customLocationInput');
    const locationNameInput = document.getElementById('locationName');
    const fetchCustomWeatherButton = document.getElementById('fetchCustomWeather');
    const toggleCustomLocationButton = document.getElementById('toggleCustomLocation');

    let currentLatitude;
    let currentLongitude;

    function displayWeather(data) {
        weatherErrorDiv.textContent = ''; // Clear any previous errors
        if (data && data.properties && data.properties.timeseries && data.properties.timeseries.length > 0) {
            const nowData = data.properties.timeseries[0].data.instant.details;
            const nextHourForecast = data.properties.timeseries[0].data.next_1_hours ? data.properties.timeseries[0].data.next_1_hours.summary : null;

            const temperature = nowData.air_temperature ? `${nowData.air_temperature}°C` : 'N/A';
            const descriptionSymbol = nextHourForecast ? nextHourForecast.symbol_code : 'unknown';

            temperatureDiv.textContent = temperature;
            descriptionDiv.textContent = getWeatherDescription(descriptionSymbol); // Implement this function
            weatherIconDiv.textContent = getWeatherIcon(descriptionSymbol);     // Implement this function
            // You can expand this to show more forecast data
        } else {
            weatherErrorDiv.textContent = 'Kunde inte läsa väderdata.';
        }
    }

    function getWeatherDescription(symbolCode) {
        // Basic mapping - expand this based on Yr.No's symbol codes
        const descriptions = {
            clearsky_day: 'Klar himmel',
            clearsky_night: 'Klar himmel',
            partlycloudy_day: 'Delvis molnigt',
            partlycloudy_night: 'Delvis molnigt',
            cloudy: 'Molnigt',
            rain_light: 'Lätt regn',
            rain: 'Regn',
            rain_heavy: 'Kraftigt regn',
            snow_light: 'Lätt snö',
            snow: 'Snö',
            snow_heavy: 'Kraftig snö',
            fog: 'Dimma'
            // Add more as needed from Yr.No's documentation
        };
        return descriptions[symbolCode] || 'Okänt väder';
    }

    function getWeatherIcon(symbolCode) {
        // Very basic text-based icons - replace with actual icon fonts or images
        const icons = {
            clearsky_day: '☀️',
            clearsky_night: '🌙',
            partlycloudy_day: '🌤️',
            partlycloudy_night: '☁️',
            cloudy: '☁️',
            rain_light: '🌧️',
            rain: '🌧️',
            rain_heavy: '🌧️🌧️',
            snow_light: '🌨️',
            snow: '🌨️',
            snow_heavy: '🌨️🌨️',
            fog: '🌫️'
            // Add more as needed
        };
        return icons[symbolCode] || '❓';
    }

    async function fetchWeatherByCoordinates(latitude, longitude) {
        const yrNoForecastURL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
        try {
            const data = await fetchWeatherData(yrNoForecastURL);
            displayWeather(data);
        } catch (error) {
            weatherErrorDiv.textContent = 'Kunde inte hämta väderdata för din plats.';
            console.error(error);
        }
    }

    async function fetchWeatherByPlaceName(placeName) {
        // Yr.No doesn't directly take place names in this compact forecast API.
        // We'd need a geocoding service to get coordinates first.
        // For simplicity in this basic example, we'll skip geocoding and just show an error.

        // A more complete solution would involve using a geocoding API
        // (like Nominatim, Google Geocoding API, etc.) to convert the place name
        // to latitude and longitude, and then call fetchWeatherByCoordinates.

        weatherErrorDiv.textContent = `Funktionalitet för att söka på ortnamn är inte implementerad i detta enkla exempel.`;
    }

    function handleGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    currentLatitude = position.coords.latitude;
                    currentLongitude = position.coords.longitude;
                    fetchWeatherByCoordinates(currentLatitude, currentLongitude);
                },
                (error) => {
                    weatherErrorDiv.textContent = `Kunde inte hämta din plats: ${error.message}`;
                }
            );
        } else {
            weatherErrorDiv.textContent = 'Din webbläsare stöder inte geolocation.';
        }
    }

    function toggleCustomLocationInput() {
        customLocationInputDiv.style.display = customLocationInputDiv.style.display === 'none' ? 'block' : 'none';
    }

    useGeolocationButton.addEventListener('click', handleGeolocation);
    toggleCustomLocationButton.addEventListener('click', toggleCustomLocationInput);
    fetchCustomWeatherButton.addEventListener('click', () => {
        const locationName = locationNameInput.value.trim();
        if (locationName) {
            fetchWeatherByPlaceName(locationName);
        } else {
            weatherErrorDiv.textContent = 'Ange en ort.';
        }
    });

    // Initial load using geolocation
    handleGeolocation();
});

/* Notes:
– Keep working in code */