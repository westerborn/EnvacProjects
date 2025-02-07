import { fetchData } from './fetchData.js';
import { populateTable } from './tableUtils.js';
import { handleSearch } from './search.js';
import { addSortingAndFiltering } from './sort.js'; // Korrekt import!
import { createNameLinks, createGenericLinks } from './linkGeneration.js';
import { enableRowSelection } from './rowSelection.js';
import { generateJotformLink } from './jotformLinks.js';


// Hämta HTML-element
const debugDiv = document.getElementById('debug');
const table = document.getElementById('project-table');
const tableBody = document.getElementById('project-table').getElementsByTagName('tbody')[0];
const noResultsMessage = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const clearSearchButton = document.getElementById('clear-search');
const linkContainerLeft = document.getElementById('link-container');
const linkContainerRight = document.getElementById('link-container-right');

let projectsData = [];
let detailsData = [];

function displayDebug(message) {
    console.log(message);
    debugDiv.innerHTML += message + "<br>";
}

// **Ladda projekt- och detaljdata**
async function loadData() {
    try {
        console.log("🔄 loadData: Startar...");

        // Hämta projects.json
        const projectsResponse = await fetch('projects.json');
        if (!projectsResponse.ok) throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        const projectsData = await projectsResponse.json();

        // Hämta project_details.json
        const detailsResponse = await fetch('project_details.json');
        if (!detailsResponse.ok) throw new Error(`HTTP error! status: ${detailsResponse.status}`);
        const detailsData = await detailsResponse.json();

        // Hämta employee.json
        const employeeResponse = await fetch('employee.json');
        if (!employeeResponse.ok) throw new Error(`HTTP error! status: ${employeeResponse.status}`);
        const employeeData = await employeeResponse.json();

        console.log("✅ Data laddad:", { projects: projectsData.projects, details: detailsData.details, employees: employeeData.employee });

        return { projects: projectsData.projects, details: detailsData.details, employees: employeeData.employee };
    } catch (error) {
        console.error("❌ Fel vid laddning av data:", error);
        return null;
    }
}


// **Initiera applikationen**
async function init() {
    try {
        console.log("🚀 init: Startar...");
        const data = await loadData();
        if (!data) {
            console.error("❌ Ingen data kunde laddas. Avbryter initiering.");
            return;
        }

        // Tilldela data till globala variabler
		window.projectsData = data.projects;
        window.detailsData = data.details;
        window.employeesData = data.employees;
        projectsData = data.projects;
        detailsData = data.details;
		employeesData = data.employees;
		
        console.log("✅ All data laddad:", window.projectsData, window.detailsData, window.employeesData);

        if (!projectsData || projectsData.length === 0) {
            console.warn("⚠️ Inga projekt hittades i projects.json!");
            noResultsMessage.style.display = 'block';
            noResultsMessage.textContent = "Inga projekt hittades.";
            return;
        }

        // **Lägg till funktionalitet**
        noResultsMessage.style.display = 'none';
        populateTable(tableBody, projectsData); // Populera tabellen

        // **Aktivera sökning**
        searchInput.addEventListener('keyup', () => handleSearch(searchInput, tableBody, noResultsMessage));

        // **Lägg till sortering & filtrering**
        addSortingAndFiltering(table, projectsData, populateTable);

        // **Lägg till snabblänkar**
        createNameLinks(projectsData, searchInput, () => handleSearch(searchInput, tableBody, noResultsMessage), linkContainerLeft);
        createGenericLinks(linkContainerRight, 10);

        // **Aktivera radval**
        enableRowSelection(tableBody);

        // **Rensa sökning**
        clearSearchButton.addEventListener('click', () => {
            searchInput.value = '';
            handleSearch(searchInput, tableBody, noResultsMessage);
            tableBody.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));
            setGenericLinksState(false);
        });

        // **Hantering av projektval**
        let selectedProjectNumber = null;
tableBody.addEventListener('click', (event) => {
    const clickedRow = event.target.closest('tr');
    if (clickedRow) {
        tableBody.querySelectorAll('tr').forEach(row => row.classList.remove('selected-row'));
        clickedRow.classList.add('selected-row');

        window.selectedProjectNumber = clickedRow.cells[0].textContent.trim();
        console.log("✅ Vald projekt:", window.selectedProjectNumber); // Debug-logg

        setGenericLinksState(true); // Aktivera länkarna
    } else {
        setGenericLinksState(false);
        window.selectedProjectNumber = null;
    }
});


// **Popup-visning vid klick på "Översikt"**
const overviewButton = document.querySelector('.overview-button');
if (overviewButton) {
    overviewButton.addEventListener('click', () => {
        console.log("🔹 Klick på Översikt. Vald projekt:", window.selectedProjectNumber);

        if (!window.selectedProjectNumber) {
            alert("Inget projekt är valt.");
            return;
        }

        // Hämta projektdata
        const project = window.projectsData.find(p => String(p.Projektnummer).trim() === String(window.selectedProjectNumber).trim());
        console.log("🔎 Hittat projekt:", project); // Debug-logg

        if (!project) {
            alert("Projektet kunde inte hittas.");
            return;
        }

        const details = window.detailsData.find(d => d.Projektnummer === project.Projektnummer);
        const employee = window.employeesData.find(e => e.Namn === project.Projektledare);

        showProjectDetailsPopup(project, details, employee);
    });
} else {
    console.error("❌ Översikt-knappen hittades inte!");
}

const arbetsberedningButton = document.querySelector('.arbetsberedning-button');
if (arbetsberedningButton) {
    arbetsberedningButton.addEventListener('click', () => {
        console.log("🔹 Klick på Arbetsberedning. Vald projekt:", window.selectedProjectNumber); // Debug-logg

        if (!window.selectedProjectNumber) {
            alert("Inget projekt är valt.");
            return;
        }

        // Hämta projektdata
        const project = window.projectsData.find(p => String(p.Projektnummer).trim() === String(window.selectedProjectNumber).trim());
        console.log("🔎 Hittat projekt:", project);

        if (!project) {
            alert("Projektet kunde inte hittas.");
            return;
        }

        // Hämta projektinformation från `project_details.json`
        const details = window.detailsData.find(d => d.Projektnummer === project.Projektnummer);
        
        // Hämta projektledarens information från `employee.json`
        const employee = window.employeesData.find(e => e.Namn === project.Projektledare);

        // Skapa Jotform-länken
        const jotformLink = generateJotformLink(project, details, employee, "Arbetsberedning");
        console.log("🔗 Jotform-länk genererad:", jotformLink);

        // Öppna länken i en ny flik
		if (!window.jotformWindow || window.jotformWindow.closed) {
		window.jotformWindow = window.open(jotformLink, '_blank');
}

    });
} else {
    console.error("❌ Arbetsberedning-knappen hittades inte!");
}


    } catch (error) {
        displayDebug("Ett fel inträffade vid initieringen: " + error);
        console.error("❌ Fel:", error);
    }
}

// **Hantering av generiska länkar**
function setGenericLinksState(enabled) {
    const genericLinks = linkContainerRight.querySelectorAll('button');
    genericLinks.forEach(link => {
        link.disabled = !enabled;
        link.classList.toggle('active', enabled);
    });
}

// **Visa popup med projektdetaljer**
function showProjectDetailsPopup(project, details, employee) {
    if (!project) {
        alert("Inget projekt är valt.");
        return;
    }

    console.log("📌 Popup öppnas med följande data:");
    console.log("🔹 Projektdata:", project);
    console.log("🔹 Projektinformation (detailsData):", details);
    console.log("🔹 Anställd (employeeData):", employee);

    // Bygg popup-innehållet
    let popupContent = `
        <p><strong>Projektnummer:</strong> ${project.Projektnummer}</p>
        <p><strong>Projektledare:</strong> ${project.Projektledare}</p>
        <p><strong>Kund:</strong> ${project.Kund}</p>
        <p><strong>Projektstatus:</strong> ${project.Projektstatus}</p>
    `;

    // Om projektledaren finns i employee.json, lägg till deras information
    if (employee) {
        popupContent += `<h5>Kontaktuppgifter</h5>`;
        popupContent += `<p><strong>Namn:</strong> ${employee.Namn}</p>`;
        popupContent += `<p><strong>E-post:</strong> <a href="mailto:${employee["E-post"]}">${employee["E-post"]}</a></p>`;
        popupContent += `<p><strong>Telefonnummer:</strong> ${employee.Telefonnummer}</p>`;
        popupContent += `<p><strong>Roll:</strong> ${employee.Roll}</p>`;
    }

    // Lägg till detaljer från `project_details.json`
    if (details) {
        popupContent += `<h5>Projektinformation</h5>`;
        Object.entries(details).forEach(([key, value]) => {
            if (key !== "Projektnummer" && key !== "Projektnamn") { 
                popupContent += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        });
    } else {
        popupContent += `<p><i>Ingen ytterligare information hittades.</i></p>`;
    }

    // Skapa popup-elementet
    const popup = document.createElement('div');
    popup.id = 'project-details-popup';
    popup.classList.add('modal', 'fade', 'show');
    popup.style.display = 'block';
    popup.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${project.Projektnamn}</h5> 
                    <button type="button" class="btn-close" id="close-popup"></button>
                </div>
                <div class="modal-body">${popupContent}</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="close-popup-footer">Stäng</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Lägg till event listeners för att stänga popupen
    document.getElementById('close-popup').addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    document.getElementById('close-popup-footer').addEventListener('click', () => {
        document.body.removeChild(popup);
    });
}


// **Starta applikationen**
init();
