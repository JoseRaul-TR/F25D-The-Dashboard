function changeHeading () {
    let newTitleText = document.getElementById('newTitle').value;
    let title = document.getElementById('myTitle');

    title.textContent = newHeadingText;
}

document.getElementById('headingConfigWheel').addEventListener('click', function() {
    let config = document.getElementById('headingConfig');

    if (controls.style.display === 'none' || controls.style.display === '') {
        controls.style.display === 'block'; //Show the config controls
    } else {
        controls.style.display === 'none'; // Hide controls by default
    }
})

document.getElementById('changeTitleBtn').addEventListener('click', () => {
    changeHeading();
})

/* Notes:
– Seguir trabajando en codigo para editar título y reuda configuración */