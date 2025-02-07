export function enableRowSelection(tableBody) {
    tableBody.addEventListener('click', (event) => {
        const clickedRow = event.target.closest('tr');
        if (clickedRow) {
            const allRows = tableBody.querySelectorAll('tr');
            allRows.forEach(row => row.classList.remove('selected-row'));
            clickedRow.classList.add('selected-row');
        }
    });
}