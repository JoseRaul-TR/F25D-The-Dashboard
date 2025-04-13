document.addEventListener('DOMContentLoaded', function() {

    // API key for Unsplash
    const UnsplashApiKey = ''; // <–– * IMPORTANT!!!! * Fill in Unsplash API key before test!

    // DOM element references
    const changeBackgroundBtn = document.getElementById('changeBackgroundBtn');
    const randomBackgroundBtn = document.getElementById('randomBackgroundBtn');
    const searchInput = document.getElementById('searchInput');

    // Fetches a random photo URL from the Unsplash API, optionally based on a search query.
    async function fetchUnsplashApiPhoto(query = '') {
        // Check if the Unsplash API key is provided
        if (!UnsplashApiKey) {
            alert("Please enter your Unsplash API key in the code.");
            return null;
        }

        // Construct the Unsplash API URL
        let url = `https://api.unsplash.com/photos/random?client_id=${UnsplashApiKey}`;

        // Add a query parameter if a search term is provided
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }

        try {
            // Fetch data from the Unsplash API
            const response = await fetch(url);
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Parse the JSON response
            const data = await response.json();
            // Extract the regular-sized image URL if it exists
            if (data?.urls?.regular) {
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

    /* Sets the background image of the body element using the provided image URL.
    If no URL is provided, it fetches a random image.*/
    async function setBackgroundImage(query = '') {
        // Fetch the image URL from Unsplash
        const imageUrl = await fetchUnsplashApiPhoto(query);

        // If an image URL was successfully fetched
        if (imageUrl) {
            // Set the background image styles for the body
            document.body.style.backgroundImage = `url('${imageUrl}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundPosition = 'center center';

            // Store the fetched image URL in localStorage to persist across sessions
            localStorage.setItem('lastBackgroundImage', imageUrl);
        } else {
            console.log("Could not fetch image for background");
        }
    }

    // Event listener for the "Change Background" button (using search input)
    if (changeBackgroundBtn) {
        changeBackgroundBtn.addEventListener('click', () => {
            // Get the search query from the input field
            const query = searchInput.value;
            // Set the background image based on the search query
            setBackgroundImage(query);
        });
    }

    // Event listener for the "Random Background" button
    if (randomBackgroundBtn) {
        randomBackgroundBtn.addEventListener('click', () => {
            // Set a random background image (no search query)
            setBackgroundImage();
        });
    }


    /* Loads the last used background image from localStorage and sets it as the body background.
    This function is called on page load to provide persistence. */
    function loadLastBackgroundImage() {
        // Retrieve the last background image URL from localStorage
        const lastImageUrl = localStorage.getItem('lastBackgroundImage');
        // If a last image URL exists
        if (lastImageUrl) {
            // Apply the background image styles to the body
            document.body.style.backgroundImage = `url('${lastImageUrl}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundPosition = 'center center';
        }
    }

    // Call the function to load the last background image when the page loads
    loadLastBackgroundImage();
});