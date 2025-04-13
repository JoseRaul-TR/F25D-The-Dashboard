document.addEventListener('DOMContentLoaded', function() {

    // DOM element references for the heading configuration
    const headingConfigWheel = document.getElementById('headingConfigWheel'); // Gear icon to open config
    const headingConfig = document.getElementById('headingConfig'); // Container for heading options
    const changeTitleBtn = document.getElementById('changeTitleBtn'); // Button to apply new title
    const titleColorPicker = document.getElementById('titleColorPicker'); // Input for selecting title color
    const newTitleInput = document.getElementById('newTitle'); // Input field for the new title
    const myTitleElement = document.getElementById('myTitle'); // The <title> element of the document
    const h1TitleElement = document.getElementById('h1Title'); // The main heading (<h1>) element
    const closeHeadingConfigIcon = document.getElementById('closeHeadingConfig'); // Close icon for the config


    /* Changes the text content of both the document's <title> and the main <h1> element.
    It also saves these new titles to localStorage for persistence.*/
    function changeHeading() {
        const newTitleText = newTitleInput.value;

        // Update the document title and save to localStorage
        if (myTitleElement) {
            myTitleElement.textContent = newTitleText;
            localStorage.setItem('dashboardTitle', newTitleText);
        }

        // Update the main heading (h1) and save to localStorage
        if (h1TitleElement) {
            h1TitleElement.textContent = newTitleText;
            localStorage.setItem('dashboardH1Title', newTitleText);
        }
    }

    /* Handles the change event of the title color picker.
    Updates the color of the main <h1> element and saves the color to localStorage.*/
    function changeTitleColor(event) {
        const newColor = event.target.value;
        if (h1TitleElement) {
            h1TitleElement.style.color = newColor;
            localStorage.setItem('dashboardTitleColor', newColor); // Save the selected color
        }
    }

    // Event listener for the heading configuration wheel to toggle visibility of the config panel
    if (headingConfigWheel) {
        headingConfigWheel.addEventListener('click', function() {
            if (headingConfig) {
                // Toggle the display style between 'none' and 'block' to show/hide
                headingConfig.style.display = (headingConfig.style.display === 'none' || headingConfig.style.display === '') ? 'block' : 'none';
            }
        });
    }

    // Event listener for the close icon in the heading configuration panel
    if (closeHeadingConfigIcon) {
        closeHeadingConfigIcon.addEventListener('click', function() {
            if (headingConfig) {
                headingConfig.style.display = 'none'; // Hide the configuration panel
            }
        });
    }

    // Event listener for the "Change Title" button
    if (changeTitleBtn) {
        changeTitleBtn.addEventListener('click', () => {
            changeHeading(); // Apply the new title
            if (headingConfig) {
                headingConfig.style.display = 'none'; // Hide the configuration panel after changing the title
            }
        });
    }

    // Event listener for changes in the title color picker
    if (titleColorPicker) {
        titleColorPicker.addEventListener('input', changeTitleColor);
    }

    /* Loads the saved dashboard title, main heading title, and heading color from localStorage
    and applies them to the respective elements on page load.*/
    function loadSavedData() {
        const savedTitle = localStorage.getItem('dashboardTitle');
        const savedH1Title = localStorage.getItem('dashboardH1Title');
        const savedTitleColor = localStorage.getItem('dashboardTitleColor');

        // Apply saved title to the document title
        if (myTitleElement && savedTitle) {
            myTitleElement.textContent = savedTitle;
        }

        // Apply saved title and color to the main heading (h1)
        if (h1TitleElement) {
            if (savedH1Title) {
                h1TitleElement.textContent = savedH1Title;
            }
            if (savedTitleColor) {
                h1TitleElement.style.color = savedTitleColor;
            }
        }

        // Set the initial value of the color picker if a color is saved
        if (titleColorPicker && savedTitleColor) {
            titleColorPicker.value = savedTitleColor;
        }
    }

    // Call the function to load saved data when the page loads
    loadSavedData();
});