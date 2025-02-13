export function handleSearch(searchInput, tableBody, noResultsMessage) {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!window.projectsData) {
        console.error("handleSearch: window.projectsData är inte definierat!");
        return;
    }

    if (!searchTerm) {
        // Visa alla rader om sökfältet är tomt
        Array.from(tableBody.rows).forEach(row => (row.style.display = ""));
        noResultsMessage.style.display = "none";
        return;
    }

    const searchTerms = searchTerm.split(/\s+/); // Dela upp sökningen i flera ord

    let foundRows = 0;
    Array.from(tableBody.rows).forEach(row => {
        // const rowText = row.innerText.toLowerCase(); // Kombinera all text i raden
		const rowText = Array.from(row.cells)
    .slice(0, 3) // Tar bara de första tre kolumnerna (Projektnummer, Projektnamn, Projektledare)
    .map(cell => cell.innerText.toLowerCase())
    .join(" ");

        const matchesAllTerms = searchTerms.every(term => rowText.includes(term)); // Kontrollera att alla ord matchar

        if (matchesAllTerms) {
            row.style.display = ""; // Visa raden om alla ord hittas
            foundRows++;
        } else {
            row.style.display = "none"; // Dölj raden om något ord saknas
        }
    });

    if (foundRows === 0) {
        noResultsMessage.style.display = "block";
        noResultsMessage.textContent = "Inga matchande projekt hittades.";
    } else {
        noResultsMessage.style.display = "none";
    }
}
