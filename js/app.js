// Main App Module - Initializes and coordinates all modules

const App = {
    init() {
        console.log('🚀 Budget Template Builder initialized');
        
        // Initialize editor (already done in editor.js DOMContentLoaded)
        // Render initial preview
        setTimeout(() => {
            updatePreview();
        }, 100);
        
        // Add event listeners for real-time updates
        this.addRealTimeListeners();
    },

    addRealTimeListeners() {
        // Listen for changes on all inputs to auto-update preview
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type !== 'checkbox' && input.type !== 'color') {
                input.addEventListener('input', () => {
                    debounceUpdatePreview();
                });
            } else {
                input.addEventListener('change', () => {
                    debounceUpdatePreview();
                });
            }
        });
    }
};

// Debounce function to prevent too many updates
let previewTimeout;
function debounceUpdatePreview(delay = 300) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
        updatePreview();
    }, delay);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
