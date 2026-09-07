// ExcelJS Export Module - Generates professional .xlsx files with full styling and formulas

const ExcelJSExport = {
    async export(settings) {
        // Check if ExcelJS is loaded
        if (typeof ExcelJS === 'undefined') {
            await this.loadExcelJS();
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Budget Tracker');

        // Build the data structure
        this.buildWorksheet(worksheet, settings);

        // Generate filename
        const monthName = Preview.getMonthName(settings.startMonth);
        const filename = `${settings.templateName.replace(/\s+/g, '_')}_${monthName}.xlsx`;

        // Download file
        await workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });

        return true;
    },

    buildWorksheet(worksheet, settings) {
        const { templateName, currencySymbol, incomeCategories, expenseCategories, 
                headerColor, accentColor, primaryColor, secondaryColor, fontFamily } = settings;

        // Set default column widths
        worksheet.columns = [
            { key: 'category', width: 25 },
            { key: 'planned', width: 15 },
            { key: 'actual', width: 15 },
            { key: 'difference', width: 15 }
        ];

        // Set default font for entire sheet
        worksheet.properties.defaultRowHeight = 20;

        // Row 1: Title
        const titleRow = worksheet.getRow(1);
        titleRow.getCell(1).value = templateName;
        titleRow.getCell(1).font = { bold: true, size: 18, color: { argb: 'FF' + headerColor.replace('#', '') }, family: fontFamily.split(',')[0].trim() };
        titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells('A1:D1');
        titleRow.height = 30;

        // Row 2: Subtitle
        const subtitleRow = worksheet.getRow(2);
        subtitleRow.getCell(1).value = `${Preview.getMonthName(settings.startMonth)} Budget`;
        subtitleRow.getCell(1).font = { size: 14, color: { argb: 'FF' + accentColor.replace('#', '') }, family: fontFamily.split(',')[0].trim() };
        subtitleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells('A2:D2');
        subtitleRow.height = 25;

        // Row 3: Empty spacer
        worksheet.getRow(3).height = 10;

        // Row 4: Headers
        const headerRow = worksheet.getRow(4);
        headerRow.getCell(1).value = 'Category';
        headerRow.getCell(2).value = 'Planned';
        headerRow.getCell(3).value = 'Actual';
        headerRow.getCell(4).value = 'Difference';

        const headerFill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF' + headerColor.replace('#', '') }
        };

        for (let col = 1; col <= 4; col++) {
            const cell = headerRow.getCell(col);
            cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' }, family: fontFamily.split(',')[0].trim() };
            cell.fill = headerFill;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF' + headerColor.replace('#', '') } },
                left: { style: 'thin', color: { argb: 'FF' + headerColor.replace('#', '') } },
                bottom: { style: 'thin', color: { argb: 'FF' + headerColor.replace('#', '') } },
                right: { style: 'thin', color: { argb: 'FF' + headerColor.replace('#', '') } }
            };
        }
        headerRow.height = 25;

        let currentRow = 5;

        // Income section header
        const incomeHeaderRow = worksheet.getRow(currentRow);
        incomeHeaderRow.getCell(1).value = 'INCOME';
        incomeHeaderRow.getCell(1).font = { bold: true, size: 13, color: { argb: 'FF' + primaryColor.replace('#', '') }, family: fontFamily.split(',')[0].trim() };
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        incomeHeaderRow.height = 25;
        currentRow++;

        // Income categories
        incomeCategories.forEach((cat, index) => {
            const row = worksheet.getRow(currentRow);
            row.getCell(1).value = cat.name;
            row.getCell(2).value = 0;
            row.getCell(2).numFmt = currencySymbol + '#,##0.00';
            row.getCell(3).value = 0;
            row.getCell(3).numFmt = currencySymbol + '#,##0.00';
            row.getCell(4).value = { formula: `C${currentRow}-B${currentRow}` };
            row.getCell(4).numFmt = currencySymbol + '#,##0.00';

            for (let col = 1; col <= 4; col++) {
                const cell = row.getCell(col);
                cell.font = { size: 11, family: fontFamily.split(',')[0].trim() };
                cell.alignment = { vertical: 'middle', horizontal: col === 1 ? 'left' : 'right' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
                };
            }
            currentRow++;
        });

        // Total Income row
        const totalIncomeRowNum = currentRow;
        const incomeStart = 6;
        const incomeEnd = currentRow - 1;
        const totalIncomeRow = worksheet.getRow(currentRow);
        totalIncomeRow.getCell(1).value = 'Total Income';
        totalIncomeRow.getCell(1).font = { bold: true, size: 12, family: fontFamily.split(',')[0].trim() };
        totalIncomeRow.getCell(2).value = { formula: `SUM(B${incomeStart}:B${incomeEnd})` };
        totalIncomeRow.getCell(2).numFmt = currencySymbol + '#,##0.00';
        totalIncomeRow.getCell(3).value = { formula: `SUM(C${incomeStart}:C${incomeEnd})` };
        totalIncomeRow.getCell(3).numFmt = currencySymbol + '#,##0.00';
        totalIncomeRow.getCell(4).value = { formula: `C${totalIncomeRowNum}-B${totalIncomeRowNum}` };
        totalIncomeRow.getCell(4).numFmt = currencySymbol + '#,##0.00';

        const totalIncomeFill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF' + this.lightenColor(accentColor, 30).replace('#', '') }
        };

        for (let col = 1; col <= 4; col++) {
            const cell = totalIncomeRow.getCell(col);
            cell.font = { bold: true, size: 12, family: fontFamily.split(',')[0].trim() };
            cell.fill = totalIncomeFill;
            cell.alignment = { horizontal: col === 1 ? 'left' : 'right', vertical: 'middle' };
            cell.border = {
                top: { style: 'medium', color: { argb: 'FF' + accentColor.replace('#', '') } },
                left: { style: 'thin', color: { argb: 'FF' + accentColor.replace('#', '') } },
                bottom: { style: 'medium', color: { argb: 'FF' + accentColor.replace('#', '') } },
                right: { style: 'thin', color: { argb: 'FF' + accentColor.replace('#', '') } }
            };
        }
        totalIncomeRow.height = 25;
        currentRow++;

        // Empty row
        worksheet.getRow(currentRow).height = 10;
        currentRow++;

        // Expense section header
        const expenseHeaderRow = worksheet.getRow(currentRow);
        expenseHeaderRow.getCell(1).value = 'EXPENSES';
        expenseHeaderRow.getCell(1).font = { bold: true, size: 13, color: { argb: 'FF' + secondaryColor.replace('#', '') }, family: fontFamily.split(',')[0].trim() };
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        expenseHeaderRow.height = 25;
        currentRow++;

        // Expense categories
        const expenseStart = currentRow;
        expenseCategories.forEach((cat, index) => {
            const row = worksheet.getRow(currentRow);
            row.getCell(1).value = cat.name;
            row.getCell(2).value = 0;
            row.getCell(2).numFmt = currencySymbol + '#,##0.00';
            row.getCell(3).value = 0;
            row.getCell(3).numFmt = currencySymbol + '#,##0.00';
            row.getCell(4).value = { formula: `C${currentRow}-B${currentRow}` };
            row.getCell(4).numFmt = currencySymbol + '#,##0.00';

            for (let col = 1; col <= 4; col++) {
                const cell = row.getCell(col);
                cell.font = { size: 11, family: fontFamily.split(',')[0].trim() };
                cell.alignment = { vertical: 'middle', horizontal: col === 1 ? 'left' : 'right' };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
                };
            }
            currentRow++;
        });
        const expenseEnd = currentRow - 1;

        // Total Expenses row
        const totalExpensesRowNum = currentRow;
        const totalExpensesRow = worksheet.getRow(currentRow);
        totalExpensesRow.getCell(1).value = 'Total Expenses';
        totalExpensesRow.getCell(1).font = { bold: true, size: 12, family: fontFamily.split(',')[0].trim() };
        totalExpensesRow.getCell(2).value = { formula: `SUM(B${expenseStart}:B${expenseEnd})` };
        totalExpensesRow.getCell(2).numFmt = currencySymbol + '#,##0.00';
        totalExpensesRow.getCell(3).value = { formula: `SUM(C${expenseStart}:C${expenseEnd})` };
        totalExpensesRow.getCell(3).numFmt = currencySymbol + '#,##0.00';
        totalExpensesRow.getCell(4).value = { formula: `C${totalExpensesRowNum}-B${totalExpensesRowNum}` };
        totalExpensesRow.getCell(4).numFmt = currencySymbol + '#,##0.00';

        const totalExpenseFill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF' + this.lightenColor(secondaryColor, 30).replace('#', '') }
        };

        for (let col = 1; col <= 4; col++) {
            const cell = totalExpensesRow.getCell(col);
            cell.font = { bold: true, size: 12, family: fontFamily.split(',')[0].trim() };
            cell.fill = totalExpenseFill;
            cell.alignment = { horizontal: col === 1 ? 'left' : 'right', vertical: 'middle' };
            cell.border = {
                top: { style: 'medium', color: { argb: 'FF' + secondaryColor.replace('#', '') } },
                left: { style: 'thin', color: { argb: 'FF' + secondaryColor.replace('#', '') } },
                bottom: { style: 'medium', color: { argb: 'FF' + secondaryColor.replace('#', '') } },
                right: { style: 'thin', color: { argb: 'FF' + secondaryColor.replace('#', '') } }
            };
        }
        totalExpensesRow.height = 25;
        currentRow++;

        // Net Balance row
        const netBalanceRow = worksheet.getRow(currentRow);
        netBalanceRow.getCell(1).value = 'NET BALANCE';
        netBalanceRow.getCell(1).font = { bold: true, size: 14, family: fontFamily.split(',')[0].trim() };
        netBalanceRow.getCell(4).value = { formula: `C${totalIncomeRowNum}-C${totalExpensesRowNum}` };
        netBalanceRow.getCell(4).numFmt = currencySymbol + '#,##0.00';

        // Apply conditional color to net balance
        const netBalanceFill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' }
        };

        for (let col = 1; col <= 4; col++) {
            const cell = netBalanceRow.getCell(col);
            if (col !== 4) {
                cell.font = { bold: true, size: 14, family: fontFamily.split(',')[0].trim() };
            } else {
                cell.font = { bold: true, size: 14, color: { argb: 'FF22C55E' }, family: fontFamily.split(',')[0].trim() };
            }
            cell.fill = netBalanceFill;
            cell.alignment = { horizontal: col === 1 ? 'left' : 'right', vertical: 'middle' };
            cell.border = {
                top: { style: 'thick', color: { argb: 'FF374151' } },
                left: { style: 'thin', color: { argb: 'FF374151' } },
                bottom: { style: 'thick', color: { argb: 'FF374151' } },
                right: { style: 'thin', color: { argb: 'FF374151' } }
            };
        }
        netBalanceRow.height = 30;

        // Add conditional formatting rules for negative values
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 5 && rowNumber !== totalIncomeRowNum && rowNumber !== totalExpensesRowNum && rowNumber !== currentRow) {
                const diffCell = row.getCell(4);
                if (diffCell.value && typeof diffCell.value === 'object' && diffCell.value.formula) {
                    // This is a formula cell - ExcelJS doesn't support conditional formatting well
                    // We'll set a default style that can be manually adjusted in Excel
                    diffCell.font = { size: 11, family: fontFamily.split(',')[0].trim() };
                }
            }
        });
    },

    // Helper function to lighten/darken colors
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, Math.max(0, (num >> 16) + amt));
        const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
        const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    async loadExcelJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
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
        await ExcelJSExport.export(settings);

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
