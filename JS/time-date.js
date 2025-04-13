document.addEventListener('DOMContentLoaded', function() {

    // Updates the content of the 'time' and 'date' HTML elements with the current time and date.
    function updateTimeAndDate() {
        const now = new Date();

        // Format the current time as HH:MM
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        // Format the current date as "Weekday, Day Month Year" (in Swedish)
        const weekdayNames = [
            "Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"
        ];
        const weekdayName = weekdayNames[now.getDay()]; // Get the name of the current weekday

        const day = String(now.getDate()); // Get the day of the month

        const monthNames = [
            "januari", "februari", "mars", "april", "maj", "juni",
            "juli", "augusti", "september", "oktober", "november", "december"
        ];
        const monthName = monthNames[now.getMonth()]; // Get the name of the current month

        const year = now.getFullYear(); // Get the current year

        const dateString = `${weekdayName}, ${day} ${monthName} ${year}`;

        // Get references to the HTML elements where the time and date will be displayed
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');

        // Update the text content of the time element if it exists
        if (timeElement) {
            timeElement.textContent = timeString;
        }

        // Update the text content of the date element if it exists
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }

    // Call updateTimeAndDate once when the page loads to display the initial time and date
    updateTimeAndDate();

    // Set an interval to call updateTimeAndDate every 1000 milliseconds (1 second)
    // This ensures the time and date are updated dynamically
    setInterval(updateTimeAndDate, 1000);
});