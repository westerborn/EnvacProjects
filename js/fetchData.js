export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("Fel vid hämtning eller parsning av JSON:", error);
        throw error; // Viktigt att kasta felet vidare
    }
}