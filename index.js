const locationFunctions = require('./src/functions');
const data = require('./data/json/countries+states+cities.json');

/**
 * Creates a factory with all location functions pre-loaded with the dataset
 * @return {Object} Object containing all location functions
 */
const createAPI = () => {
  return {
    getAllCountries: () => locationFunctions.getAllCountries(data),
    getCountryByCode: (code) => locationFunctions.getCountryByCode(data, code),
    getCountryByName: (name) => locationFunctions.getCountryByName(data, name),
    getAllStates: () => locationFunctions.getAllStates(data),
    getStatesByCountry: (countryIdentifier) => locationFunctions.getStatesByCountry(data, countryIdentifier),
    getStateByCode: (countryIdentifier, stateCode) => locationFunctions.getStateByCode(data, countryIdentifier, stateCode),
    getAllCities: () => locationFunctions.getAllCities(data),
    getCitiesByCountry: (countryIdentifier) => locationFunctions.getCitiesByCountry(data, countryIdentifier),
    getCitiesByState: (countryIdentifier, stateIdentifier) => locationFunctions.getCitiesByState(data, countryIdentifier, stateIdentifier),
    getCityByName: (countryIdentifier, stateIdentifier, cityName) => locationFunctions.getCityByName(data, countryIdentifier, stateIdentifier, cityName),
    getNeighborhoodsByCity: (countryIdentifier, stateIdentifier, cityIdentifier) => locationFunctions.getNeighborhoodsByCity(data, countryIdentifier, stateIdentifier, cityIdentifier),
    searchCities: (query, countryIdentifier) => locationFunctions.searchCities(data, query, countryIdentifier),
    getCitiesByGeoLocation: (latitude, longitude, radiusKm) => locationFunctions.getCitiesByGeoLocation(data, latitude, longitude, radiusKm)
  };
};

// Export the API factory and raw functions
module.exports = {
  createAPI,
  ...locationFunctions
};