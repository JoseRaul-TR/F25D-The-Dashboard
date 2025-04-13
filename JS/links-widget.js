document.addEventListener('DOMContentLoaded', () => {

    // Get references to DOM elements
    const linkList = document.getElementById('linkList');
    const addLinkSign = document.getElementById('addLinkSign');
    const addLinkInputs = document.getElementById('addLinkInputs');
    const addLinkButton = document.getElementById('addLinkButton');
    const linkTitleInput = document.getElementById('linkTitle');
    const linkUrlInput = document.getElementById('linkUrl');

    // Load existing links from local storage or use default links
    let links = loadLinks();
    // Variable to track the index of the link being edited (-1 if not editing)
    let editingIndex = -1;

    // Default array of links if none are found in local storage
    const defaultLinks = [
        { title: 'Google', url: 'https://google.com' },
        { title: 'YouTube', url: 'https://www.youtube.com/' },
        { title: 'GitHub', url: 'https://github.com' },
        { title: 'ChatGPT', url: 'https://chat.openai.com/' }
    ];

    // Initialize links with defaults if no links are saved
    if (!localStorage.getItem('dashboardLinks')) {
        links = [...defaultLinks];
        saveLinks();
    }

    // Render the initial list of links on page load
    renderLinks();

    // Event listener to toggle the visibility of the add link form
    if (addLinkSign) {
        addLinkSign.addEventListener('click', toggleAddLinkForm);
    }

    // Event listener to handle adding or editing a link
    if (addLinkButton) {
        addLinkButton.addEventListener('click', addLink);
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }


    /* Toggles the visibility of the add link input form.
    Also handles resetting the form and edit state. */
    function toggleAddLinkForm() {
        // Toggle the 'open' class for the plus sign (likely used for visual indication)
        if (addLinkSign) {
            addLinkSign.classList.toggle('open');
        }
        // Toggle the 'open' class for the input fields container
        if (addLinkInputs) {
            addLinkInputs.classList.toggle('open');
        }
        // If opening the form for adding a new link, clear the input fields
        if (addLinkSign && addLinkSign.classList.contains('open') && editingIndex === -1) {
            if (linkTitleInput) {
                linkTitleInput.value = '';
            }
            if (linkUrlInput) {
                linkUrlInput.value = '';
            }
        }
        // If closing the form after editing, reset the editing index and button text
        if (addLinkSign && !addLinkSign.classList.contains('open') && editingIndex !== -1) {
            editingIndex = -1;
            if (addLinkButton) {
                addLinkButton.textContent = 'Lägg till länk';
            }
        }
    }

    function loadLinks() {
        try {
            const storedLinks = localStorage.getItem('dashboardLinks');
            return storedLinks ? JSON.parse(storedLinks) : [];
        } catch (error) {
            console.error('Error loading links from local storage:', error);
            alert('Kunde inte ladda länkarna från lokal lagring.'); // Inform the user
            return []; // Return an empty array to prevent further errors
        }
    }

    // Saves the current array of links to local storage.
    function saveLinks() {
        try {
            localStorage.setItem('dashboardLinks', JSON.stringify(links));
        } catch (error) {
            console.error('Error saving links to local storage:', error);
            alert('Kunde inte spara länkarna till lokal lagring.'); // Inform the user
        }
    }

    // Renders the list of links in the UI.
    function renderLinks() {
        if (!linkList) return;
        linkList.innerHTML = ''; // Clear the existing list

        links.forEach((link, index) => {
            const listItem = document.createElement('li');
            // Construct the URL for the favicon using Google's service
            const faviconUrl = `https://www.google.com/s2/favicons?sz=16&domain=${new URL(link.url).hostname}`;
            const faviconImg = document.createElement('img');
            faviconImg.src = faviconUrl;
            faviconImg.alt = `${link.title} favicon`;

            const linkAnchor = document.createElement('a');
            linkAnchor.href = link.url;
            linkAnchor.textContent = link.title;
            linkAnchor.target = '_blank'; // Open in a new tab

            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Use Font Awesome edit icon
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editLink(index));

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Use Font Awesome trash icon
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteLink(index));

            listItem.appendChild(faviconImg);
            listItem.appendChild(linkAnchor);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            linkList.appendChild(listItem);
        });
    }

    function editLink(index) {
        editingIndex = index; // Set the index of the link being edited
        const linkToEdit = links[index];
        if (linkTitleInput) {
            linkTitleInput.value = linkToEdit.title;
        }
        if (linkUrlInput) {
            linkUrlInput.value = linkToEdit.url;
        }
        if (addLinkButton) {
            addLinkButton.textContent = 'Spara ändringar'; // Change button text to indicate edit mode
        }
        toggleAddLinkForm(); // Open the form with the link details
    }

    /* Adds a new link or saves changes to an existing link. */
    function addLink() {
        if (!linkTitleInput || !linkUrlInput || !addLinkButton) return;

        const title = linkTitleInput.value.trim();
        const url = linkUrlInput.value.trim();

        // Basic validation for title and URL
        if (!title) {
            alert('Vänligen ange en titel för länken.');
            return;
        }

        if (!url) {
            alert('Vänligen ange en URL för länken.');
            return;
        }

        // Validate the URL format
        if (!isValidUrl(url)) {
            alert('Ogiltig URL. Ange en korrekt webbadress (t.ex., https://www.example.com).');
            return;
        }

        // If in edit mode, update the existing link
        if (editingIndex !== -1) {
            links[editingIndex] = { title, url };
            editingIndex = -1; // Reset editing index
            addLinkButton.textContent = 'Lägg till länk'; // Reset button text
        } else {
            // Otherwise, add a new link to the array
            links.push({ title, url });
        }

        // Save the updated links to local storage and re-render the list
        saveLinks();
        renderLinks();
        // Clear the input fields after adding/editing
        linkTitleInput.value = '';
        linkUrlInput.value = '';
        toggleAddLinkForm(); // Hide the form after adding/editing
    }

    // Deletes a link from the list.
    function deleteLink(index) {
        if (confirm('Är du säker på att du vill ta bort denna länk?')) {
            links.splice(index, 1); // Remove the link from the array
            saveLinks(); // Save the updated links
            renderLinks(); // Re-render the list
        }
    };
});