/**
 * Formatting Module
 * Handles conditional formatting rules for preview and export.
 * Pure functions, no DOM manipulation.
 */

const Formatting = {
    /**
     * Determine text color based on value
     * @param {number} value 
     * @returns {string} hex color code
     */
    getValueColor: function(value) {
        const num = parseFloat(value) || 0;
        if (num < 0) return '#ef4444'; // Red for negative
        if (num > 0) return '#22c55e'; // Green for positive
        return '#1f2937'; // Default gray
    },

    /**
     * Determine background color for progress/savings
     * @param {number} percentage 0-100
     * @returns {string} hex color code
     */
    getProgressColor: function(percentage) {
        const pct = parseFloat(percentage) || 0;
        if (pct < 20) return '#fef3c7'; // Yellow warning
        if (pct >= 50) return '#dcfce7'; // Green good
        return '#ffffff'; // Neutral
    },

    /**
     * Get Excel style object for a given value
     * Used by export-excel.js
     */
    getExcelStyle: function(value, type = 'text') {
        const color = this.getValueColor(value);
        const baseStyle = {
            font: { color: { rgb: color.replace('#', '') } },
            alignment: { vertical: 'middle', horizontal: 'center' }
        };

        if (type === 'header') {
            return {
                ...baseStyle,
                fill: { fgColor: { rgb: 'E5E7EB' } },
                font: { bold: true, color: { rgb: '1F2937' } }
            };
        }
        
        if (type === 'total') {
            return {
                ...baseStyle,
                font: { bold: true, color: { rgb: color.replace('#', '') } }
            };
        }

        return baseStyle;
    }
};

// Expose to global scope for modular access
window.Formatting = Formatting;
