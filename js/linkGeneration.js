import { generateJotformLink } from './jotformLinks.js';

export function createGenericLinks(linkContainer, count) {
    linkContainer.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Snabblänkar';
    const h3 = document.createElement('h3');
    h3.textContent = 'Länkar';
    linkContainer.appendChild(h2);
    linkContainer.appendChild(h3);

    for (let i = 1; i <= count; i++) {
        const linkButton = document.createElement('button');
        linkButton.classList.add('btn', 'btn-outline-primary', 'w-100', 'mb-2');
        linkButton.disabled = true; // Inaktivera knappen tills ett projekt är valt

        switch (i) {
            case 1:
                linkButton.textContent = "Översikt";
                linkButton.classList.add("overview-button");
                break;
            case 2:
                linkButton.textContent = "Arbetsberedning";
                break;
            case 3:
                linkButton.textContent = "Fråga-Svar";
                break;
            case 4:
                linkButton.textContent = "Egenkontroller projektledare";
                break;
            case 5:
                linkButton.textContent = "Egenkontroll Funktionstest";
                break;
            case 6:
                linkButton.textContent = "Servicebesiktning";
                break;
            case 7:
                linkButton.textContent = "Överlämning Service";
                break;
            // ... Fler fall för andra knappar
        }

        // Lägg till klickhanterare för alla knappar utom "Översikt"
        if (i !== 1) {
            linkButton.addEventListener('click', () => openJotformLink(linkButton.textContent));
        }

        linkContainer.appendChild(linkButton);
    }
}


export function openJotformLink(formType) {
    console.log(`🔹 Klick på ${formType}. Vald projekt:`, window.selectedProjectNumber);

    if (!window.selectedProjectNumber) {
        alert("Inget projekt är valt.");
        return;
    }

    // Hämta projektdata
    const project = window.projectsData.find(p => String(p.Projektnummer).trim() === String(window.selectedProjectNumber).trim());
    if (!project) {
        alert("Projektet kunde inte hittas.");
        return;
    }

    const details = window.detailsData.find(d => d.Projektnummer === project.Projektnummer);
    const employee = window.employeesData.find(e => e.Namn === project.Projektledare);

    const jotformLink = generateJotformLink(project, details, employee, formType);
    console.log("🔗 Jotform-länk genererad:", jotformLink);

    window.open(jotformLink, '_blank'); // Öppnar länken i en ny flik
}
