import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

// Default: Vila Esperança center (used for distance calculation when no GPS)
export const DEFAULT_LAT = -23.525;
export const DEFAULT_LNG = -46.555;

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
    permissionDenied: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        lat: null,
        lng: null,
        error: "Geolocalização não suportada",
        loading: false,
        permissionDenied: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setState({
          lat: null,
          lng: null,
          error: denied
            ? "Permissão negada."
            : "Não foi possível obter localização.",
          loading: false,
          permissionDenied: denied,
        });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, requestLocation, DEFAULT_LAT, DEFAULT_LNG };
}
