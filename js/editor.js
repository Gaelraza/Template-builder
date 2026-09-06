// Editor Module - Handles category management and form interactions

const Editor = {
    incomeCategories: ['Salary', 'Freelance', 'Investments', 'Other Income'],
    expenseCategories: ['Housing', 'Food & Dining', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Savings', 'Other Expenses'],

    init() {
        this.renderCategories('income');
        this.renderCategories('expense');
    },

    renderCategories(type) {
        const container = document.getElementById(`${type}Categories`);
        const categories = type === 'income' ? this.incomeCategories : this.expenseCategories;
        
        container.innerHTML = categories.map((cat, index) => `
            <div class="flex gap-2 items-center category-item" data-type="${type}" data-index="${index}">
                <input type="text" 
                       class="input input-bordered input-sm flex-1 category-input" 
                       value="${cat}" 
                       data-type="${type}" 
                       data-index="${index}"
                       onchange="Editor.updateCategory('${type}', ${index}, this.value)" />
                <button class="btn btn-sm btn-ghost btn-circle text-error" 
                        onclick="Editor.removeCategory('${type}', ${index})">
                    ✕
                </button>
            </div>
        `).join('');
    },

    addCategory(type) {
        const container = document.getElementById(`${type}Categories`);
        const newIndex = type === 'income' ? this.incomeCategories.length : this.expenseCategories.length;
        const newCat = type === 'income' ? 'New Income' : 'New Expense';
        
        if (type === 'income') {
            this.incomeCategories.push(newCat);
        } else {
            this.expenseCategories.push(newCat);
        }
        
        this.renderCategories(type);
        updatePreview();
    },

    removeCategory(type, index) {
        if (type === 'income') {
            this.incomeCategories.splice(index, 1);
        } else {
            this.expenseCategories.splice(index, 1);
        }
        
        this.renderCategories(type);
        updatePreview();
    },

    updateCategory(type, index, value) {
        if (type === 'income') {
            this.incomeCategories[index] = value;
        } else {
            this.expenseCategories[index] = value;
        }
    },

    getSettings() {
        return {
            templateName: document.getElementById('templateName').value,
            currencySymbol: document.getElementById('currencySymbol').value,
            budgetPeriod: document.getElementById('budgetPeriod').value,
            startMonth: parseInt(document.getElementById('startMonth').value),
            headerColor: document.getElementById('headerColor').value,
            accentColor: document.getElementById('accentColor').value,
            fontFamily: document.getElementById('fontFamily').value,
            showGrid: document.getElementById('showGrid').checked,
            conditionalFormatting: document.getElementById('conditionalFormatting').checked,
            autoSum: document.getElementById('autoSum').checked,
            incomeCategories: [...this.incomeCategories],
            expenseCategories: [...this.expenseCategories]
        };
    }
};

// Global wrapper functions for HTML onclick handlers
function addCategory(type) {
    Editor.addCategory(type);
}

function updatePreview() {
    Preview.render(Editor.getSettings());
}

function exportToExcel() {
    ExcelExport.export(Editor.getSettings());
}

function exportToGoogleSheets() {
    SheetsExport.export(Editor.getSettings());
}

// Initialize editor on load
document.addEventListener('DOMContentLoaded', () => {
    Editor.init();
    Preview.render(Editor.getSettings());
});
