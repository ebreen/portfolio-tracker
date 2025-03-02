// utils/DataService.js
/**
 * Utility service for portfolio data persistence, import and export
 */

// Keys used for localStorage
const STORAGE_KEYS = {
    HOLDINGS: 'drip_holdings',
    DIVIDENDS: 'drip_dividends',
    SCENARIOS: 'drip_scenarios',
    CURRENT_SCENARIO: 'drip_current_scenario',
    LAST_BACKUP: 'drip_last_backup'
  };
  
  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Parsed data or default value
   */
  const loadData = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  };
  
  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to save
   */
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      // Handle potential localStorage errors (e.g., quota exceeded)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Some data may not be saved.');
      }
    }
  };
  
  /**
   * Export all portfolio data as a JSON file
   * @returns {Object} Object containing all portfolio data
   */
  const exportPortfolioData = () => {
    const exportData = {
      holdings: loadData(STORAGE_KEYS.HOLDINGS, []),
      dividends: loadData(STORAGE_KEYS.DIVIDENDS, []),
      scenarios: loadData(STORAGE_KEYS.SCENARIOS, {}),
      currentScenario: loadData(STORAGE_KEYS.CURRENT_SCENARIO, 'neutral'),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    downloadLink.download = `drip-portfolio-backup-${date}.json`;
    downloadLink.href = url;
    downloadLink.click();
    
    // Update last backup timestamp
    saveData(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString());
    
    return exportData;
  };
  
  /**
   * Validate imported data structure
   * @param {Object} data - Imported data object
   * @returns {Object} Validation result with status and message
   */
  const validateImportData = (data) => {
    // Basic structure validation
    if (!data) {
      return { valid: false, message: 'Import failed: Invalid data format' };
    }
    
    // Check for required properties
    const requiredProps = ['holdings', 'dividends', 'scenarios'];
    for (const prop of requiredProps) {
      if (!data[prop]) {
        return { valid: false, message: `Import failed: Missing required data: ${prop}` };
      }
    }
    
    // Validate holdings format
    if (!Array.isArray(data.holdings)) {
      return { valid: false, message: 'Import failed: Holdings must be an array' };
    }
    
    // Validate dividends format
    if (!Array.isArray(data.dividends)) {
      return { valid: false, message: 'Import failed: Dividends must be an array' };
    }
    
    // Validate scenarios format
    if (typeof data.scenarios !== 'object' || !data.scenarios) {
      return { valid: false, message: 'Import failed: Scenarios must be an object' };
    }
    
    // Additional validation could be added here
    
    return { valid: true, message: 'Data validated successfully' };
  };
  
  /**
   * Import portfolio data from a JSON file
   * @param {File} file - JSON file to import
   * @returns {Promise} Promise that resolves with import result
   */
  const importPortfolioData = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject({ success: false, message: 'No file selected' });
        return;
      }
      
      if (file.type !== 'application/json') {
        reject({ success: false, message: 'Selected file is not a JSON file' });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const validation = validateImportData(data);
          
          if (!validation.valid) {
            reject({ success: false, message: validation.message });
            return;
          }
          
          // Save the imported data to localStorage
          saveData(STORAGE_KEYS.HOLDINGS, data.holdings);
          saveData(STORAGE_KEYS.DIVIDENDS, data.dividends);
          saveData(STORAGE_KEYS.SCENARIOS, data.scenarios);
          
          if (data.currentScenario) {
            saveData(STORAGE_KEYS.CURRENT_SCENARIO, data.currentScenario);
          }
          
          resolve({ 
            success: true, 
            message: 'Data imported successfully',
            data: {
              holdings: data.holdings.length,
              dividends: data.dividends.length
            }
          });
        } catch (error) {
          console.error('Error parsing imported data:', error);
          reject({ success: false, message: 'Failed to parse imported data' });
        }
      };
      
      reader.onerror = () => {
        reject({ success: false, message: 'Error reading file' });
      };
      
      reader.readAsText(file);
    });
  };
  
  /**
   * Get the date of the last backup
   * @returns {string|null} Date string or null if no backup exists
   */
  const getLastBackupDate = () => {
    return loadData(STORAGE_KEYS.LAST_BACKUP, null);
  };
  
  export default {
    STORAGE_KEYS,
    loadData,
    saveData,
    exportPortfolioData,
    importPortfolioData,
    getLastBackupDate
  };