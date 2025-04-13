document.addEventListener('DOMContentLoaded', function() {

    // API URL for fetching police events
    const urlAPI = 'https://polisen.se/api/events';

    // DOM elements for filtering and displaying events
    const eventTypeSelector = document.getElementById('eventTypeSelector');
    const eventPlaceSelector = document.getElementById('eventPlaceSelector');
    const filterEventSubmit = document.getElementById('filterEventSubmit');
    const eventsContainer = document.getElementById('eventsContainer');
    const filterToggle = document.getElementById('filterToggle');
    const filterIcon = filterToggle ? filterToggle.querySelector('i') : null; // Icon inside the filter toggle button
    const eventsFilters = document.getElementById('eventsFilters');

    // Initially fetch and display all events, and populate the filter selectors
    fetchAndDisplayEvents();
    generateEventTypeSelector();
    generateEventPlaceSelector();

    //Fetches police events from the specified API URL.
    async function fetchPoliceEvents(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data: ', error);
            eventsContainer.innerHTML = '<p>Kunde inte hämta händelser.</p>';
            throw error; // Re-throw the error to be caught by calling functions
        }
    }

    // Fetches police events based on optional filters and displays them in the UI.
    async function fetchAndDisplayEvents(eventType = '', place = '') {
        eventsContainer.innerHTML = '<p>Hämtar händelser...</p>';
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            let filteredEvents = allEvents;

            // Apply filters if provided
            if (eventType) {
                filteredEvents = filteredEvents.filter(event => event.type === eventType);
            }
            if (place) {
                filteredEvents = filteredEvents.filter(event => event.location.name === place);
            }

            eventsContainer.innerHTML = ''; // Clear the "Hämtar händelser..." message

            // Display a message if no events match the filters
            if (filteredEvents.length === 0) {
                eventsContainer.innerHTML = '<p>Inga händelser hittades för de valda filtren.</p>';
                return;
            }

            // Create and append HTML elements for each event
            filteredEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = "eventCard";
                eventDiv.innerHTML = `
                    <p>Typ: ${event.type}</p>
                    <h3>${event.name}</h3>
                    <p>${event.summary}</p>
                    <p>Plats: ${event.location.name}</p>
                    <a href="https://polisen.se/${event.url}" target=_blank>Mer detaljer</a>
                `;
                eventsContainer.appendChild(eventDiv);
            });
        } catch (error) {
            console.error('Error displaying events: ', error);
            eventsContainer.innerHTML = '<p>Kunde inte visa händelser.</p>';
        }
    }

    // Generates the options for the event type selector based on the fetched data.
    async function generateEventTypeSelector() {
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            // Extract all unique event types and sort them alphabetically
            const eventTypesSorted = [...new Set(allEvents.map(event => event.type))].sort();

            // Create and append an option for each event type
            eventTypesSorted.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                eventTypeSelector.appendChild(option);
            });
        } catch (error) {
            console.error('Error generating event type selector: ', error);
        }
    }

    // Generates the options for the event place selector based on the fetched data.
    async function generateEventPlaceSelector() {
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            // Extract all unique event locations and sort them alphabetically
            const eventPlacesSorted = [...new Set(allEvents.map(event => event.location.name))].sort();

            // Create and append an option for each event place
            eventPlacesSorted.forEach(place => {
                const option = document.createElement('option');
                option.value = place;
                option.textContent = place;
                eventPlaceSelector.appendChild(option);
            });
        } catch (error) {
            console.error('Error generating event place selector: ', error);
        }
    }

    // Event listener for the filter submit button
    filterEventSubmit.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const selectedEventType = eventTypeSelector.value;
        const selectedPlace = eventPlaceSelector.value;
        // Fetch and display events based on the selected filter values
        fetchAndDisplayEvents(selectedEventType, selectedPlace);
    });

    // Event listener for the filter toggle button to show/hide filters
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            eventsFilters.classList.toggle('open'); // Toggle the 'open' class to show/hide the filter container
            filterToggle.classList.toggle('open-toggle'); // Toggle a class on the toggle for potential visual changes

            // Toggle the filter icon between filter and close (times)
            if (filterIcon) {
                filterIcon.classList.toggle('fa-filter');
                filterIcon.classList.toggle('fa-times');
            }
        });
    }
});