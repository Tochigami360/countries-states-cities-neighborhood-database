/**
 * Country, City, State, and Neighborhood Data Functions
 */

/**
 * Get all countries from the dataset
 * @param {Array} data - The complete dataset
 * @return {Array} Array of country objects
 */
function getAllCountries(data) {
    return data;
  }
  
  /**
   * Get a specific country by its ISO code
   * @param {Array} data - The complete dataset
   * @param {string} isoCode - ISO2 or ISO3 code to search for
   * @return {Object|null} Country object or null if not found
   */
  function getCountryByCode(data, isoCode) {
    const code = isoCode.toUpperCase();
    return data.find(country => 
      country.iso2 === code || country.iso3 === code
    ) || null;
  }
  
  /**
   * Get a specific country by name
   * @param {Array} data - The complete dataset
   * @param {string} name - Country name to search for
   * @return {Object|null} Country object or null if not found
   */
  function getCountryByName(data, name) {
    const normalizedName = name.toLowerCase();
    return data.find(country => 
      country.name.toLowerCase() === normalizedName
    ) || null;
  }
  
  /**
   * Get all states/regions from all countries
   * @param {Array} data - The complete dataset
   * @return {Array} Array of state objects with country info attached
   */
  function getAllStates(data) {
    const allStates = [];
    
    data.forEach(country => {
      if (country.states && country.states.length) {
        country.states.forEach(state => {
          allStates.push({
            ...state,
            country_name: country.name,
            country_id: country.id,
            country_iso2: country.iso2,
            country_iso3: country.iso3
          });
        });
      }
    });
    
    return allStates;
  }
  
  /**
   * Get all states for a specific country
   * @param {Array} data - The complete dataset
   * @param {string|number} countryIdentifier - Country ID, name, or ISO code
   * @return {Array} Array of state objects or empty array if country not found
   */
  function getStatesByCountry(data, countryIdentifier) {
    let country;
    
    if (typeof countryIdentifier === 'number') {
      country = data.find(c => c.id === countryIdentifier);
    } else if (typeof countryIdentifier === 'string') {
      const identifier = countryIdentifier.toUpperCase();
      country = data.find(c => 
        c.name.toUpperCase() === identifier || 
        c.iso2 === identifier || 
        c.iso3 === identifier
      );
    }
    
    return country && country.states ? country.states : [];
  }
  
  /**
   * Get a specific state by its code
   * @param {Array} data - The complete dataset
   * @param {string|number} countryIdentifier - Country ID, name, or ISO code
   * @param {string} stateCode - State code to search for
   * @return {Object|null} State object or null if not found
   */
  function getStateByCode(data, countryIdentifier, stateCode) {
    const states = getStatesByCountry(data, countryIdentifier);
    const code = stateCode.toUpperCase();
    
    return states.find(state => 
      state.state_code.toUpperCase() === code
    ) || null;
  }
  
  /**
   * Get all cities from all countries
   * @param {Array} data - The complete dataset
   * @return {Array} Array of city objects with country and state info attached
   */
  function getAllCities(data) {
    const allCities = [];
    
    data.forEach(country => {
      if (country.states && country.states.length) {
        country.states.forEach(state => {
          if (state.cities && state.cities.length) {
            state.cities.forEach(city => {
              allCities.push({
                ...city,
                state_name: state.name,
                state_id: state.id,
                state_code: state.state_code,
                country_name: country.name,
                country_id: country.id,
                country_iso2: country.iso2,
                country_iso3: country.iso3
              });
            });
          }
        });
      }
    });
    
    return allCities;
  }
  
  /**
   * Get all cities for a specific country
   * @param {Array} data - The complete dataset
   * @param {string|number} countryIdentifier - Country ID, name, or ISO code
   * @return {Array} Array of city objects with state info attached
   */
  function getCitiesByCountry(data, countryIdentifier) {
    const states = getStatesByCountry(data, countryIdentifier);
    const cities = [];
    
    states.forEach(state => {
      if (state.cities && state.cities.length) {
        state.cities.forEach(city => {
          cities.push({
            ...city,
            state_name: state.name,
            state_id: state.id,
            state_code: state.state_code
          });
        });
      }
    });
    
    return cities;
  }
  
  /**
   * Get all cities for a specific state
   * @param {Array} data - The complete dataset
   * @param {string|number} countryIdentifier - Country ID, name, or ISO code
   * @param {string|number} stateIdentifier - State ID, name, or code
   * @return {Array} Array of city objects
   */
  function getCitiesByState(data, countryIdentifier, stateIdentifier) {
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
    
    return state && state.cities ? state.cities : [];
  }
  
  /**
   * Get a specific city by name
   * @param {Array} data - The complete dataset
   * @param {string|number} countryIdentifier - Country ID, name, or ISO code
   * @param {string|number} stateIdentifier - State ID, name, or code
   * @param {string} cityName - City name to search for
   * @return {Object|null} City object or null if not found
   */
  function getCityByName(data, countryIdentifier, stateIdentifier, cityName) {
    const cities = getCitiesByState(data, countryIdentifier, stateIdentifier);
    const name = cityName.toLowerCase();
    
    return cities.find(city => 
      city.name.toLowerCase() === name
    ) || null;
  }
  
/**
 * Get all neighborhoods for a specific city
 * @param {Array} data - The complete dataset
 * @param {string|number} countryIdentifier - Country ID, name, or ISO code
 * @param {string|number} stateIdentifier - State ID, name, or code
 * @param {string|number} cityIdentifier - City ID or name
 * @param {string} basePath - Base path for neighborhood data files (default: './data/json/neighborhoods')
 * @return {Array} Array of neighborhood objects or empty array if city not found or has no neighborhoods
 */
function getNeighborhoodsByCity(data, countryIdentifier, stateIdentifier, cityIdentifier, basePath = '../data/json/neighborhoods') {
  const path = require('path');
  const fse = require('fs-extra');
  
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
  
  // Load neighborhoods from the external file with the correct path structure
  try {
    const neighborhoodsFilePath = path.join(__dirname, basePath, stateIdentifier, 'neighborhoods.json');
    
    if (!fse.pathExistsSync(neighborhoodsFilePath)) {
      return [];
    }
    
    const neighborhoodsData = fse.readJsonSync(neighborhoodsFilePath);
    
    // Filter neighborhoods for this city
    return neighborhoodsData
      .filter(item => item.city.toLowerCase() === city.name.toLowerCase())
      .map(item => ({
        name: item.neighborhood
      }));
  } catch (error) {
    console.error(`Error loading neighborhoods data: ${error.message}`);
    return [];
  }
}
  
  /**
   * Search for cities matching a query across all countries or a specific country
   * @param {Array} data - The complete dataset
   * @param {string} query - Search query
   * @param {string|number} [countryIdentifier] - Optional country to limit search
   * @return {Array} Array of matching city objects
   */
  function searchCities(data, query, countryIdentifier = null) {
    const searchTerm = query.toLowerCase();
    const cities = countryIdentifier ? 
      getCitiesByCountry(data, countryIdentifier) : 
      getAllCities(data);
    
    return cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm)
    );
  }
  
  /**
   * Get cities by GPS coordinates and radius
   * @param {Array} data - The complete dataset
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {number} radiusKm - Search radius in kilometers
   * @return {Array} Array of city objects within the radius
   */
  function getCitiesByGeoLocation(data, latitude, longitude, radiusKm) {
    const allCities = getAllCities(data);
    const results = [];
    
    allCities.forEach(city => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        parseFloat(city.latitude), 
        parseFloat(city.longitude)
      );
      
      if (distance <= radiusKm) {
        results.push({
          ...city,
          distance_km: Math.round(distance * 100) / 100
        });
      }
    });
    
    // Sort by distance
    return results.sort((a, b) => a.distance_km - b.distance_km);
  }
  
  /**
   * Calculate distance between two points using Haversine formula
   * @private
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lon1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lon2 - Longitude of point 2
   * @return {number} Distance in kilometers
   */
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  /**
   * Convert degrees to radians
   * @private
   * @param {number} value - Value in degrees
   * @return {number} Value in radians
   */
  function toRad(value) {
    return value * Math.PI / 180;
  }
  
  module.exports = {
    getAllCountries,
    getCountryByCode,
    getCountryByName,
    getAllStates,
    getStatesByCountry,
    getStateByCode,
    getAllCities,
    getCitiesByCountry,
    getCitiesByState,
    getCityByName,
    getNeighborhoodsByCity,
    searchCities,
    getCitiesByGeoLocation
  };