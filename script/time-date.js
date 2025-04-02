function updateTimeAndDate() {
    const now = new Date();

    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Date
    const weekdayNames = [
        "Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"
    ];
    const weekdayIndex = now.getDay();
    const weekdayName = weekdayNames[weekdayIndex];

    const day = String(now.getDate());

    const monthNames = [
        "januari", "februari", "mars", "april", "maj", "juni",
        "juli", "augusti", "september", "oktober", "november", "december"
    ];
    const monthIndex = now.getMonth();
    const monthName = monthNames[monthIndex];

    const year = now.getFullYear();

    const dateString = `${weekdayName}, ${day} ${monthName} ${year}`;

    // Update HTML elements
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    if (timeElement) {
        timeElement.textContent = timeString;
    }
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// Initial call to set time and date immediately
updateTimeAndDate();

// Update time and date every second (1000ms)
setInterval(updateTimeAndDate, 1000);