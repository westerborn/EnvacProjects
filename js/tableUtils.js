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

