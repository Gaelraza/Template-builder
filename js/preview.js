// Preview Module - Renders live spreadsheet preview

const Preview = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 
             'July', 'August', 'September', 'October', 'November', 'December'],

    render(settings) {
        const container = document.getElementById('previewContainer');
        
        const tableHTML = this.createPreviewTable(settings);
        
        container.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-bold" style="color: ${settings.headerColor}">${settings.templateName}</h3>
                <p class="text-sm text-gray-600">${this.getMonthName(settings.startMonth)} Budget</p>
            </div>
            ${tableHTML}
        `;
        
        this.applyStyles(container, settings);
    },

    createPreviewTable(settings) {
        const { currencySymbol, incomeCategories, expenseCategories, fontFamily } = settings;
        
        let html = '<table class="preview-table" style="font-family: ' + fontFamily + '">';
        
        // Header Row
        html += `
            <thead>
                <tr>
                    <th style="width: 40%">Category</th>
                    <th style="width: 20%">Planned</th>
                    <th style="width: 20%">Actual</th>
                    <th style="width: 20%">Difference</th>
                </tr>
            </thead>
        `;
        
        // Income Section
        html += '<tbody>';
        html += `<tr class="category-header" style="background-color: ${settings.headerColor}80">
                    <td colspan="4">INCOME</td>
                 </tr>`;
        
        incomeCategories.forEach(cat => {
            html += `
                <tr>
                    <td>${cat}</td>
                    <td><span class="input-cell">${currencySymbol}0.00</span></td>
                    <td><span class="input-cell">${currencySymbol}0.00</span></td>
                    <td class="text-right">${currencySymbol}0.00</td>
                </tr>
            `;
        });
        
        // Income Total
        html += `<tr class="total-row">
                    <td>Total Income</td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                 </tr>`;
        
        // Expense Section
        html += `<tr class="category-header" style="background-color: ${settings.headerColor}80">
                    <td colspan="4">EXPENSES</td>
                 </tr>`;
        
        expenseCategories.forEach(cat => {
            html += `
                <tr>
                    <td>${cat}</td>
                    <td><span class="input-cell">${currencySymbol}0.00</span></td>
                    <td><span class="input-cell">${currencySymbol}0.00</span></td>
                    <td class="text-right">${currencySymbol}0.00</td>
                </tr>
            `;
        });
        
        // Expense Total
        html += `<tr class="total-row">
                    <td>Total Expenses</td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                 </tr>`;
        
        // Summary
        html += `<tr class="total-row" style="background-color: ${settings.accentColor}20">
                    <td><strong>NET BALANCE</strong></td>
                    <td colspan="3"><strong style="color: ${settings.accentColor}">${currencySymbol}0.00</strong></td>
                 </tr>`;
        
        html += '</tbody></table>';
        
        return html;
    },

    applyStyles(container, settings) {
        const table = container.querySelector('.preview-table');
        if (!table) return;
        
        // Apply header color
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
            th.style.backgroundColor = settings.headerColor;
        });
        
        // Apply grid lines
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
            cell.style.borderWidth = settings.showGrid ? '1px' : '0';
            cell.style.borderColor = '#e5e7eb';
        });
        
        // Apply conditional formatting colors
        if (settings.conditionalFormatting) {
            const totalRows = table.querySelectorAll('.total-row');
            totalRows.forEach(row => {
                row.style.borderLeft = `4px solid ${settings.accentColor}`;
            });
        }
    },

    getMonthName(monthIndex) {
        return this.months[monthIndex - 1] || 'January';
    }
};

// Global function for HTML onclick handlers
function updatePreview() {
    const settings = Editor.getSettings();
    Preview.render(settings);
}
