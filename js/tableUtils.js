export function populateTable(tableBody, projects) {
    tableBody.innerHTML = '';
    for (const project of projects) {
        const row = tableBody.insertRow();
        row.insertCell().textContent = project.Projektnummer;
        row.insertCell().textContent = project.Projektnamn;
        row.insertCell().textContent = project.Projektledare;

        // const details = window.detailsData.find(d => d.Projektnummer === project.Projektnummer);
        // const anläggning = details ? details.Anläggning || "-" : "-";

        // row.insertCell().textContent = anläggning;
    }
}

// export function populateTable(tableBody, projects) {
    // tableBody.innerHTML = '';
    // for (const project of projects) {
        // const row = tableBody.insertRow();
        // row.insertCell().textContent = project.Projektnummer;
        // row.insertCell().textContent = project.Projektnamn;
        // row.insertCell().textContent = project.Projektledare;

        // const details = window.detailsData.find(d => d.Projektnummer === project.Projektnummer);
        // const anläggning = details ? details.Anläggning || "-" : "-";

        // Skapa en cell för "Anläggning" men göm den med en klass
        // const anläggningCell = row.insertCell();
        // anläggningCell.textContent = anläggning;
        // anläggningCell.classList.add('hidden-column');
    // }
// }
