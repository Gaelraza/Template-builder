// Main App Module - Initializes and coordinates all modules

// Define global functions IMMEDIATELY when this script loads (before DOMContentLoaded)
window.addCategory = function(type) {
    console.log('addCategory called with:', type);
    if (typeof Editor !== 'undefined') {
        Editor.addCategory(type);
    } else {
        console.error('Editor module not loaded yet');
    }
};

window.updatePreview = function() {
    if (typeof Preview !== 'undefined' && typeof Editor !== 'undefined') {
        Preview.render(Editor.getSettings());
    }
};

window.exportToExcel = function() {
    if (typeof ExcelExport !== 'undefined' && typeof Editor !== 'undefined') {
        ExcelExport.export(Editor.getSettings());
    }
};

window.exportToGoogleSheets = function() {
    if (typeof SheetsExport !== 'undefined' && typeof Editor !== 'undefined') {
        SheetsExport.export(Editor.getSettings());
    }
};

const App = {
    init() {
        console.log('🚀 Budget Template Builder initialized');

        // Add event listeners for real-time updates
        this.addRealTimeListeners();

        // Initial preview render
        setTimeout(() => {
            window.updatePreview();
        }, 100);
    },

    addRealTimeListeners() {
        // Listen for changes on all inputs to auto-update preview
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select')) {
                this.debounceUpdatePreview();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"], input[type="color"]')) {
                this.debounceUpdatePreview();
            }
        });
    },

    debounceTimeout: null,
    debounceUpdatePreview(delay = 300) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            window.updatePreview();
        }, delay);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
