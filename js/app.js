// Main App Initialization

// Expose functions to global scope for HTML onclick handlers
window.addCategory = function(type) {
    Editor.addCategory(type);
};

window.updatePreview = function() {
    const settings = Editor.getSettings();
    Preview.render(settings);
};

window.exportToExcel = function() {
    const settings = Editor.getSettings();
    ExcelExport.export(settings);
};

window.exportToGoogleSheets = function() {
    const settings = Editor.getSettings();
    SheetsExport.export(settings);
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Editor is initialized in its own module
    // Initial preview render is triggered by editor.js
    console.log('Budget Template Builder initialized');
});
