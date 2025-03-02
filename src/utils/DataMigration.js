// utils/DataMigration.js
/**
 * Utility for migrating data schema between versions
 */

import DataService from './DataService';

// Current app version
const CURRENT_VERSION = '1.0.0';

// Store version information in localStorage
const VERSION_KEY = 'drip_app_version';

/**
 * Check if data migration is needed
 * @returns {boolean} True if migration is needed
 */
const isMigrationNeeded = () => {
  const storedVersion = localStorage.getItem(VERSION_KEY) || '0.0.0';
  return storedVersion !== CURRENT_VERSION;
};

/**
 * Run data migration based on stored version
 * @returns {Object} Migration result with status and message
 */
const migrateData = () => {
  const storedVersion = localStorage.getItem(VERSION_KEY) || '0.0.0';
  
  if (storedVersion === CURRENT_VERSION) {
    return { success: true, message: 'Data is already at current version' };
  }
  
  try {
    // Migrate from pre-1.0.0 to 1.0.0
    if (compareVersions(storedVersion, '1.0.0') < 0) {
      migrateToV1();
    }
    
    // Add more version migrations here as needed
    // if (compareVersions(storedVersion, '1.1.0') < 0) {
    //   migrateToV1_1();
    // }
    
    // Update stored version
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    
    return { 
      success: true, 
      message: `Successfully migrated data from v${storedVersion} to v${CURRENT_VERSION}` 
    };
  } catch (error) {
    console.error('Data migration error:', error);
    return { 
      success: false, 
      message: `Failed to migrate data: ${error.message}` 
    };
  }
};

/**
 * Migrate data to version 1.0.0
 */
const migrateToV1 = () => {
  // Legacy keys
  const legacyKeys = {
    HOLDINGS: 'holdings',
    DIVIDENDS: 'dividends',
    SCENARIOS: 'scenarios',
    CURRENT_SCENARIO: 'currentScenario'
  };
  
  // Migrate holdings
  const holdings = DataService.loadData(legacyKeys.HOLDINGS, []);
  DataService.saveData(DataService.STORAGE_KEYS.HOLDINGS, holdings);
  
  // Migrate dividends
  const dividends = DataService.loadData(legacyKeys.DIVIDENDS, []);
  DataService.saveData(DataService.STORAGE_KEYS.DIVIDENDS, dividends);
  
  // Migrate scenarios
  const scenarios = DataService.loadData(legacyKeys.SCENARIOS, {});
  DataService.saveData(DataService.STORAGE_KEYS.SCENARIOS, scenarios);
  
  // Migrate current scenario
  const currentScenario = DataService.loadData(legacyKeys.CURRENT_SCENARIO, 'neutral');
  DataService.saveData(DataService.STORAGE_KEYS.CURRENT_SCENARIO, currentScenario);
  
  console.log('Data migrated to v1.0.0');
};

/**
 * Compare two version strings
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }
  
  return 0;
};

/**
 * Create a data backup before migration
 * @returns {boolean} Success status
 */
const createPreMigrationBackup = () => {
  try {
    const timestamp = new Date().toISOString();
    const exportData = {
      holdings: DataService.loadData(DataService.STORAGE_KEYS.HOLDINGS, []),
      dividends: DataService.loadData(DataService.STORAGE_KEYS.DIVIDENDS, []),
      scenarios: DataService.loadData(DataService.STORAGE_KEYS.SCENARIOS, {}),
      currentScenario: DataService.loadData(DataService.STORAGE_KEYS.CURRENT_SCENARIO, 'neutral'),
      exportDate: timestamp,
      version: localStorage.getItem(VERSION_KEY) || '0.0.0',
      backupType: 'pre-migration'
    };
    
    localStorage.setItem('drip_pre_migration_backup', JSON.stringify(exportData));
    return true;
  } catch (error) {
    console.error('Failed to create pre-migration backup:', error);
    return false;
  }
};

/**
 * Restore from pre-migration backup
 * @returns {boolean} Success status
 */
const restoreFromBackup = () => {
  try {
    const backupData = localStorage.getItem('drip_pre_migration_backup');
    if (!backupData) {
      return false;
    }
    
    const data = JSON.parse(backupData);
    
    // Restore data
    DataService.saveData(DataService.STORAGE_KEYS.HOLDINGS, data.holdings);
    DataService.saveData(DataService.STORAGE_KEYS.DIVIDENDS, data.dividends);
    DataService.saveData(DataService.STORAGE_KEYS.SCENARIOS, data.scenarios);
    DataService.saveData(DataService.STORAGE_KEYS.CURRENT_SCENARIO, data.currentScenario);
    
    // Restore version
    localStorage.setItem(VERSION_KEY, data.version);
    
    return true;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
};

/**
 * Perform safe migration with backup
 * @returns {Object} Migration result with status and message
 */
const performSafeMigration = () => {
  if (!isMigrationNeeded()) {
    return { success: true, message: 'No migration needed' };
  }
  
  // Create backup before migration
  const backupCreated = createPreMigrationBackup();
  if (!backupCreated) {
    return { 
      success: false, 
      message: 'Failed to create backup before migration, aborting for safety' 
    };
  }
  
  // Perform migration
  const migrationResult = migrateData();
  
  // If migration failed, restore from backup
  if (!migrationResult.success) {
    const restored = restoreFromBackup();
    if (restored) {
      return {
        success: false,
        message: 'Migration failed, but data was restored from backup'
      };
    } else {
      return {
        success: false,
        message: 'Migration failed and backup restoration also failed. Data may be in an inconsistent state.'
      };
    }
  }
  
  return migrationResult;
};

export default {
  isMigrationNeeded,
  migrateData,
  performSafeMigration,
  CURRENT_VERSION
};