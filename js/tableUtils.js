export function populateTable(tableBody, projects) {
    tableBody.innerHTML = '';
    for (const project of projects) {
        const row = tableBody.insertRow();
        row.setAttribute("data-status", project.Projektstatus);

        row.insertCell().textContent = project.Projektnummer;
        row.insertCell().textContent = project.Projektnamn;
        row.insertCell().textContent = project.Projektledare;

        // 🔹 Lägg till debug-logg
        // console.log("Lägger till projekt:", project.Projektnummer, "Status:", project.Projektstatus);

        // 🔹 Ny cell för status
        const statusCell = row.insertCell();
        statusCell.textContent = project.Projektstatus;
        statusCell.classList.add("status-cell");
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
