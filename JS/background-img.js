let UnsplashApiKey = null; // Store API key in a variable

// Function to fetch photo from Unsplash API
async function fetchUnsplashPhoto(query = '') {
    if (!UnsplashApiKey) {
        alert("Please enter your Unsplash API key.");
        return null;
    }

    let url = `https://api.unsplash.com/photos/random?client_id=${UnsplashApiKey}`;

    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.urls && data.urls.regular) {
            return data.urls.regular;
        } else {
            console.error('API response missing URL:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching image from API:', error);
        return null;
    }
}

// Function to set the background image
async function setBackgroundImage(query = '') {
    const imageUrl = await fetchUnsplashPhoto(query);

    if (imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';

        //Store the last image URL in localStorage
        localStorage.setItem('lastBackgroundImage', imageUrl);
    } else {
        console.log("Could not fetch image for background");
    }
}

// Function to prompt for API key
function promptForApiKey() {
    UnsplashApiKey = prompt("Enter your Unsplash API key:");
    if (!UnsplashApiKey) {
        alert("API key is required.");
        return false;
    }
    return true;
}

// Event listener for the search button
document.getElementById('changeBackgroundBtn').addEventListener('click', () => {
    if (promptForApiKey()) {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value;
        setBackgroundImage(query);
    }
});

// Event listener for the random background button
document.getElementById('randomBackgroundBtn').addEventListener('click', () => {
    if (promptForApiKey()) {
        setBackgroundImage();
    }
});

// Function to load the last background image from localStorage on page load
function loadLastBackgroundImage() {
    const lastImageUrl = localStorage.getItem('lastBackgroundImage');
    if (lastImageUrl) {
        document.body.style.backgroundImage = `url('${lastImageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';
    }
}

// Call the function to load the last background image on page load
loadLastBackgroundImage();