import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

// Default: Vila Esperança center
const DEFAULT_LAT = -23.525;
const DEFAULT_LNG = -46.555;

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
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
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
        const permissionDenied = err.code === err.PERMISSION_DENIED;
        setState({
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
          error: permissionDenied
            ? "Permissão negada. Usando localização padrão."
            : "Não foi possível obter localização.",
          loading: false,
          permissionDenied,
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
