const linkList = document.getElementById('linkList');
const addLinkSign = document.getElementById('addLinkSign');
const addLinkInputsForm = document.getElementById('addLinkInputs');
const addLinkButton = document.getElementById('addLinkButton');
const linkTitleInput = document.getElementById('linkTitle');
const linkUrlInput = document.getElementById('linkUrl');
console.log('links-widget.js loaded');

let links = loadLinks();
console.log('Loaded links:', links);

const defaultLinks = [
    { title: 'Google', url: 'https://google.com' },
    { title: 'YouTube', url: 'https://www.youtube.com/' },
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'ChatGPT', url: 'https://chat.openai.com/' }
];

// Initialize links with defaults if no links are saved
if (!localStorage.getItem('dashboardLinks')) {
    links = [...defaultLinks];
    saveLinks(); // Save the default links to localStorage
    console.log('Default links saved for the first time');
}

renderLinks();
console.log('Links rendered');

addLinkSign.addEventListener('click', toggleAddLinkForm);
addLinkButton.addEventListener('click', addLink);

function toggleAddLinkForm() {
    addLinkSign.classList.toggle('open');
    addLinkInputsForm.style.display = addLinkSign.classList.contains('open') ? 'flex' : 'none';
    // Clear input fields when opening the form
    if (addLinkSign.classList.contains('open')) {
        linkTitleInput.value = '';
        linkUrlInput.value = '';
    }
}

function loadLinks() {
    const storedLinks = localStorage.getItem('dashboardLinks');
    return storedLinks ? JSON.parse(storedLinks) : [];
}

function saveLinks() {
    localStorage.setItem('dashboardLinks', JSON.stringify(links));
}

function renderLinks() {
    linkList.innerHTML = '';
    links.forEach((link, index) => {
        const listItem = document.createElement('li');
        const faviconUrl = `https://www.google.com/s2/favicons?sz=16&domain=${new URL(link.url).hostname}`;
        const faviconImg = document.createElement('img');
        faviconImg.src = faviconUrl;
        faviconImg.alt = `${link.title} favicon`;

        const linkAnchor = document.createElement('a');
        linkAnchor.href = link.url;
        linkAnchor.textContent = link.title;
        linkAnchor.target = '_blank'; // Open in a new tab

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editLink(index));

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteLink(index));

        listItem.appendChild(faviconImg);
        listItem.appendChild(linkAnchor);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        linkList.appendChild(listItem);
    });
}

let editingIndex = -1; // To keep track of the link being edited

function editLink(index) {
    editingIndex = index;
    const linkToEdit = links[index];
    linkTitleInput.value = linkToEdit.title;
    linkUrlInput.value = linkToEdit.url;
    addLinkButton.textContent = 'Spara ändringar';
    toggleAddLinkForm(); // Open the form with the link details
}

function addLink() {
    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (title && url) {
        if (editingIndex !== -1) {
            // Update existing link
            links[editingIndex] = { title, url };
            editingIndex = -1; // Reset editing index
            addLinkButton.textContent = 'Lägg till länk'; // Reset button text
        } else {
            // Add new link
            links.push({ title, url });
        }
        saveLinks();
        renderLinks();
        linkTitleInput.value = '';
        linkUrlInput.value = '';
        toggleAddLinkForm(); // Hide the form after adding/editing
    } else {
        alert('Vänligen fyll i både titel och URL.');
    }
}

function deleteLink(index) {
    if (confirm('Är du säker på att du vill ta bort denna länk?')) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }
};