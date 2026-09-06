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
        if (!container) return;
        
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
        console.log('Editor.addCategory called with:', type);
        const newCat = type === 'income' ? 'New Income' : 'New Expense';

        if (type === 'income') {
            this.incomeCategories.push(newCat);
        } else {
            this.expenseCategories.push(newCat);
        }

        this.renderCategories(type);
        
        // Trigger preview update
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    },

    removeCategory(type, index) {
        console.log('Editor.removeCategory called with:', type, index);
        if (type === 'income') {
            this.incomeCategories.splice(index, 1);
        } else {
            this.expenseCategories.splice(index, 1);
        }

        this.renderCategories(type);
        
        // Trigger preview update
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
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
            templateName: document.getElementById('templateName').value || 'Budget Tracker',
            currencySymbol: document.getElementById('currencySymbol').value || '$',
            budgetPeriod: document.getElementById('budgetPeriod').value || 'monthly',
            startMonth: parseInt(document.getElementById('startMonth').value) || 0,
            headerColor: document.getElementById('headerColor').value || '#3b82f6',
            accentColor: document.getElementById('accentColor').value || '#10b981',
            fontFamily: document.getElementById('fontFamily').value || 'Arial, sans-serif',
            showGrid: document.getElementById('showGrid').checked !== false,
            conditionalFormatting: document.getElementById('conditionalFormatting').checked !== false,
            autoSum: document.getElementById('autoSum').checked !== false,
            incomeCategories: [...this.incomeCategories],
            expenseCategories: [...this.expenseCategories]
        };
    }
};

// Initialize editor on load
document.addEventListener('DOMContentLoaded', () => {
    Editor.init();
});
