// Fuction to change text both in <title> and in <h1>
function changeHeading() {
    let newTitleText = document.getElementById('newTitle').value;
    let titleElement = document.getElementById('myTitle');
    let h1Element = document.getElementById('h1Title');

    if (titleElement) {
        titleElement.textContent = newTitleText;
        localStorage.setItem('dashboardTitle', newTitleText);
    }
    if (h1Element) {
        h1Element.textContent = newTitleText;
        localStorage.setItem('dashboardH1Title', newTitleText);
    }
}

// Function to handle title color change
function changeTitleColor(event) {
    const newColor = event.target.value;
    const h1Element = document.getElementById('h1Title');
    if (h1Element) {
        h1Element.style.color = newColor;
        localStorage.setItem('dashboardTitleColor', newColor); // Save new color in localStorage
    }
}

document.getElementById('headingConfigWheel').addEventListener('click', function() {
    let config = document.getElementById('headingConfig');

    if (config.style.display === 'none' || config.style.display === '') {
        config.style.display = 'block';
    } else {
        config.style.display = 'none';
    }
});

document.getElementById('changeTitleBtn').addEventListener('click', () => {
    changeHeading();
    document.getElementById('headingConfig').style.display = 'none'; //Hide headingConfig after title change
});

const titleColorPicker = document.getElementById('titleColorPicker');
if (titleColorPicker) {
    titleColorPicker.addEventListener('input', changeTitleColor);
}

// Load titles and color from localStorage
window.onload = function() {
    let savedTitle = localStorage.getItem('dashboardTitle');
    let savedH1Title = localStorage.getItem('dashboardH1Title');
    let savedTitleColor = localStorage.getItem('dashboardTitleColor');

    if (savedTitle) {
        let titleElement = document.getElementById('myTitle');
        if (titleElement) {
            titleElement.textContent = savedTitle;
        }
    }

    if (savedH1Title) {
        let h1Element = document.getElementById('h1Title');
        if (h1Element) {
            h1Element.textContent = savedH1Title;
        }
        if (savedTitleColor) {
            h1Element.style.color = savedTitleColor;
        }
    } else if (savedTitleColor) {
        // Apply color even if H1 title wasn't saved (might happen if color was set before H1 was introduced)
        let h1Element = document.getElementById('h1Title');
        if (h1Element) {
            h1Element.style.color = savedTitleColor;
        }
    }

    // Set initial value of color picker if a color is saved
    if (titleColorPicker && savedTitleColor) {
        titleColorPicker.value = savedTitleColor;
    }
};