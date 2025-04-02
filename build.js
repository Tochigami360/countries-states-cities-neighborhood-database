const fs = require('fs');
const path = require('path');

// Create browser-specific functions that don't use fs
console.log('Building browser-compatible functions...');

// Copy and adapt the functions
const functionsPath = path.join(__dirname, 'src', 'functions.js');
const browserFunctionsPath = path.join(__dirname, 'src', 'browser-functions.js');

// Read the source functions
let content = fs.readFileSync(functionsPath, 'utf8');

// Modify the content to be browser-compatible
// This is a simplified approach - you may need more sophisticated parsing
content = content.replace(/const\s+fs\s*=\s*require\s*\(\s*['"]fs['"]\s*\)\s*;?/g, '');
content = content.replace(/fs\.existsSync/g, '/* fs.existsSync - removed */');
content = content.replace(/fs\.readFileSync/g, '/* fs.readFileSync - removed */');

// Add the browser-compatible version of getNeighborhoodsByCity
content += `
async function getNeighborhoodsByCity(data, countryIdentifier, stateIdentifier, cityIdentifier) {
  const path = require('path');
  
  // First, verify the city exists in our data
  const cities = getCitiesByState(data, countryIdentifier, stateIdentifier);
  
  let city;
  if (typeof cityIdentifier === 'number') {
    city = cities.find(c => c.id === cityIdentifier);
  } else if (typeof cityIdentifier === 'string') {
    const name = cityIdentifier.toLowerCase();
    city = cities.find(c => c.name.toLowerCase() === name);
  }
  
  if (!city) {
    return [];
  }
  
  // Find the state to get its code for the file path
  const states = getStatesByCountry(data, countryIdentifier);
  
  let state;
  if (typeof stateIdentifier === 'number') {
    state = states.find(s => s.id === stateIdentifier);
  } else if (typeof stateIdentifier === 'string') {
    const identifier = stateIdentifier.toUpperCase();
    state = states.find(s => 
      s.name.toUpperCase() === identifier || 
      s.state_code.toUpperCase() === identifier
    );
  }
  
  if (!state) {
    return [];
  }

  // Environment detection to handle different contexts
  let neighborhoodsData = [];
  
  try {
    // Check if we're in a browser/Next.js client-side environment
    if (typeof window !== 'undefined') {
      try {
        // Try fetch approach first for browser environments
        const response = await fetch(\`/data/json/neighborhoods/\${state.state_code}/neighborhoods.json\`);
        if (response.ok) {
          neighborhoodsData = await response.json();
        }
      } catch (fetchError) {
        // If fetch fails, try dynamic import (will work in webpack environments)
        try {
          const neighborhoodsModule = await import(
            /* webpackIgnore: true */
            \`../data/json/neighborhoods/\${state.state_code}/neighborhoods.json\`
          );
          neighborhoodsData = neighborhoodsModule.default || neighborhoodsModule;
        } catch (importError) {
          console.error('Failed to load neighborhood data:', importError);
          return [];
        }
      }
    } else {
      // Server-side environment - safe to use fs
      try {
        // Use dynamic require instead of fs to avoid bundling issues
        neighborhoodsData = require(\`../data/json/neighborhoods/\${state.state_code}/neighborhoods.json\`);
      } catch (requireError) {
        // If require fails, the file likely doesn't exist
        return [];
      }
    }

    // Filter neighborhoods for this city
    return neighborhoodsData
      .filter(item => item.city.toLowerCase() === city.name.toLowerCase())
      .map(item => ({
        name: item.neighborhood
      }));
  } catch (error) {
    console.error(\`Error loading neighborhoods data: ${error.message}\`);
    return [];
  }}`;

// Write the browser-compatible file
fs.writeFileSync(browserFunctionsPath, content);

console.log('Build completed successfully.');