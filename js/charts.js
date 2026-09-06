/**
 * Charts Module
 * Handles rendering of dynamic charts in the preview panel
 * Dependencies: Chart.js (loaded via CDN)
 */

const Charts = {
    barChartInstance: null,
    pieChartInstance: null,

    /**
     * Initialize or update charts based on current data
     * @param {Object} settings - Current editor settings
     */
    render(settings) {
        const { incomeCategories, expenseCategories, primaryColor, secondaryColor } = settings;
        
        // Calculate totals
        const totalIncome = this.calculateTotal(incomeCategories);
        const totalExpenses = this.calculateTotal(expenseCategories);

        // Render Bar Chart (Income vs Expenses)
        this.renderBarChart(totalIncome, totalExpenses, primaryColor, secondaryColor);

        // Render Pie Chart (Expense Breakdown)
        this.renderPieChart(expenseCategories, primaryColor);
    },

    /**
     * Calculate sum of category values
     * @param {Array} categories 
     * @returns {Number}
     */
    calculateTotal(categories) {
        return categories.reduce((sum, cat) => sum + (parseFloat(cat.value) || 0), 0);
    },

    /**
     * Render Income vs Expenses Bar Chart
     */
    renderBarChart(income, expenses, color1, color2) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        const data = {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Amount',
                data: [income, expenses],
                backgroundColor: [color1, color2],
                borderWidth: 0,
                borderRadius: 4
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        };

        if (this.barChartInstance) {
            this.barChartInstance.destroy();
        }

        this.barChartInstance = new Chart(ctx, config);
    },

    /**
     * Render Expense Breakdown Pie Chart
     */
    renderPieChart(categories, baseColor) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        // Filter out zero values
        const validCategories = categories.filter(c => parseFloat(c.value) > 0);
        
        if (validCategories.length === 0) {
            // Clear chart if no data
            if (this.pieChartInstance) {
                this.pieChartInstance.destroy();
                this.pieChartInstance = null;
            }
            return;
        }

        const labels = validCategories.map(c => c.name);
        const dataValues = validCategories.map(c => parseFloat(c.value));
        
        // Generate color palette based on base color
        const colors = this.generateColorPalette(baseColor, validCategories.length);

        const data = {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        if (this.pieChartInstance) {
            this.pieChartInstance.destroy();
        }

        this.pieChartInstance = new Chart(ctx, config);
    },

    /**
     * Generate a palette of colors based on a base hex color
     */
    generateColorPalette(baseHex, count) {
        const colors = [];
        const step = 360 / count;
        
        // Convert hex to HSL for easier manipulation
        const hsl = this.hexToHSL(baseHex);
        
        for (let i = 0; i < count; i++) {
            // Rotate hue for each category
            const newHue = (hsl.h + (i * step)) % 360;
            colors.push(`hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`);
        }
        
        return colors;
    },

    /**
     * Helper: Convert Hex to HSL
     */
    hexToHSL(hex) {
        // Remove #
        hex = hex.replace(/^#/, '');
        
        // Parse r, g, b
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    /**
     * Destroy all chart instances (cleanup)
     */
    destroy() {
        if (this.barChartInstance) {
            this.barChartInstance.destroy();
            this.barChartInstance = null;
        }
        if (this.pieChartInstance) {
            this.pieChartInstance.destroy();
            this.pieChartInstance = null;
        }
    }
};

// Expose to global scope
window.Charts = Charts;
