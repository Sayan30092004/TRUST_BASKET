import { Location } from '@/types';

export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const reverseGeocode = async (latitude: number, longitude: number): Promise<{area: string, city: string, address: string}> => {
  try {
    // Use Google Geocoding API if available
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    if (apiKey) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const components = result.address_components;
        
        let area = '';
        let city = '';
        let address = result.formatted_address;
        
        // Extract area and city from address components
        for (const component of components) {
          if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
            area = component.long_name;
          } else if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
        }
        
        // Fallback to extracting from formatted address
        if (!area || !city) {
          const addressParts = address.split(',');
          if (addressParts.length >= 2) {
            area = area || addressParts[0].trim();
            city = city || addressParts[1].trim();
          }
        }
        
        return {
          area: area || 'Local Area',
          city: city || 'Your City',
          address: address
        };
      }
    }
    
    // Fallback to OpenStreetMap Nominatim API (free alternative)
    const osmResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    const osmData = await osmResponse.json();
    
    if (osmData && osmData.address) {
      const addr = osmData.address;
      const area = addr.neighbourhood || addr.suburb || addr.town || addr.village || 'Local Area';
      const city = addr.city || addr.town || addr.county || addr.state || 'Your City';
      const address = osmData.display_name || 'Current Location';
      
      return { area, city, address };
    }
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
  }
  
  // Fallback to default values
  return {
    area: 'Local Area',
    city: 'Your City',
    address: 'Current Location'
  };
};

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Get real location data using reverse geocoding
          const locationData = await reverseGeocode(latitude, longitude);
          
          const location: Location = {
            latitude,
            longitude,
            address: locationData.address,
            area: locationData.area,
            city: locationData.city
          };
          
          resolve(location);
        } catch (error) {
          // If reverse geocoding fails, use coordinates with default names
          const location: Location = {
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            area: 'Local Area',
            city: 'Your City'
          };
          
          resolve(location);
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
};

export const getLocationName = (location: Location): string => {
  return `${location.area}, ${location.city}`;
};