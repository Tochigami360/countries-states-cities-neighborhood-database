/**
 * Interactive console testing for location functions
 * Run with: node interactive-test.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load functions and data
const locationFunctions = require('./src/functions');
let data;

try {
  const dataPath = path.join(__dirname, './data/json/countries+states+cities.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  data = JSON.parse(rawData);
  console.log(`Data loaded: ${data.length} countries found`);
} catch (error) {
  console.error(`Error loading data: ${error.message}`);
  console.log('Make sure your locations.json file exists in the data directory');
  process.exit(1);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Available functions to test
const availableFunctions = {
  1: {
    name: 'getAllCountries',
    func: () => locationFunctions.getAllCountries(data),
    params: []
  },
  2: {
    name: 'getCountryByCode',
    func: (code) => locationFunctions.getCountryByCode(data, code),
    params: ['code (ISO2 or ISO3)']
  },
  3: {
    name: 'getCountryByName',
    func: (name) => locationFunctions.getCountryByName(data, name),
    params: ['country name']
  },
  4: {
    name: 'getAllStates',
    func: () => locationFunctions.getAllStates(data),
    params: []
  },
  5: {
    name: 'getStatesByCountry',
    func: (countryId) => locationFunctions.getStatesByCountry(data, countryId),
    params: ['country (ID, name, or ISO code)']
  },
  6: {
    name: 'getStateByCode',
    func: (countryId, stateCode) => locationFunctions.getStateByCode(data, countryId, stateCode),
    params: ['country (ID, name, or ISO code)', 'state code']
  },
  7: {
    name: 'getAllCities',
    func: () => locationFunctions.getAllCities(data),
    params: []
  },
  8: {
    name: 'getCitiesByCountry',
    func: (countryId) => locationFunctions.getCitiesByCountry(data, countryId),
    params: ['country (ID, name, or ISO code)']
  },
  9: {
    name: 'getCitiesByState',
    func: (countryId, stateId) => locationFunctions.getCitiesByState(data, countryId, stateId),
    params: ['country (ID, name, or ISO code)', 'state (ID, name, or code)']
  },
  10: {
    name: 'getCityByName',
    func: (countryId, stateId, cityName) => locationFunctions.getCityByName(data, countryId, stateId, cityName),
    params: ['country (ID, name, or ISO code)', 'state (ID, name, or code)', 'city name']
  },
  11: {
    name: 'getNeighborhoodsByCity',
    func: (countryId, stateId, cityId) => locationFunctions.getNeighborhoodsByCity(data, countryId, stateId, cityId),
    params: ['country (ID, name, or ISO code)', 'state (ID, name, or code)', 'city (ID or name)']
  },
  12: {
    name: 'searchCities',
    func: (query, countryId) => locationFunctions.searchCities(data, query, countryId || null),
    params: ['search query', 'country (optional - ID, name, or ISO code)']
  },
  13: {
    name: 'getCitiesByGeoLocation',
    func: (lat, lng, radius) => locationFunctions.getCitiesByGeoLocation(data, parseFloat(lat), parseFloat(lng), parseFloat(radius)),
    params: ['latitude', 'longitude', 'radius (km)']
  }
};

// Help function
function showHelp() {
  console.log('\n===== Available Functions =====');
  Object.keys(availableFunctions).forEach(key => {
    const func = availableFunctions[key];
    console.log(`${key}: ${func.name}(${func.params.join(', ')})`);
  });
  console.log('\nCommands:');
  console.log('help - Show this help');
  console.log('exit - Exit the program');
  console.log('===========================\n');
}

// Function to handle parameter input
async function getParameters(params) {
  const values = [];
  
  for (const param of params) {
    const value = await new Promise(resolve => {
      rl.question(`Enter ${param}: `, answer => resolve(answer));
    });
    values.push(value);
  }
  
  return values;
}

// Function to format and display results nicely
function displayResults(results) {
  if (results === null) {
    console.log('Result: null (Not found)');
    return;
  }
  
  if (Array.isArray(results)) {
    console.log(`Results: Array with ${results.length} items`);
    
    if (results.length === 0) {
      console.log('Empty array - no results found');
      return;
    }
    
    // Show first few items
    const samplesToShow = Math.min(5, results.length);
    console.log(`\nShowing first ${samplesToShow} of ${results.length} results:`);
    
    for (let i = 0; i < samplesToShow; i++) {
      const item = results[i];
      console.log(`\n--- Item ${i+1} ---`);
      
      // Determine what kind of object this is
      if (item.iso2 || item.iso3) {
        console.log(`Country: ${item.name} (${item.iso2})`);
      } else if (item.state_code) {
        console.log(`State: ${item.name} (${item.state_code})`);
        if (item.country_name) console.log(`Country: ${item.country_name}`);
      } else if (item.longitude && item.latitude) {
        console.log(`City: ${item.name}`);
        if (item.state_name) console.log(`State: ${item.state_name}`);
        if (item.country_name) console.log(`Country: ${item.country_name}`);
        if (item.distance_km) console.log(`Distance: ${item.distance_km.toFixed(2)} km`);
      } else {
        console.log(`Name: ${item.name}`);
      }
    }
    
    console.log('\nDo you want to see the full JSON result? (y/n)');
    rl.once('line', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log(JSON.stringify(results, null, 2));
      }
    });
  } else {
    // For single objects
    console.log('Result:');
    if (results.name) {
      console.log(`Name: ${results.name}`);
    }
    
    // Country-specific fields
    if (results.iso2) {
      console.log(`ISO Codes: ${results.iso2}, ${results.iso3}`);
      console.log(`Capital: ${results.capital}`);
      console.log(`Currency: ${results.currency_name} (${results.currency})`);
    }
    
    console.log('\nDo you want to see the full JSON result? (y/n)');
    rl.once('line', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log(JSON.stringify(results, null, 2));
      }
    });
  }
}

// Main interactive loop
async function startInteractiveMode() {
  showHelp();
  
  while (true) {
    const answer = await new Promise(resolve => {
      rl.question('\nEnter function number (or help/exit): ', answer => resolve(answer));
    });
    
    if (answer.toLowerCase() === 'exit') {
      console.log('Exiting...');
      rl.close();
      return;
    }
    
    if (answer.toLowerCase() === 'help') {
      showHelp();
      continue;
    }
    
    const functionChoice = availableFunctions[answer];
    if (!functionChoice) {
      console.log('Invalid function number. Type "help" to see available functions.');
      continue;
    }
    
    console.log(`\nTesting function: ${functionChoice.name}`);
    
    // Get parameters if needed
    const params = await getParameters(functionChoice.params);
    
    console.log('\nExecuting...');
    try {
      // Execute the function with the provided parameters
      const results = functionChoice.func(...params);
      displayResults(results);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

// Start the interactive test
console.log('=== Interactive Testing Console ===');
console.log('Type "help" for available functions or "exit" to quit');
startInteractiveMode();