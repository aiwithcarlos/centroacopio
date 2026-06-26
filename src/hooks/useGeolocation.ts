'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Tu navegador no soporta geolocalización',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        let errorMsg = 'No se pudo obtener tu ubicación';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Permiso de ubicación denegado. Actívalo en tu dispositivo.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Tiempo agotado al obtener ubicación';
        }
        setState({
          latitude: null,
          longitude: null,
          error: errorMsg,
          loading: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return { ...state, requestLocation };
}
