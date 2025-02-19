export function handleSearch(searchInput, tableBody, noResultsMessage) {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!window.projectsData) {
        console.error("handleSearch: window.projectsData är inte definierat!");
        return;
    }

    // Hämta alla valda statusar
    const selectedStatuses = Array.from(document.querySelectorAll('.status-checkbox:checked'))
        .map(checkbox => checkbox.value.toLowerCase());

    if (!searchTerm && selectedStatuses.length === 5) {
        // Visa alla rader om sökfältet är tomt och alla statusar är valda
        Array.from(tableBody.rows).forEach(row => (row.style.display = ""));
        noResultsMessage.style.display = "none";
        return;
    }

    const searchTerms = searchTerm.split(/\s+/); // Dela upp sökningen i flera ord

    let foundRows = 0;
    Array.from(tableBody.rows).forEach(row => {
        const projectStatus = row.getAttribute("data-status")?.toLowerCase(); // Hämta status på raden

        // Hämta endast Projektnummer, Projektnamn och Projektledare för sökning
        const rowText = Array.from(row.cells)
            .slice(0, 3) // Tar bara de första tre kolumnerna
            .map(cell => cell.innerText.toLowerCase())
            .join(" ");

        const matchesAllTerms = searchTerms.every(term => rowText.includes(term)); // Kontrollera att alla ord matchar
        const statusMatch = selectedStatuses.includes(projectStatus); // Kontrollera att status är vald

        if (matchesAllTerms && statusMatch) {
            row.style.display = ""; // Visa raden om både sökning och status stämmer
            foundRows++;
        } else {
            row.style.display = "none"; // Dölj raden om den inte matchar båda
        }
    });

    if (foundRows === 0) {
        noResultsMessage.style.display = "block";
        noResultsMessage.textContent = "Inga matchande projekt hittades.";
    } else {
        noResultsMessage.style.display = "none";
    }
}
