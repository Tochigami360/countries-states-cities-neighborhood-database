const locationFunctions = require('../src/functions');
const mockData = [
    {
      id: 1,
      name: "United States",
      iso3: "USA",
      iso2: "US",
      capital: "Washington D.C.",
      currency: "USD",
      states: [
        {
          id: 101,
          name: "California",
          state_code: "CA",
          latitude: "36.77826100",
          longitude: "-119.41793240",
          cities: [
            {
              id: 1001,
              name: "San Francisco",
              latitude: "37.77493000",
              longitude: "-122.41942000",
              neighborhoods: [
                {
                  id: 10001,
                  name: "Mission District"
                },
                {
                  id: 10002,
                  name: "SoMa"
                }
              ]
            },
            {
              id: 1002,
              name: "Los Angeles",
              latitude: "34.05223000",
              longitude: "-118.24368000"
            }
          ]
        },
        {
          id: 102,
          name: "New York",
          state_code: "NY",
          latitude: "40.71277530",
          longitude: "-74.00597280",
          cities: [
            {
              id: 1003,
              name: "New York City",
              latitude: "40.71277530",
              longitude: "-74.00597280"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Canada",
      iso3: "CAN",
      iso2: "CA",
      capital: "Ottawa",
      currency: "CAD",
      states: [
        {
          id: 201,
          name: "Ontario",
          state_code: "ON",
          latitude: "51.25377800",
          longitude: "-85.32321400",
          cities: [
            {
              id: 2001,
              name: "Toronto",
              latitude: "43.65107000",
              longitude: "-79.34707000"
            }
          ]
        }
      ]
    }
  ];

describe('Location Functions Tests', () => {
  // Country-related functions
  describe('Country Functions', () => {
    test('getAllCountries should return all countries', () => {
      const countries = locationFunctions.getAllCountries(mockData);
      expect(countries).toEqual(mockData);
      expect(countries.length).toBe(2);
    });

    test('getCountryByCode should find country by ISO2 code', () => {
      const country = locationFunctions.getCountryByCode(mockData, 'US');
      expect(country.name).toBe('United States');
    });

    test('getCountryByCode should find country by ISO3 code', () => {
      const country = locationFunctions.getCountryByCode(mockData, 'CAN');
      expect(country.name).toBe('Canada');
    });

    test('getCountryByCode should return null for non-existent code', () => {
      const country = locationFunctions.getCountryByCode(mockData, 'XX');
      expect(country).toBeNull();
    });

    test('getCountryByName should find country by name', () => {
      const country = locationFunctions.getCountryByName(mockData, 'Canada');
      expect(country.iso2).toBe('CA');
    });

    test('getCountryByName should return null for non-existent country', () => {
      const country = locationFunctions.getCountryByName(mockData, 'Wakanda');
      expect(country).toBeNull();
    });
  });

  // State-related functions
  describe('State Functions', () => {
    test('getAllStates should return all states with country info', () => {
      const states = locationFunctions.getAllStates(mockData);
      expect(states.length).toBe(3);
      expect(states[0].name).toBe('California');
      expect(states[0].country_name).toBe('United States');
    });

    test('getStatesByCountry should return states for a country by ID', () => {
      const states = locationFunctions.getStatesByCountry(mockData, 1);
      expect(states.length).toBe(2);
      expect(states[0].name).toBe('California');
    });

    test('getStatesByCountry should return states for a country by ISO code', () => {
      const states = locationFunctions.getStatesByCountry(mockData, 'CA');
      expect(states.length).toBe(1);
      expect(states[0].name).toBe('Ontario');
    });

    test('getStatesByCountry should return states for a country by name', () => {
      const states = locationFunctions.getStatesByCountry(mockData, 'United States');
      expect(states.length).toBe(2);
    });

    test('getStateByCode should return a specific state', () => {
      const state = locationFunctions.getStateByCode(mockData, 'US', 'NY');
      expect(state.name).toBe('New York');
    });

    test('getStateByCode should return null for non-existent state', () => {
      const state = locationFunctions.getStateByCode(mockData, 'US', 'FL');
      expect(state).toBeNull();
    });
  });

  // City-related functions
  describe('City Functions', () => {
    test('getAllCities should return all cities with country and state info', () => {
      const cities = locationFunctions.getAllCities(mockData);
      expect(cities.length).toBe(4);
      expect(cities[0].name).toBe('San Francisco');
      expect(cities[0].state_name).toBe('California');
      expect(cities[0].country_name).toBe('United States');
    });

    test('getCitiesByCountry should return all cities in a country', () => {
      const cities = locationFunctions.getCitiesByCountry(mockData, 'US');
      expect(cities.length).toBe(3);
    });

    test('getCitiesByState should return cities in a state by code', () => {
      const cities = locationFunctions.getCitiesByState(mockData, 'US', 'CA');
      expect(cities.length).toBe(2);
      expect(cities[0].name).toBe('San Francisco');
      expect(cities[1].name).toBe('Los Angeles');
    });

    test('getCitiesByState should return cities in a state by name', () => {
      const cities = locationFunctions.getCitiesByState(mockData, 'US', 'California');
      expect(cities.length).toBe(2);
    });

    test('getCityByName should return a specific city', () => {
      const city = locationFunctions.getCityByName(mockData, 'US', 'CA', 'Los Angeles');
      expect(city.id).toBe(1002);
    });

    test('getCityByName should return null for non-existent city', () => {
      const city = locationFunctions.getCityByName(mockData, 'US', 'CA', 'San Diego');
      expect(city).toBeNull();
    });
  });

// Neighborhood-related functions
describe('Neighborhood Functions', () => {
    // Mock the fs and path modules
    const fs = require('fs');
    const path = require('path');
    
    // Save the original methods to restore them after tests
    const originalExistsSync = fs.existsSync;
    const originalReadFileSync = fs.readFileSync;
    const originalJoin = path.join;
    
    beforeEach(() => {
      // Mock implementation of fs.existsSync
      fs.existsSync = jest.fn((filePath) => {
        return filePath.includes('CA/neighborhoods.json') || filePath.includes('NY/neighborhoods.json');
      });
      
      // Mock implementation of fs.readFileSync
      fs.readFileSync = jest.fn((filePath, encoding) => {
        if (filePath.includes('CA/neighborhoods.json')) {
          return JSON.stringify([
            { city: "San Francisco", neighborhood: "Mission District" },
            { city: "San Francisco", neighborhood: "SoMa" },
            { city: "Los Angeles", neighborhood: "Downtown" },
            { city: "Los Angeles", neighborhood: "Hollywood" }
          ]);
        } else if (filePath.includes('NY/neighborhoods.json')) {
          return JSON.stringify([
            { city: "New York City", neighborhood: "Manhattan" },
            { city: "New York City", neighborhood: "Brooklyn" }
          ]);
        }
        throw new Error('File not found');
      });
      
      // Mock implementation of path.join to make testing easier
      path.join = jest.fn((...args) => args.join('/'));
    });
    
    afterEach(() => {
      // Restore original functions
      fs.existsSync = originalExistsSync;
      fs.readFileSync = originalReadFileSync;
      path.join = originalJoin;
    });
    
    test('getNeighborhoodsByCity should return neighborhoods from external file for a city', () => {
      // Use default path (should be ./data/json/neighborhoods)
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'CA', 'San Francisco');
      expect(neighborhoods.length).toBe(2);
      expect(neighborhoods[0].name).toBe('Mission District');
      expect(neighborhoods[1].name).toBe('SoMa');
      
      // Check that the fs module was called with the correct path
      expect(fs.existsSync).toHaveBeenCalledWith('../data/json/neighborhoods/CA/neighborhoods.json');
      expect(fs.readFileSync).toHaveBeenCalledWith('../data/json/neighborhoods/CA/neighborhoods.json', 'utf8');
    });
    
    test('getNeighborhoodsByCity should accept custom base path', () => {
      const customPath = '../custom/path';
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'CA', 'San Francisco', customPath);
      
      // Verify the custom path was used
      expect(fs.existsSync).toHaveBeenCalledWith('../custom/path/CA/neighborhoods.json');
    });
    
    test('getNeighborhoodsByCity should return neighborhoods for a different city', () => {
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'CA', 'Los Angeles');
      expect(neighborhoods.length).toBe(2);
      expect(neighborhoods[0].name).toBe('Downtown');
      expect(neighborhoods[1].name).toBe('Hollywood');
    });
    
    test('getNeighborhoodsByCity should return neighborhoods for a city in a different state', () => {
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'NY', 'New York City');
      expect(neighborhoods.length).toBe(2);
      expect(neighborhoods[0].name).toBe('Manhattan');
      expect(neighborhoods[1].name).toBe('Brooklyn');
    });
    
    test('getNeighborhoodsByCity should return empty array for a non-existent city', () => {
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'CA', 'San Diego');
      expect(neighborhoods).toEqual([]);
      // The file should not be read since the city doesn't exist
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });
    
    test('getNeighborhoodsByCity should return empty array for a non-existent state', () => {
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'FL', 'Miami');
      expect(neighborhoods).toEqual([]);
      // The file should not be read since the state doesn't exist
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });
    
    test('getNeighborhoodsByCity should handle file not found gracefully', () => {
      // Mock existsSync to return false for this specific test
      fs.existsSync.mockImplementationOnce(() => false);
      
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'CA', 'San Francisco');
      expect(neighborhoods).toEqual([]);
      // readFileSync should not be called if the file doesn't exist
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });
    
    test('getNeighborhoodsByCity should handle parsing errors gracefully', () => {
      // Mock readFileSync to return invalid JSON for this specific test
      fs.readFileSync.mockImplementationOnce(() => 'not valid json');
      
      // We expect console.error to be called, so we'll spy on it
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const neighborhoods = locationFunctions.getNeighborhoodsByCity(mockData, 'US', 'CA', 'San Francisco');
      expect(neighborhoods).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  // Search functions
  describe('Search Functions', () => {
    test('searchCities should find cities matching a query in all countries', () => {
      const cities = locationFunctions.searchCities(mockData, 'San');
      expect(cities.length).toBe(1);
      expect(cities[0].name).toBe('San Francisco');
    });

    test('searchCities should find cities matching a query in a specific country', () => {
      const cities = locationFunctions.searchCities(mockData, 'New', 'US');
      expect(cities.length).toBe(1);
      expect(cities[0].name).toBe('New York City');
    });

    test('getCitiesByGeoLocation should find cities within a radius', () => {
      // San Francisco coordinates with small radius should return San Francisco
      const cities = locationFunctions.getCitiesByGeoLocation(
        mockData, 
        37.774930, 
        -122.419420, 
        10
      );
      expect(cities.length).toBe(1);
      expect(cities[0].name).toBe('San Francisco');
    });

    test('getCitiesByGeoLocation should return sorted results by distance', () => {
      // Using a point between SF and LA to get both within radius
      const cities = locationFunctions.getCitiesByGeoLocation(
        mockData, 
        36.5, 
        -120.5, 
        400 // Large enough radius to capture both cities
      );
      expect(cities.length).toBe(2);
      // Should be sorted by distance
      expect(cities[0].distance_km).toBeLessThan(cities[1].distance_km);
    });
  });
});