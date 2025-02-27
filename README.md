# ETF Dividend Portfolio Tracker

A comprehensive React application to track and visualize ETF dividend investments with DRIP (Dividend Reinvestment Plan) functionality. This app allows you to monitor your portfolio, track monthly dividends, and project future growth based on different scenarios.

## Features

- **Portfolio Dashboard**: View summary of all holdings, current value, and growth metrics
- **DRIP Functionality**: Automatically track dividend reinvestments and share accumulation
- **Dividend History**: Track all dividend payments with detailed data visualizations
- **Scenario Analysis**: Project future growth with bullish, neutral, and bearish scenarios
- **Data Persistence**: All data is stored in your browser's local storage
- **Responsive Design**: Works on desktop and mobile devices

## Deployment to Vercel

This application is configured for easy deployment on Vercel. Follow these steps:

1. **Fork or Clone the Repository**

   ```
   git clone https://github.com/yourusername/etf-dividend-tracker.git
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
- `src/components/` - All UI components:
  - `Dashboard.js` - Main dashboard with portfolio overview
  - `DividendHistory.js` - Track and visualize all dividend payments
  - `ScenarioAnalysis.js` - Project future growth with different scenarios
  - `AddHolding.js` - Form to add new ETF holdings
  - `AddDividend.js` - Form to record new dividend payments
  - `PortfolioSettings.js` - Configure scenario parameters and manage holdings

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

4. **Monthly Updates**
   - After receiving monthly dividends, update your portfolio
   - The charts and projections will automatically update

## Technologies Used

- React
- React Router
- Recharts for data visualization
- TailwindCSS for styling
- Local Storage for data persistence

## License

MIT License