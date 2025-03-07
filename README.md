# Countries-States-Cities-Neighborhood Database

A comprehensive library for working with country, state/region, city, and neighborhood data. This npm package provides simple, intuitive functions to query and filter location data from around the world.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Data Structure](#data-structure)
- [API Reference](#api-reference)
  - [Countries](#countries)
  - [States/Regions](#statesregions)
  - [Cities](#cities)
  - [Neighborhoods](#neighborhoods)
  - [Search & Geolocation](#search--geolocation)

## Installation

```bash
npm install countries-states-cities-neighborhood-database
```

## Usage

The package provides two ways to use the library:

### 1. API Factory (Recommended)

The API factory pattern is the simplest way to use the library, as it loads the dataset automatically:

```javascript
const locationDB = require('countries-states-cities-neighborhood-database');
const api = locationDB.createAPI();

// Get all countries
const countries = api.getAllCountries();

// Get all cities in the United States
const usCities = api.getCitiesByCountry('US');

// Find cities near a location (within 50km)
const nearbyCities = api.getCitiesByGeoLocation(40.7128, -74.0060, 50);
```

### 2. Direct Function Access

You can also use the functions directly with your own dataset:

```javascript
const locationDB = require('countries-states-cities-neighborhood-database');
const data = require('./path/to/your/data.json');

// Get all countries
const countries = locationDB.getAllCountries(data);

// Get all cities in the United States
const usCities = locationDB.getCitiesByCountry(data, 'US');

// Find cities near a location (within 50km)
const nearbyCities = locationDB.getCitiesByGeoLocation(data, 40.7128, -74.0060, 50);
```

## Data Structure

This library expects your data to follow a specific structure:

```javascript
[
  {
    "id": 231,
    "name": "United States",
    "iso2": "US",
    "iso3": "USA",
    "states": [
      {
        "id": 3901,
        "name": "California",
        "state_code": "CA",
        "cities": [
          {
            "id": 52327,
            "name": "San Francisco",
            "latitude": "37.77493",
            "longitude": "-122.41942"
          }
        ]
      }
    ]
  }
]
```

## API Reference

The examples below show both usage patterns: the API factory method and direct function calls.

### Countries

#### `getAllCountries(data)`
Returns an array of all countries in the dataset.

- **Parameters**:
  - `data` (Array): The complete dataset *(not needed when using API factory)*
- **Returns**: Array of country objects
- **Example**:
  ```javascript
  // Using API factory
  const countries = api.getAllCountries();
  
  // Direct function call
  const countries = locationDB.getAllCountries(data);
  
  console.log(countries.length); // Number of countries
  ```

#### `getCountryByCode(data, isoCode)`
Finds a country by its ISO code (ISO2 or ISO3).

- **Parameters**:
  - `data` (Array): The complete dataset *(not needed when using API factory)*
  - `isoCode` (String): ISO2 or ISO3 code to search for
- **Returns**: Country object or null if not found
- **Example**:
  ```javascript
  // Using API factory
  const usa = api.getCountryByCode('US');
  const canada = api.getCountryByCode('CAN');
  
  // Direct function call
  const usa = locationDB.getCountryByCode(data, 'US');
  const canada = locationDB.getCountryByCode(data, 'CAN');
  ```

#### `getCountryByName(data, name)`
Finds a country by its name.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `name` (String): Country name to search for
- **Returns**: Country object or null if not found
- **Example**:
  ```javascript
  const japan = getCountryByName(data, 'Japan');
  ```

### States/Regions

#### `getAllStates(data)`
Returns an array of all states/regions from all countries.

- **Parameters**:
  - `data` (Array): The complete dataset
- **Returns**: Array of state objects with country info attached
- **Example**:
  ```javascript
  const allStates = getAllStates(data);
  console.log(allStates[0]); // First state with country information
  ```

#### `getStatesByCountry(data, countryIdentifier)`
Returns all states for a specific country.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `countryIdentifier` (String|Number): Country ID, name, or ISO code
- **Returns**: Array of state objects or empty array if country not found
- **Example**:
  ```javascript
  const usStates = getStatesByCountry(data, 'US');
  const canadianProvinces = getStatesByCountry(data, 'Canada');
  ```

#### `getStateByCode(data, countryIdentifier, stateCode)`
Finds a specific state by its code.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `countryIdentifier` (String|Number): Country ID, name, or ISO code
  - `stateCode` (String): State code to search for
- **Returns**: State object or null if not found
- **Example**:
  ```javascript
  const california = getStateByCode(data, 'US', 'CA');
  ```

### Cities

#### `getAllCities(data)`
Returns an array of all cities from all countries.

- **Parameters**:
  - `data` (Array): The complete dataset
- **Returns**: Array of city objects with country and state info attached
- **Example**:
  ```javascript
  const allCities = getAllCities(data);
  console.log(allCities.length); // Total number of cities
  ```

#### `getCitiesByCountry(data, countryIdentifier)`
Returns all cities for a specific country.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `countryIdentifier` (String|Number): Country ID, name, or ISO code
- **Returns**: Array of city objects with state info attached
- **Example**:
  ```javascript
  const usCities = getCitiesByCountry(data, 'US');
  ```

#### `getCitiesByState(data, countryIdentifier, stateIdentifier)`
Returns all cities for a specific state/region.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `countryIdentifier` (String|Number): Country ID, name, or ISO code
  - `stateIdentifier` (String|Number): State ID, name, or code
- **Returns**: Array of city objects
- **Example**:
  ```javascript
  const texasCities = getCitiesByState(data, 'US', 'TX');
  ```

#### `getCityByName(data, countryIdentifier, stateIdentifier, cityName)`
Finds a specific city by name within a state.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `countryIdentifier` (String|Number): Country ID, name, or ISO code
  - `stateIdentifier` (String|Number): State ID, name, or code
  - `cityName` (String): City name to search for
- **Returns**: City object or null if not found
- **Example**:
  ```javascript
  const boston = getCityByName(data, 'US', 'MA', 'Boston');
  ```

### Neighborhoods

#### `getNeighborhoodsByCity(data, countryIdentifier, stateIdentifier, cityIdentifier, basePath)`
Returns all neighborhoods for a specific city.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `countryIdentifier` (String|Number): Country ID, name, or ISO code
  - `stateIdentifier` (String|Number): State ID, name, or code
  - `cityIdentifier` (String|Number): City ID or name
  - `basePath` (String): Base path for neighborhood data files (default: '../data/json/neighborhoods')
- **Returns**: Array of neighborhood objects or empty array if city not found or has no neighborhoods
- **Example**:
  ```javascript
  const neighborhoods = getNeighborhoodsByCity(data, 'US', 'NY', 'New York');
  ```

### Search & Geolocation

#### `searchCities(data, query, countryIdentifier)`
Searches for cities matching a query across all countries or a specific country.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `query` (String): Search query
  - `countryIdentifier` (String|Number, optional): Country to limit search
- **Returns**: Array of matching city objects
- **Example**:
  ```javascript
  const springfields = searchCities(data, 'Springfield');
  const canadianVancouvers = searchCities(data, 'Vancouver', 'CA');
  ```

#### `getCitiesByGeoLocation(data, latitude, longitude, radiusKm)`
Finds cities within a certain radius of GPS coordinates.

- **Parameters**:
  - `data` (Array): The complete dataset
  - `latitude` (Number): Latitude coordinate
  - `longitude` (Number): Longitude coordinate
  - `radiusKm` (Number): Search radius in kilometers
- **Returns**: Array of city objects within the radius, sorted by distance
- **Example**:
  ```javascript
  // Cities within 50km of NYC
  const citiesNearNYC = getCitiesByGeoLocation(data, 40.7128, -74.0060, 50);
  ```

## Internal Helper Functions

The library uses these internal helper functions:

- `calculateDistance(lat1, lon1, lat2, lon2)`: Calculates distance between two points using the Haversine formula
- `toRad(value)`: Converts degrees to radians

## Project Structure

```
countries-states-cities-neighborhood-database/
│
├── data/
│   └── json/
│       ├── countries+states+cities.json    # Main dataset
│       └── neighborhoods/                  # Neighborhood data
│           └── [STATE_CODE]/
│               └── neighborhoods.json
│
├── src/
│   └── functions.js                        # Core functionality
│
├── index.js                                # API factory & exports
├── package.json
└── README.md
```

## Testing

This package uses Jest for testing:

```bash
npm test
```

## TypeScript Usage

The package can be used in TypeScript applications. Here's a basic example with type definitions:

```typescript
// Type definitions for the database
interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  states: State[];
}

interface State {
  id: number;
  name: string;
  state_code: string;
  cities: City[];
}

interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

// Using the package with TypeScript
import { createAPI } from 'countries-states-cities-neighborhood-database';

const api = createAPI();
const countries: Country[] = api.getAllCountries();
const usStates: State[] = api.getStatesByCountry('US');
```

See the full React component example in the examples directory.

## License

ISC