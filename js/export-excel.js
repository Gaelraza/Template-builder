// Excel Export Module - Generates .xlsx files using SheetJS library

const ExcelExport = {
    async export(settings) {
        // Check if SheetJS is loaded
        if (typeof XLSX === 'undefined') {
            await this.loadSheetJS();
        }

        const workbook = XLSX.utils.book_new();
        const worksheetData = this.buildWorksheetData(settings);
        
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
        // Set column widths
        worksheet['!cols'] = [
            { wch: 25 }, // Category
            { wch: 15 }, // Planned
            { wch: 15 }, // Actual
            { wch: 15 }  // Difference
        ];

        // Apply styling through cell merges and formatting
        this.applyCellStyles(worksheet, settings);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget Tracker');

        // Generate filename
        const monthName = Preview.getMonthName(settings.startMonth);
        const filename = `${settings.templateName.replace(/\s+/g, '_')}_${monthName}.xlsx`;

        // Download file
        XLSX.writeFile(workbook, filename);
        
        return true;
    },

    buildWorksheetData(settings) {
        const { currencySymbol, incomeCategories, expenseCategories } = settings;
        const data = [];

        // Title row
        data.push([settings.templateName]);
        data.push([`${Preview.getMonthName(settings.startMonth)} Budget`]);
        data.push([]); // Empty row

        // Headers
        data.push(['Category', 'Planned', 'Actual', 'Difference']);

        // Income section
        data.push(['INCOME']);
        incomeCategories.forEach(cat => {
            data.push([cat, 0, 0, `=C${data.length + 1}-B${data.length + 1}`]);
        });
        data.push(['Total Income', `=SUM(B5:B${4 + incomeCategories.length})`, 
                                   `=SUM(C5:C${4 + incomeCategories.length})`,
                                   `=C${data.length}-B${data.length}`]);

        // Expense section
        data.push(['EXPENSES']);
        const expenseStartRow = data.length + 1;
        expenseCategories.forEach(cat => {
            data.push([cat, 0, 0, `=C${data.length + 1}-B${data.length + 1}`]);
        });
        const expenseEndRow = data.length;
        data.push(['Total Expenses', `=SUM(B${expenseStartRow}:B${expenseEndRow})`,
                                    `=SUM(C${expenseStartRow}:C${expenseEndRow})`,
                                    `=C${data.length}-B${data.length}`]);

        // Summary
        const totalIncomeRow = 5 + incomeCategories.length;
        const totalExpensesRow = data.length;
        data.push(['NET BALANCE', '', '', `=C${totalIncomeRow}-C${totalExpensesRow}`]);

        return data;
    },

    applyCellStyles(worksheet, settings) {
        // Note: Basic styling - full styling requires SheetJS Pro
        // This creates the structure with formulas ready for Excel
    },

    async loadSheetJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
};

// Global function for HTML onclick handlers
async function exportToExcel() {
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    
    btn.classList.add('loading');
    btn.innerHTML = '⏳ Generating...';
    
    try {
        const settings = Editor.getSettings();
        await ExcelExport.export(settings);
        
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
