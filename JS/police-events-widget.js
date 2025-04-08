document.addEventListener('DOMContentLoaded', function() {

    const urlAPI = 'https://polisen.se/api/events';
    const eventTypeSelector = document.getElementById('eventTypeSelector');
    const eventPlaceSelector = document.getElementById('eventPlaceSelector');
    const filterEventSubmit = document.getElementById('filterEventSubmit');
    const eventsContainer = document.getElementById('eventsContainer');
    const filterToggle = document.getElementById('filterToggle');
    const eventsFilters = document.getElementById('eventsFilters');
    const filterIcon = document.getElementById('filterIcon');

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
            throw error;
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

    async function displayFilteredEvents(eventType, place) {
        eventsContainer.innerHTML = '';
        try {
            const allEvents = await fetchPoliceEvents(urlAPI);
            let filteredEvents = allEvents;

            if (eventType) {
                filteredEvents = filteredEvents.filter(event => event.type === eventType);
            }

            if (place) {
                filteredEvents = filteredEvents.filter(event => event.location.name === place);
            }

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
            console.error('Error displaying filtered events: ', error);
            eventsContainer.innerHTML = '<p>Kunde inte hämta eller visa händelser.</p>';
        }
    }

    filterEventSubmit.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedEventType = eventTypeSelector.value;
        const selectedPlace = eventPlaceSelector.value;
        displayFilteredEvents(selectedEventType, selectedPlace);
    });

    filterToggle.addEventListener('click', function() {
        if (eventsFilters.style.display === 'none') {
            eventsFilters.style.display = 'block';
            filterIcon.innerHTML = '&#9650;'; // Change icon to up arrow
        } else {
            eventsFilters.style.display = 'none';
            filterIcon.innerHTML = '&#9660;'; // Change icon to down arrow
        }
    });

    generateEventTypeSelector();
    generateEventPlaceSelector();
    displayFilteredEvents('', '');
});