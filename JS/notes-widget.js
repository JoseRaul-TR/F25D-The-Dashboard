document.addEventListener('DOMContentLoaded', function() {
    
    const noteTextarea = document.getElementById('noteTextarea');
    const dashboardNote = 'dashboardNote';

    // Load saved note on page load
    function loadSavedNote() {
        if (noteTextarea) {
            const savedNote = localStorage.getItem(dashboardNote);
            if (savedNote) {
                noteTextarea.value = savedNote;
            }
        }
    }

    // Save note whenever the content changes
    if (noteTextarea) {
        noteTextarea.addEventListener('input', function() {
            localStorage.setItem(dashboardNote, this.value);
        });
    }

    // Call the function to load the saved note
    loadSavedNote();
});