# ETF Dividend Portfolio Tracker

A comprehensive React application to track and visualize ETF dividend investments with DRIP (Dividend Reinvestment Plan) functionality. This app allows you to monitor your portfolio, track monthly dividends, and project future growth based on different scenarios.

## Features

- **Portfolio Dashboard**: View summary of all holdings, current value, and growth metrics
- **DRIP Functionality**: Automatically track dividend reinvestments and share accumulation
- **Dividend History**: Track all dividend payments with detailed data visualizations
- **Scenario Analysis**: Project future growth with bullish, neutral, and bearish scenarios
- **Enhanced Data Management**:
  - Local storage persistence with standardized data structure
  - Export/import functionality for data portability between devices
  - Data backup and restoration capabilities
  - Automatic data migration during app updates
- **Responsive Design**: Works on desktop and mobile devices

## Data Management Capabilities

The application features a robust data management system designed for reliability and portability:

### Data Storage
- All portfolio data is securely stored in your browser's local storage
- Automatic data persistence without requiring server authentication
- Data segregation with structured storage keys

### Data Portability
- **Export Functionality**: Download your complete portfolio data as a JSON file
- **Import Functionality**: Restore your portfolio from previously exported files
- **Drag-and-Drop Support**: Easily import data by dragging files into the interface

### Data Safety
- Pre-migration backups before data structure changes
- Validation checks to prevent importing corrupted data
- Error handling for local storage limitations
- Automatic data migration during application updates

### Version Control
- Transparent versioning displayed in application footer
- Automatic schema migrations between versions
- Data integrity preservation during updates

## Deployment to Vercel

This application is configured for easy deployment on Vercel. Follow these steps:

1. **Fork or Clone the Repository**

   ```
   git clone https://github.com/ebreen/portfolio-tracker
   cd etf-dividend-tracker
   ```

2. **Install Dependencies**

   ```
   npm install
   ```

3. **Run Locally (Optional)**

   ```
   npm start
   ```

4. **Deploy to Vercel**

   - Install Vercel CLI:
     ```
     npm install -g vercel
     ```

   - Login to Vercel:
     ```
     vercel login
     ```

   - Deploy:
     ```
     vercel
     ```

   - For production deployment:
     ```
     vercel --prod
     ```

   Alternatively, you can connect your GitHub repository directly to Vercel for automatic deployments.

## Project Structure

- `src/App.js` - Main application component and routing
- `src/contexts/PortfolioContext.js` - State management for the entire application
- `src/utils/` - Utility functions and services:
  - `DataService.js` - Core data persistence and import/export functionality
  - `DataMigration.js` - Version tracking and data migration utilities
- `src/components/` - All UI components:
  - `Dashboard.js` - Main dashboard with portfolio overview
  - `DividendHistory.js` - Track and visualize all dividend payments
  - `ScenarioAnalysis.js` - Project future growth with different scenarios
  - `AddHolding.js` - Form to add new ETF holdings
  - `AddDividend.js` - Form to record new dividend payments
  - `PortfolioSettings.js` - Configure scenario parameters and manage holdings
  - `DataManagement.js` - Interface for data import/export operations
  - `Notification.js` - Reusable component for user feedback

## Usage Guide

1. **Getting Started**
   - Add your first ETF holding using the "Add New Holding" button
   - Enter the ticker, name, initial investment, share price, and shares

2. **Recording Dividends**
   - When you receive a dividend, click "Record New Dividend"
   - Enter the dividend details including whether it was reinvested
   - The app will automatically update your share count if DRIP is enabled

3. **Analyzing Growth**
   - Use the Scenario Analysis page to project future growth
   - Customize the bullish, neutral, and bearish scenarios in Settings
   - Update current share prices periodically to keep data accurate

4. **Managing Your Data**
   - Navigate to Settings → Data Management to export or import data
   - Create regular backups by exporting your portfolio data
   - Transfer your portfolio between devices by exporting and importing
   - Drag and drop exported files to import them

5. **Monthly Updates**
   - After receiving monthly dividends, update your portfolio
   - The charts and projections will automatically update

## Data Persistence Model

The application implements a structured data persistence model:

```
Local Storage
├── drip_holdings         # Portfolio holdings data
├── drip_dividends        # Dividend history records
├── drip_scenarios        # Scenario configuration settings
├── drip_current_scenario # Currently selected scenario
├── drip_last_backup      # Timestamp of last data export
├── drip_app_version      # Application version for migrations
└── drip_pre_migration_backup # Safety backup before migrations
```

## Technologies Used

- React
- React Router
- Recharts for data visualization
- TailwindCSS for styling
- Local Storage for data persistence
- File System API for import/export functionality

## License

MIT License