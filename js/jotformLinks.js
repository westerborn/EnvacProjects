export function generateJotformLink(project, details, employee, formType) {
    if (!project) {
        console.error("❌ Ingen projektdata tillgänglig för Jotform-länk.");
        return null;
    }

    let jotformBaseUrl;

    switch (formType) {
        case "Arbetsberedning":
            jotformBaseUrl = "https://form.jotform.com/233093939506362"; // Arbetsberedning
            break;
        case "Fråga-Svar":
            jotformBaseUrl = "https://form.jotform.com/240384421850351"; // Fråga-Svar
            break;
        case "Egenkontroller projektledare":
            jotformBaseUrl = "https://form.jotform.com/233312151251339"; // Egenkontroller
            break;
        case "Egenkontroll Funktionstest":
            jotformBaseUrl = "https://form.jotform.com/250062390636352"; // Funktionstest
            break;
        case "Servicebesiktning":
            jotformBaseUrl = "https://form.jotform.com/YOUR_SERVICEBESIKTNING_FORM_ID"; // Servicebesiktning
            break;
        case "Anteckning PL":
            jotformBaseUrl = "https://form.jotform.com/241881987718374"; // Anteckning PL
            break;
        default:
            jotformBaseUrl = "https://form.jotform.com/233093939506362"; // Standard (om ingen matchning)
    }

    function sanitizeText(text) {
        if (!text) return "";
        return text
            .replace(/\s+/g, "_")
            .replace(/å|ä/g, "a")
            .replace(/ö/g, "o")
            .replace(/[^a-zA-Z0-9_@.]/g, "");
    }

    function splitName(fullName) {
        if (!fullName) return { fornamn: "", efternamn: "" };
        let nameParts = fullName.trim().split(" ");
        let fornamn = nameParts[0];
        let efternamn = nameParts.slice(1).join(" ");
        return { fornamn: sanitizeText(fornamn), efternamn: sanitizeText(efternamn) };
    }

    let projektledareNamn = splitName(project.Projektledare);

    const params = new URLSearchParams();

    // Grundläggande parametrar (projektnummer och projektnamn)
    const basicParams = new URLSearchParams();
	basicParams.append("projektnummer", sanitizeText(project.Projektnummer));



    switch (formType) {
        case "Arbetsberedning":
            jotformBaseUrl = "https://form.jotform.com/233093939506362"; // Arbetsberedning
            const paramsArbetsberedning = new URLSearchParams(basicParams); // Starta med de grundläggande parametrarna
			if (project && project.Projektledare) {
			    paramsArbetsberedning.append("projektnamn", sanitizeText(project.Projektnamn));
				paramsArbetsberedning.append("fornamn", projektledareNamn.fornamn);
				paramsArbetsberedning.append("efternamn", projektledareNamn.efternamn);
			}
            if (details) {
//				paramsArbetsberedning.append("bestallare", sanitizeText(details.Beställare));
//				paramsArbetsberedning.append("kontaktperson", sanitizeText(details.Kontaktperson));
//				paramsArbetsberedning.append("status", sanitizeText(details.Status));
                // ... andra parametrar för Arbetsberedning
            }
            if (employee) {
                paramsArbetsberedning.append("telefonnummer", sanitizeText(employee.Telefonnummer));
//				paramsArbetsberedning.append("roll", sanitizeText(employee.Roll));
            }
			if (details && details["E-post"]) {
//				paramsArbetsberedning.append("bestallarensEpost", sanitizeText(details["E-post"]));
			}
            if (employee && employee["E-post"]) {
                paramsArbetsberedning.append("email", sanitizeText(employee["E-post"]));
            }
            return `${jotformBaseUrl}?${paramsArbetsberedning.toString()}`;
            break;

        case "Fråga-Svar":
            jotformBaseUrl = "https://form.jotform.com/240384421850351"; // Fråga-Svar
            const paramsFragaSvar = new URLSearchParams(basicParams);  // Starta med de grundläggande parametrarna
			if (project && project.Projektledare) {
				paramsFragaSvar.append("projektledareEnvac", project.Projektledare);
			    paramsFragaSvar.append("projektnamn", project.Projektnamn);
			}
            if (details) {
//				paramsFragaSvar.append("projektledareEnvac", sanitizeText(project.Projektledare));
                paramsFragaSvar.append("bestallarensKontaktperson", sanitizeText(details.Kontaktperson));
            }
            if (details && details["E-post"]) {
                paramsFragaSvar.append("bestallarensEpost", sanitizeText(details["E-post"]));
            }
            if (employee && employee["E-post"]) {
                paramsFragaSvar.append("email", sanitizeText(employee["E-post"]));
                paramsFragaSvar.append("telefonnummer", sanitizeText(employee.Telefonnummer));
            }
            return `${jotformBaseUrl}?${paramsFragaSvar.toString()}`;
            break;

        case "Egenkontroller projektledare":
            jotformBaseUrl = "https://form.jotform.com/233312151251339"; // egenkontroller projektledare
            const paramsEgenkontrollProjektledare = new URLSearchParams(basicParams);  // Starta med de grundläggande parametrarna
			if (project && project.Projektledare) {
				paramsEgenkontrollProjektledare.append("projektledareEnvac", project.Projektledare);
			    paramsEgenkontrollProjektledare.append("projektnamn", project.Projektnamn);
			}


            if (employee && employee["E-post"]) {
                paramsEgenkontrollProjektledare.append("email", sanitizeText(employee["E-post"]));
                paramsEgenkontrollProjektledare.append("telefonnummer", sanitizeText(employee.Telefonnummer));
            }
            return `${jotformBaseUrl}?${paramsEgenkontrollProjektledare.toString()}`;
            break;
			
        case "Egenkontroll Funktionstest":
            jotformBaseUrl = "https://form.jotform.com/250062390636352"; // Validering
            const paramsValidering = new URLSearchParams(basicParams);  // Starta med de grundläggande parametrarna
			if (project && project.Projektledare) {
				paramsValidering.append("projektledareEnvac", project.Projektledare);
			    paramsValidering.append("projektnamn", project.Projektnamn);
			}


            if (employee && employee["E-post"]) {
                paramsValidering.append("email", sanitizeText(employee["E-post"]));
                paramsValidering.append("telefonnummer", sanitizeText(employee.Telefonnummer));
            }
            return `${jotformBaseUrl}?${paramsValidering.toString()}`;
            break;
			
        case "Servicebesiktning":
            // ... Lägg till parametrar som är specifika för Servicebesiktning
            break;
			
        case "Anteckning PL":
            jotformBaseUrl = "https://form.jotform.com/241881987718374"; // Anteckning PL
            const paramsAnteckningPL = new URLSearchParams(basicParams);  // Starta med de grundläggande parametrarna
			if (project && project.Projektledare) {
				paramsAnteckningPL.append("projektledareEnvac", project.Projektledare);
			    paramsAnteckningPL.append("projektnamn", project.Projektnamn);
			}


            if (employee && employee["E-post"]) {
                paramsAnteckningPL.append("email", sanitizeText(employee["E-post"]));
                paramsAnteckningPL.append("telefonnummer", sanitizeText(employee.Telefonnummer));
            }
            return `${jotformBaseUrl}?${paramsAnteckningPL.toString()}`;
            break;
			
		default:
			jotformBaseUrl = "https://form.jotform.com/233093939506362"; // Standard
			return `${jotformBaseUrl}?${basicParams.toString()}`; // Använd de grundläggande parametrarna
			break;
}

	// Hantera e-post från båda källorna
    if (details && details["E-post"]) {
        params.append("bestallarensEpost", sanitizeText(details["E-post"])); // E-post kontaktperson
    }

    if (employee && employee["E-post"]) {
        params.append("projektledare_email", sanitizeText(employee["E-post"])); // E-post projektledare
    }

    if (employee) {
        params.append("telefonnummer", sanitizeText(employee.Telefonnummer));
        params.append("roll", sanitizeText(employee.Roll));
    }

    return `${jotformBaseUrl}?${params.toString()}`;
}