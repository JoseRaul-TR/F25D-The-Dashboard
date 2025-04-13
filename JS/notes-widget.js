document.addEventListener('DOMContentLoaded', function() {

    // DOM element reference for the note textarea
    const noteTextarea = document.getElementById('noteTextarea');
    // Key used to store the note in local storage
    const dashboardNoteKey = 'dashboardNote';

    // Loads the saved note from local storage and displays it in the textarea.
    function loadSavedNote() {
        // Check if the textarea element exists
        if (noteTextarea) {
            // Retrieve the saved note from local storage using the defined key
            const savedNote = localStorage.getItem(dashboardNoteKey);
            // If a saved note exists, set the textarea's value to it
            if (savedNote) {
                noteTextarea.value = savedNote;
            }
        }
    }

    // Event listener to save the note to local storage whenever the textarea content changes
    if (noteTextarea) {
        noteTextarea.addEventListener('input', function() {
            // Save the current value of the textarea to local storage using the defined key
            localStorage.setItem(dashboardNoteKey, this.value);
        });
    }

    // Call the function to load the saved note when the page loads
    loadSavedNote();
});