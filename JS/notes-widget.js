const noteTextarea = document.getElementById('noteTextarea');
const dashboardNote = 'dashboardNote';

// Load saved note on page load
window.onload = function() {
    const savedNote = localStorage.getItem(dashboardNote);
    if (savedNote) {
        noteTextarea.value = savedNote;
    }
};

// Save note whenever the content changes
noteTextarea.addEventListener('input', function() {
    localStorage.setItem(dashboardNote, this.value);
});