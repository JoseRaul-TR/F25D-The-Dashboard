async function fetchRandomUnsplashPhoto() {
    const apiKey = ''; // Replace with your Unsplash API key
    const url = `https://api.unsplash.com/photos/random?client_id=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.urls.regular; // Return the URL of the regular-sized image
    } catch (error) {
        console.error('Error fetching Unsplash photo:', error);
        return null; // Return null in case of an error
    }
}

// Example usage:
async function setRandomBackgroundImage() {
    const imageUrl = await fetchRandomUnsplashPhoto();
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

//To call the function when the page loads, or a button click.
setRandomBackgroundImage();