const keyAPIUnplash = process.argv[2]; 

if (!keyAPIUnplash) {
    console.error("API key not provided.");
    process.exit(1);
}

async function fetchUnsplashPhoto(query = '') {
    const url = `https://api.unsplash.com/photos/random?client_id=${keyAPIUnplash}`; //URL Unplash Random Photo API

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
            return data.urls.regular; //REturn the URL of the regular-sized image
        } else {
            console.error("Unexpected response structure form Unsplash AI: ", data);
            return null; //Return null if the response is not as expected
        }
    } catch (error) {
        console.error('Error fetching Unsplash photo:', error);
        return null; // Return null in case of an error
    }
}

// Use photo from Unplash API:
async function setBackgroundImage(query = '') {
    const imageUrl = await fetchUnsplashPhoto(query);

    if (imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';
    } else {
        // Handle the case where the image could not be fetched
        console.log("Could not fetch image for background")
    }
}

//Event listener fo rthe search button
document.getElementById('change-background-btn').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value;
    setBackgroundImage(query);
});

//Event lister for random background button
document.getElementById('random-background-btn').addEventListener('click', () => {
    setBackgroundImage();
});

//Load a random image on first page load
setBackgroundImage();

/* Notes:
– Search theme doesn't work */