// Editor Module - Handles category management and form interactions

const Editor = {
    incomeCategories: [
        { name: 'Salary', value: 0 },
        { name: 'Freelance', value: 0 },
        { name: 'Investments', value: 0 },
        { name: 'Other Income', value: 0 }
    ],
    expenseCategories: [
        { name: 'Housing', value: 0 },
        { name: 'Food & Dining', value: 0 },
        { name: 'Transportation', value: 0 },
        { name: 'Utilities', value: 0 },
        { name: 'Entertainment', value: 0 },
        { name: 'Shopping', value: 0 },
        { name: 'Healthcare', value: 0 },
        { name: 'Savings', value: 0 },
        { name: 'Other Expenses', value: 0 }
    ],

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
                       class="input input-bordered input-sm flex-1 category-name-input"
                       value="${cat.name}"
                       data-type="${type}"
                       data-index="${index}"
                       onchange="Editor.updateCategoryName('${type}', ${index}, this.value)" 
                       placeholder="Category name" />
                <input type="number"
                       class="input input-bordered input-sm w-24 category-value-input"
                       value="${cat.value}"
                       data-type="${type}"
                       data-index="${index}"
                       onchange="Editor.updateCategoryValue('${type}', ${index}, this.value)" 
                       placeholder="Amount" />
                <button class="btn btn-sm btn-ghost btn-circle text-error"
                        onclick="Editor.removeCategory('${type}', ${index})">
                    ✕
                </button>
            </div>
        `).join('');
    },

    addCategory(type) {
        console.log('Editor.addCategory called with:', type);
        const newCat = { 
            name: type === 'income' ? 'New Income' : 'New Expense', 
            value: 0 
        };

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

    updateCategoryName(type, index, value) {
        if (type === 'income') {
            this.incomeCategories[index].name = value;
        } else {
            this.expenseCategories[index].name = value;
        }
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    },

    updateCategoryValue(type, index, value) {
        const numValue = parseFloat(value) || 0;
        if (type === 'income') {
            this.incomeCategories[index].value = numValue;
        } else {
            this.expenseCategories[index].value = numValue;
        }
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    },

    getSettings() {
        const headerColorEl = document.getElementById('headerColor');
        const accentColorEl = document.getElementById('accentColor');
        
        return {
            templateName: document.getElementById('templateName').value || 'Budget Tracker',
            currencySymbol: document.getElementById('currencySymbol').value || '$',
            budgetPeriod: document.getElementById('budgetPeriod').value || 'monthly',
            startMonth: parseInt(document.getElementById('startMonth').value) || 0,
            headerColor: headerColorEl.value || '#3b82f6',
            accentColor: accentColorEl.value || '#10b981',
            primaryColor: headerColorEl.dataset.primaryColor || headerColorEl.value || '#3b82f6',
            secondaryColor: accentColorEl.dataset.secondaryColor || '#ef4444',
            fontFamily: document.getElementById('fontFamily').value || 'Arial, sans-serif',
            showGrid: document.getElementById('showGrid').checked !== false,
            conditionalFormatting: document.getElementById('conditionalFormatting').checked !== false,
            autoSum: document.getElementById('autoSum').checked !== false,
            incomeCategories: [...this.incomeCategories],
            expenseCategories: [...this.expenseCategories]
        };
    },

    applyTheme(themeName) {
        const themes = {
            warm: {
                headerColor: '#d97706',
                accentColor: '#ea580c',
                primaryColor: '#d97706',
                secondaryColor: '#f59e0b',
                fontFamily: 'Georgia, serif'
            },
            professional: {
                headerColor: '#1e3a5f',
                accentColor: '#475569',
                primaryColor: '#1e3a5f',
                secondaryColor: '#64748b',
                fontFamily: 'Arial, sans-serif'
            },
            cute: {
                headerColor: '#ec4899',
                accentColor: '#a855f7',
                primaryColor: '#ec4899',
                secondaryColor: '#f472b6',
                fontFamily: 'Verdana, sans-serif'
            }
        };

        const theme = themes[themeName];
        if (!theme) return;

        document.getElementById('headerColor').value = theme.headerColor;
        document.getElementById('accentColor').value = theme.accentColor;
        document.getElementById('fontFamily').value = theme.fontFamily;

        // Store primary and secondary colors in data attributes for getSettings to read
        document.getElementById('headerColor').dataset.primaryColor = theme.primaryColor;
        document.getElementById('accentColor').dataset.secondaryColor = theme.secondaryColor;

        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }
};

// Initialize editor on load
document.addEventListener('DOMContentLoaded', () => {
    Editor.init();
    if (typeof window.updatePreview === 'function') {
        window.updatePreview();
    }
});
