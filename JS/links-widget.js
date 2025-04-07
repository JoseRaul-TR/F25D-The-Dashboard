const linkList = document.getElementById('linkList');
        const addLinkSign = document.getElementById('addLinkSign');
        const addLinkInputsForm = document.getElementById('addLinkInputs');
        const addLinkButton = document.getElementById('addLinkButton');
        const linkTitleInput = document.getElementById('linkTitle');
        const linkUrlInput = document.getElementById('linkUrl');
        console.log('links-widget.js loaded');
        let links = loadLinks();
        console.log('Loaded links:', links);

        // Add default links if no links are saved yet
        if (links.length === 0) {
            console.log('No links found, adding defaults');
            links = [
                { title: 'Google', url: 'https://www.google.com' },
                { title: 'YouTube', url: 'https://www.youtube.com' },
                { title: 'Facebook', url: 'https://www.facebook.com' },
                { title: 'Twitter', url: 'https://twitter.com' }
            ];
            saveLinks(); // Save the default links to localStorage
            console.log('Default links saved');

        }

        renderLinks();
        console.log('Links rendered');

        addLinkSign.addEventListener('click', toggleAddLinkForm);
        addLinkButton.addEventListener('click', addLink);

        function toggleAddLinkForm() {
            addLinkInputsForm.style.display = addLinkInputsForm.style.display === 'none' ? 'flex' : 'none';
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

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.addEventListener('click', () => deleteLink(index));

                listItem.appendChild(faviconImg);
                listItem.appendChild(linkAnchor);
                listItem.appendChild(deleteButton);
                linkList.appendChild(listItem);
            });
        }

        function addLink() {
            const title = linkTitleInput.value.trim();
            const url = linkUrlInput.value.trim();

            if (title && url) {
                links.push({ title, url });
                saveLinks();
                renderLinks();
                linkTitleInput.value = '';
                linkUrlInput.value = '';
                toggleAddLinkForm(); // Hide the form after adding
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
        }

        /* Notes: 
        – Keep working in code */