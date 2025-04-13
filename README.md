# F25D-The Dashboard #

<img width="1470" alt="Captura de pantalla 2025-04-13 a las 11 59 41" src="https://github.com/user-attachments/assets/cf3dda46-2d25-439b-8646-1c9cce01f1d8" />

This is a personal web dashboard designed to provide quick access to useful information and tools in one place. It includes several widgets for different functionalities, all built using HTML, CSS, and JavaScript with local storage for data persistence.

## Features

The dashboard currently includes the following widgets:

* **Time and Date Display:**
    * Displays the current time (HH:MM) and date (Weekday, Day Month Year).
    * Updates dynamically every second.
* **Customizable Heading:**
    * Allows you to change the main heading text (`<h1>`) and the document title (`<title>`).
    * Provides a color picker to customize the heading text color.
    * Settings are saved to and loaded from local storage.
* **Links Widget:**
    * Allows you to add, edit, and delete custom website links with titles and URLs.
    * Displays links as a list with edit and delete buttons.
    * Uses local storage to save and load your links.
* **Weather Widget:**
    * Displays the current weather (temperature, description, icon) and a 5-day forecast for a specified location.
    * Fetches weather data from the OpenWeatherMap API.
    * Allows you to use your current location via geolocation or enter a city manually.
    * Saves the last viewed location in local storage.
* **Police Events Feed:**
    * Displays a feed of recent police events from the Polisen.se API.
    * Allows filtering events by type and location using dropdown selectors.
    * Populates dropdown selectors dynamically from the API data.
* **Notes Widget:**
    * A simple textarea for taking quick notes.
    * Notes are automatically saved to and loaded from local storage as you type.
* **Background Image Changer:**
    * Allows you to set the dashboard background to a random image or search for specific images using the Unsplash API.
    * Saves the last used background image in local storage.

## Technologies Used

* HTML
* CSS
* JavaScript
* [Font Awesome](https://fontawesome.com/) (for icons)
* [Google Fonts](https://fonts.google.com/) (for custom font)
* [OpenWeatherMap API](https://openweathermap.org/api) (for weather data)
* [Polisen.se API](https://polisen.se/api/) (for police events)
* [Unsplash API](https://unsplash.com/developers) (for background images)

## Setup

To use this dashboard:

1.  **Clone the repository** (if you have the code in a repository).
2.  **Open the `index.html` file** in your web browser.

The widgets should load and function automatically.

### API Keys

* **OpenWeatherMap API Key:** You will need to fill in `const openWeatherApiKey = '';` in the `weather widget` JavaScript code with your own API key from [OpenWeatherMap](https://openweathermap.org/api).
* **Unsplash API Key:** You will need to fill in ` const UnsplashApiKey = '';` in the `background image changer` JavaScript code with your own API key from [Unsplash](https://unsplash.com/developers).

**Important:** Ensure you replace these placeholder API keys with your actual keys for the weather and background image widgets to function correctly.

## Local Storage

This dashboard utilizes local storage in your browser to persist data for the following widgets:

* Links Widget (saved links)
* Weather Widget (last viewed location)
* Notes Widget (saved note)
* Background Image Changer (last used background image URL)
* Customizable Heading (custom title text for `<title>` and `<h1>`, and heading color)

## Potential Improvements

Here are some potential areas for future development:

* **User Interface:** Enhance the user interface for adding, editing, and managing links, and interacting with other widgets for a more intuitive experience.
* **More Widgets:** Add more widgets for other useful information or tools (e.g., a to-do list, news feed, calendar).
* **User Configuration:** Allow users to customize the layout and which widgets are displayed, and potentially their order.
* **Data Backup/Export:** Implement functionality to backup or export data stored in local storage.
* **Accessibility:** Improve the accessibility of the dashboard for users with disabilities (e.g., ARIA attributes, keyboard navigation).
* **Theming:** Allow users to switch between light and dark themes, potentially with more customization options.

### JavaScript Code Improvements

* **Modularity:** Break down the JavaScript code into smaller, more manageable modules or components (e.g., using ES modules) to improve organization and reusability.
* **Error Handling:** Implement more robust error handling for API requests (e.g., displaying informative messages to the user when API calls fail) and local storage operations.
* **State Management:** For more complex interactions and data flow between widgets, consider using a simple state management pattern or a lightweight state management library.
* **Asynchronous Operations:** Ensure consistent and clear handling of asynchronous operations using `async/await` and provide visual feedback (e.g., loading indicators) when fetching data.
* **DOM Manipulation:** Optimize DOM manipulation for performance, especially in widgets that update frequently. Consider using techniques like virtual DOM or efficient event delegation.
* **Code Reusability:** Identify and refactor common utility functions (e.g., functions for API calls, local storage interactions) to reduce code duplication.
* **Input Validation:** Implement client-side validation for user inputs in forms (e.g., link URLs, weather location).
* **Configuration:** Externalize configuration options (e.g., API URLs, default settings) to make the code more adaptable.
* **Accessibility (JS):** Ensure JavaScript enhances accessibility by managing focus, providing ARIA attributes for dynamic content, and handling keyboard interactions appropriately.

## Author

José Raúl Tenza Ramírez

## License

All rights reserved
