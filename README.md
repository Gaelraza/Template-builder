# Budget Template Builder

A lightweight, static website for creating customizable budget planner and tracker templates in Excel and Google Sheets format.

## Features

- **Customizable Templates**: Edit categories, colors, currency, and styling
- **Live Preview**: See your template update in real-time as you customize it
- **Excel Export**: Download .xlsx files with formulas ready to use
- **Google Sheets Export**: Download CSV files easy to import into Google Sheets
- **No Backend**: 100% static, hostable on GitHub Pages
- **Lightweight**: Vanilla JS + daisyUI, no heavy frameworks

## Quick Start

### Local Development
```bash
# Clone or download this repository
# Start a local server
python3 -m http.server 8080

# Open in browser
http://localhost:8080
```

### GitHub Pages Deployment
1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select main branch as source
4. Your site will be live at `https://yourusername.github.io/repo-name`

## Usage

1. **Customize Settings**: Adjust template name, currency, budget period, start month
2. **Edit Categories**: Add/remove income and expense categories
3. **Style Your Template**: Choose colors, fonts, grid lines, conditional formatting
4. **Preview**: See live preview of your template
5. **Export**: Download as Excel (.xlsx) or CSV for Google Sheets

## File Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── editor.js       # Category management
│   ├── preview.js      # Live preview rendering
│   ├── export-excel.js # Excel export functionality
│   ├── export-sheets.js# Google Sheets export
│   └── app.js          # Main app initialization
└── assets/             # Future assets (logos, etc.)
```

## Technologies

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **daisyUI** - Component library
- **Vanilla JavaScript** - No framework dependencies
- **SheetJS** - Excel file generation (loaded via CDN)

## MVP Features

- Monthly/Weekly budget periods
- Custom income/expense categories
- Currency symbol customization
- Color theming (header, accent)
- Font family selection
- Grid lines toggle
- Conditional formatting toggle
- Auto-sum formulas in exports
- Live dynamic preview
- Excel (.xlsx) export
- Google Sheets (CSV) export

## Future Enhancements

- Charts and graphs
- Multiple sheet templates
- Advanced conditional formatting
- Direct Google Sheets API integration
- Template gallery
- Multi-language support

## License

Personal use
