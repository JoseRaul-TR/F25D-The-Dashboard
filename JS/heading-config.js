document.addEventListener('DOMContentLoaded', function() {
    
    const headingConfigWheel = document.getElementById('headingConfigWheel');
    const headingConfig = document.getElementById('headingConfig');
    const changeTitleBtn = document.getElementById('changeTitleBtn');
    const titleColorPicker = document.getElementById('titleColorPicker');
    const newTitleInput = document.getElementById('newTitle');
    const myTitleElement = document.getElementById('myTitle');
    const h1TitleElement = document.getElementById('h1Title');

    // Function to change text both in <title> and in <h1>
    function changeHeading() {
        let newTitleText = newTitleInput.value;

        if (myTitleElement) {
            myTitleElement.textContent = newTitleText;
            localStorage.setItem('dashboardTitle', newTitleText);
        }
        if (h1TitleElement) {
            h1TitleElement.textContent = newTitleText;
            localStorage.setItem('dashboardH1Title', newTitleText);
        }
    }

    // Function to handle title color change
    function changeTitleColor(event) {
        const newColor = event.target.value;
        if (h1TitleElement) {
            h1TitleElement.style.color = newColor;
            localStorage.setItem('dashboardTitleColor', newColor); // Save new color in localStorage
        }
    }

    if (headingConfigWheel) {
        headingConfigWheel.addEventListener('click', function() {
            if (headingConfig) {
                if (headingConfig.style.display === 'none' || headingConfig.style.display === '') {
                    headingConfig.style.display = 'block';
                } else {
                    headingConfig.style.display = 'none';
                }
            }
        });
    }

    if (changeTitleBtn) {
        changeTitleBtn.addEventListener('click', () => {
            changeHeading();
            if (headingConfig) {
                headingConfig.style.display = 'none'; //Hide headingConfig after title change
            }
        });
    }

    if (titleColorPicker) {
        titleColorPicker.addEventListener('input', changeTitleColor);
    }

    // Load titles and color from localStorage
    function loadSavedData() {
        let savedTitle = localStorage.getItem('dashboardTitle');
        let savedH1Title = localStorage.getItem('dashboardH1Title');
        let savedTitleColor = localStorage.getItem('dashboardTitleColor');

        if (myTitleElement && savedTitle) {
            myTitleElement.textContent = savedTitle;
        }

        if (h1TitleElement) {
            if (savedH1Title) {
                h1TitleElement.textContent = savedH1Title;
            }
            if (savedTitleColor) {
                h1TitleElement.style.color = savedTitleColor;
            }
        }

        // Set initial value of color picker if a color is saved
        if (titleColorPicker && savedTitleColor) {
            titleColorPicker.value = savedTitleColor;
        }
    }

    // Call the function to load saved data
    loadSavedData();
});