import { apiClient } from "./apiClient";
import { API_CONFIG } from "./config";

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  area?: string;
}

export interface Area {
  id: string;
  name: string;
  bounds?: {
    northEast: { lat: number; lng: number };
    southWest: { lat: number; lng: number };
  };
}

export class LocationService {
  static async getAreas(): Promise<Area[]> {
    return apiClient.get<Area[]>(API_CONFIG.ENDPOINTS.LOCATION.AREAS);
  }

  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<LocationData> {
    const endpoint = `${API_CONFIG.ENDPOINTS.LOCATION.REVERSE_GEOCODE}?lat=${latitude}&lng=${longitude}`;
    return apiClient.get<LocationData>(endpoint);
  }

  // Client-side location helpers (don't require API)
  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Try to get address from API
            const locationData = await this.reverseGeocode(latitude, longitude);
            resolve(locationData);
          } catch {
            // Fallback to basic location data
            resolve({
              latitude,
              longitude,
            });
          }
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }
}
