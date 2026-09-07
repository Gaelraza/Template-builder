// Preview Module - Renders live spreadsheet preview

const Preview = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 
             'July', 'August', 'September', 'October', 'November', 'December'],

    render(settings) {
        const container = document.getElementById('previewContainer');
        
        const tableHTML = this.createPreviewTable(settings);
        const dashboardHTML = this.createDashboard(settings);
        const chartsHTML = this.createChartsSection();
        
        container.innerHTML = `
            <div class="mb-6">
                <h3 class="text-xl font-bold" style="color: ${settings.headerColor}">${settings.templateName}</h3>
                <p class="text-sm text-gray-600">${this.getMonthName(settings.startMonth)} Budget</p>
            </div>
            ${dashboardHTML}
            ${chartsHTML}
            <div class="mt-6">
                <h4 class="font-semibold mb-3 text-gray-700">Detailed View</h4>
                ${tableHTML}
            </div>
        `;
        
        this.applyStyles(container, settings);
        
        // Render charts after DOM is updated
        setTimeout(() => {
            if (window.Charts) {
                window.Charts.render(settings);
            }
        }, 100);
    },

    createDashboard(settings) {
        const { currencySymbol, incomeCategories, expenseCategories, accentColor } = settings;
        
        const totalIncome = incomeCategories.reduce((sum, cat) => sum + (parseFloat(cat.value) || 0), 0);
        const totalExpenses = expenseCategories.reduce((sum, cat) => sum + (parseFloat(cat.value) || 0), 0);
        const netBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
        
        const isPositive = netBalance >= 0;
        const balanceColor = isPositive ? '#10b981' : '#ef4444';
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg shadow border-l-4" style="border-color: ${settings.primaryColor}">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Total Income</p>
                    <p class="text-2xl font-bold" style="color: ${settings.primaryColor}">${currencySymbol}${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border-l-4" style="border-color: ${settings.secondaryColor}">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Total Expenses</p>
                    <p class="text-2xl font-bold" style="color: ${settings.secondaryColor}">${currencySymbol}${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border-l-4" style="border-color: ${balanceColor}">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Net Balance</p>
                    <p class="text-2xl font-bold" style="color: ${balanceColor}">${currencySymbol}${netBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border-l-4" style="border-color: ${accentColor}">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Savings Rate</p>
                    <p class="text-2xl font-bold" style="color: ${accentColor}">${savingsRate.toFixed(1)}%</p>
                </div>
            </div>
        `;
    },

    createChartsSection() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-4 rounded-lg shadow">
                    <h4 class="font-semibold mb-3 text-gray-700 text-sm">Income vs Expenses</h4>
                    <div class="h-48">
                        <canvas id="barChart"></canvas>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <h4 class="font-semibold mb-3 text-gray-700 text-sm">Expense Breakdown</h4>
                    <div class="h-48">
                        <canvas id="pieChart"></canvas>
                    </div>
                </div>
            </div>
        `;
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
            const value = parseFloat(cat.value) || 0;
            const textColor = window.Formatting ? window.Formatting.getValueColor(value) : '#1f2937';
            
            html += `
                <tr>
                    <td>${cat.name || cat}</td>
                    <td><span class="input-cell" style="color: ${textColor}">${currencySymbol}${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></td>
                    <td><span class="input-cell">${currencySymbol}0.00</span></td>
                    <td class="text-right">${currencySymbol}0.00</td>
                </tr>
            `;
        });
        
        // Income Total
        const totalIncome = incomeCategories.reduce((sum, cat) => sum + (parseFloat(cat.value) || 0), 0);
        const incomeStyle = window.Formatting ? window.Formatting.getExcelStyle(totalIncome, 'total') : {};
        const incomeColor = incomeStyle.font && incomeStyle.font.color && incomeStyle.font.color.rgb ? '#' + incomeStyle.font.color.rgb : '#1f2937';
        
        html += `<tr class="total-row">
                    <td>Total Income</td>
                    <td><strong style="color: ${incomeColor}">${currencySymbol}${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                    <td><strong>${currencySymbol}${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                 </tr>`;
        
        // Expense Section
        html += `<tr class="category-header" style="background-color: ${settings.headerColor}80">
                    <td colspan="4">EXPENSES</td>
                 </tr>`;
        
        expenseCategories.forEach(cat => {
            const value = parseFloat(cat.value) || 0;
            const textColor = window.Formatting ? window.Formatting.getValueColor(value) : '#1f2937';
            
            html += `
                <tr>
                    <td>${cat.name || cat}</td>
                    <td><span class="input-cell" style="color: ${textColor}">${currencySymbol}${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></td>
                    <td><span class="input-cell">${currencySymbol}0.00</span></td>
                    <td class="text-right">${currencySymbol}0.00</td>
                </tr>
            `;
        });
        
        // Expense Total
        const totalExpenses = expenseCategories.reduce((sum, cat) => sum + (parseFloat(cat.value) || 0), 0);
        const expenseStyle = window.Formatting ? window.Formatting.getExcelStyle(totalExpenses, 'total') : {};
        const expenseColor = expenseStyle.font && expenseStyle.font.color && expenseStyle.font.color.rgb ? '#' + expenseStyle.font.color.rgb : '#1f2937';
        
        html += `<tr class="total-row">
                    <td>Total Expenses</td>
                    <td><strong style="color: ${expenseColor}">${currencySymbol}${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                    <td><strong>${currencySymbol}0.00</strong></td>
                    <td><strong>${currencySymbol}${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                 </tr>`;
        
        // Summary
        const netBalance = totalIncome - totalExpenses;
        const balanceColor = window.Formatting ? window.Formatting.getValueColor(netBalance) : (netBalance >= 0 ? '#10b981' : '#ef4444');
        const bgProgressColor = window.Formatting ? window.Formatting.getProgressColor(Math.max(0, (netBalance/totalIncome)*100)) : 'transparent';
        
        html += `<tr class="total-row" style="background-color: ${bgProgressColor}">
                    <td><strong>NET BALANCE</strong></td>
                    <td colspan="3"><strong style="color: ${balanceColor}; font-size: 1.1em">${currencySymbol}${netBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
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
