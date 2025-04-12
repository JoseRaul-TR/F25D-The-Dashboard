document.addEventListener('DOMContentLoaded', function() {

    const urlAPI = 'https://polisen.se/api/events';
    const eventTypeSelector = document.getElementById('eventTypeSelector');
    const eventPlaceSelector = document.getElementById('eventPlaceSelector');
    const filterEventSubmit = document.getElementById('filterEventSubmit');
    const eventsContainer = document.getElementById('eventsContainer');
    const filterToggle = document.getElementById('filterToggle');
    const filterIcon = filterToggle.querySelector('i');
    const eventsFilters = document.getElementById('eventsFilters');

/*     // Explicitly set the initial display state
    eventsFilters.style.display = 'none'; */

    // Initially fetch and display events
    fetchAndDisplayEvents();
    generateEventTypeSelector();
    generateEventPlaceSelector();

    async function fetchPoliceEvents(urlAPI) {
        try {
            const response = await fetch(urlAPI);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data: ', error);
            eventsContainer.innerHTML = '<p>Kunde inte hämta händelser.</p>';
            throw error;
        }
    }

    async function fetchAndDisplayEvents(eventType = '', place = '') {
        eventsContainer.innerHTML = '<p>Hämtar händelser...</p>';
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            let filteredEvents = allEvents;

            if (eventType && eventType !== '') {
                filteredEvents = filteredEvents.filter(event => event.type === eventType);
            }
            if (place && place !== '') {
                filteredEvents = filteredEvents.filter(event => event.location.name === place);
            }

            eventsContainer.innerHTML = ''; // Clear loading message

            if (filteredEvents.length === 0) {
                eventsContainer.innerHTML = '<p>Inga händelser hittades för de valda filtren.</p>';
                return;
            }

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

    async function generateEventTypeSelector() {
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            const eventTypesSet = new Set(allEvents.map(event => event.type));
            const eventTypesSorted = Array.from(eventTypesSet).sort();

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

    async function generateEventPlaceSelector() {
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            const eventPlacesSet = new Set(allEvents.map(event => event.location.name));
            const eventPlacesSorted = Array.from(eventPlacesSet).sort();

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

    filterEventSubmit.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedEventType = eventTypeSelector.value;
        const selectedPlace = eventPlaceSelector.value;
        fetchAndDisplayEvents(selectedEventType, selectedPlace);
    });

    filterToggle.addEventListener('click', function() {
        eventsFilters.classList.toggle('open'); // Toggle an 'open' class on the filters
        filterToggle.classList.toggle('open-toggle'); // Toggle an 'open-toggle' class on the toggle

        if (filterIcon) {
            filterIcon.classList.toggle('fa-filter');
            filterIcon.classList.toggle('fa-times');
        }
    });
});