export function populateTable(tableBody, projects) {
    tableBody.innerHTML = '';
    for (const project of projects) {
        const row = tableBody.insertRow();
        row.insertCell().textContent = project.Projektnummer;
        row.insertCell().textContent = project.Projektnamn;
        row.insertCell().textContent = project.Projektledare;

        const details = window.detailsData.find(d => d.Projektnummer === project.Projektnummer);
        const anläggning = details ? details.Anläggning || "-" : "-";

        row.insertCell().textContent = anläggning;
    }
}