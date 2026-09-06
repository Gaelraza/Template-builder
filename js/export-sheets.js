// Google Sheets Export Module - Creates shareable template links

const SheetsExport = {
    // For MVP: Generate a pre-formatted CSV that can be imported to Google Sheets
    // Future: Use Google Sheets API for direct template creation
    
    export(settings) {
        const csvContent = this.buildCSV(settings);
        const monthName = Preview.getMonthName(settings.startMonth);
        const filename = `${settings.templateName.replace(/\s+/g, '_')}_${monthName}.csv`;
        
        this.downloadCSV(csvContent, filename);
        
        // Show instructions modal
        this.showInstructions();
        
        return true;
    },

    buildCSV(settings) {
        const { currencySymbol, incomeCategories, expenseCategories } = settings;
        const rows = [];

        // Title
        rows.push([settings.templateName]);
        rows.push([`${Preview.getMonthName(settings.startMonth)} Budget`]);
        rows.push([]);

        // Headers
        rows.push(['Category', 'Planned', 'Actual', 'Difference']);

        // Income section
        rows.push(['INCOME']);
        incomeCategories.forEach(cat => {
            rows.push([cat, '0', '0', '=C-B']);
        });
        rows.push(['Total Income', `=SUM(B5:B${4 + incomeCategories.length})`, 
                                  `=SUM(C5:C${4 + incomeCategories.length})`,
                                  '=C-B']);

        // Expense section
        rows.push(['EXPENSES']);
        const expenseStartRow = 6 + incomeCategories.length;
        expenseCategories.forEach(cat => {
            rows.push([cat, '0', '0', '=C-B']);
        });
        const expenseEndRow = expenseStartRow + expenseCategories.length - 1;
        rows.push(['Total Expenses', `=SUM(B${expenseStartRow}:B${expenseEndRow})`,
                                    `=SUM(C${expenseStartRow}:C${expenseEndRow})`,
                                    '=C-B']);

        // Summary
        const totalIncomeRow = 5 + incomeCategories.length;
        const totalExpensesRow = expenseEndRow + 1;
        rows.push(['NET BALANCE', '', '', `=C${totalIncomeRow}-C${totalExpensesRow}`]);

        // Convert to CSV string
        return rows.map(row => row.join(',')).join('\n');
    },

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    showInstructions() {
        const instructions = `
📋 Google Sheets Import Instructions:

1. Go to sheets.google.com
2. Click "Blank" to create a new spreadsheet
3. Go to File → Import → Upload
4. Select the downloaded CSV file
5. Choose "Replace spreadsheet" or "Insert new sheet"
6. Click "Import data"
7. Adjust column widths as needed
8. Save your template!

💡 Tip: You can also drag & drop the CSV file directly into Google Sheets
        `;
        
        alert(instructions);
    }
};

// Global function for HTML onclick handlers
function exportToGoogleSheets() {
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    
    btn.classList.add('loading');
    btn.innerHTML = '⏳ Generating...';
    
    try {
        const settings = Editor.getSettings();
        SheetsExport.export(settings);
        
        btn.classList.remove('loading');
        btn.innerHTML = '✅ Done!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('Export failed:', error);
        btn.classList.remove('loading');
        btn.innerHTML = '❌ Error';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }
}
