// Fuction to change both <title> and <h1>
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

// Load titles from localStorage
window.onload = function() {
    let savedTitle = localStorage.getItem('dashboardTitle');
    let savedH1Title = localStorage.getItem('dashboardH1Title');

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
    }
};