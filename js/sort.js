export function addSortingAndFiltering(table, projectsData, populateTable) {
    const headers = table.querySelectorAll('th[data-column]');
    let currentSortedColumn = null;
    let sortOrder = 'asc';

    headers.forEach(header => {
        const columnName = header.dataset.column;
        header.style.position = 'relative'; // För positionering av dropdown

        // **Lägg till sorteringsfunktionalitet**
        header.addEventListener('click', () => {
            if (currentSortedColumn === columnName) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortOrder = 'asc';
                currentSortedColumn = columnName;
            }

            const sortedProjects = [...projectsData].sort((a, b) => {
                const aValue = a[columnName] || '';
                const bValue = b[columnName] || '';

                if (columnName === "Projektnummer") {
                    return sortOrder === 'asc'
                        ? parseInt(aValue) - parseInt(bValue)
                        : parseInt(bValue) - parseInt(aValue);
                }

                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue, 'sv', { sensitivity: 'base' })
                    : bValue.localeCompare(aValue, 'sv', { sensitivity: 'base' });
            });

            // Uppdatera tabellen med sorterad data
            const tableBody = table.querySelector('tbody');
            tableBody.innerHTML = '';
            populateTable(tableBody, sortedProjects);

            // Uppdatera sorteringsikoner
            headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
            header.classList.add(sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
        });

        // **Skapa dropdown för filtrering**
        const dropdown = document.createElement('div');
        dropdown.classList.add('filter-dropdown');
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.zIndex = '10';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.padding = '10px';
        dropdown.style.display = 'none';
        dropdown.style.maxHeight = '200px';
        dropdown.style.overflowY = 'auto';

        header.appendChild(dropdown);

        // **Lägg till klicklyssnare för att visa/gömma dropdown**
        header.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Förhindra standardmenyn på högerklick
            const isVisible = dropdown.style.display === 'block';
            document.querySelectorAll('.filter-dropdown').forEach(d => (d.style.display = 'none'));
            dropdown.style.display = isVisible ? 'none' : 'block';

            // Fyll dropdown endast om den är tom
            if (!dropdown.hasChildNodes()) {
                const uniqueValues = [...new Set(projectsData.map(p => p[columnName] || ''))].sort();

                console.log('Filtreringsvärden för', columnName, uniqueValues); // Debug-logg

                uniqueValues.forEach(value => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;
                    checkbox.value = value;

                    const label = document.createElement('label');
                    label.textContent = value;
                    label.style.display = 'block';

                    label.prepend(checkbox);
                    dropdown.appendChild(label);

                    // **Lägg till filtreringslogik**
                    checkbox.addEventListener('change', () => {
                        const checkedValues = Array.from(
                            dropdown.querySelectorAll('input[type="checkbox"]:checked')
                        ).map(cb => cb.value);

                        const filteredProjects = projectsData.filter(project =>
                            checkedValues.includes(project[columnName] || '')
                        );

                        tableBody.innerHTML = '';
                        populateTable(tableBody, filteredProjects);
                    });
                });
            }
        });

        // **Stäng dropdown om man klickar utanför**
        document.addEventListener('click', (event) => {
            if (!header.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    });
}

