'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  permissionStatus: PermissionState | 'unknown';
}

const STORAGE_KEY = 'geolocation-permission-asked';

function getInitialAskedState(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: false,
    permissionStatus: 'unknown',
  });
  const [hasAskedPermission, setHasAskedPermission] = useState<boolean>(() =>
    getInitialAskedState()
  );
  const hasAutoFetched = useRef(false);

  // Check current permission status
  useEffect(() => {
    if (!navigator.permissions) return;

    let mounted = true;

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result) => {
        if (!mounted) return;
        setState((prev) => ({ ...prev, permissionStatus: result.state }));

        result.onchange = () => {
          if (mounted) {
            setState((prev) => ({ ...prev, permissionStatus: result.state }));
          }
        };
      })
      .catch(() => {
        // Permissions API not supported
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: {
          code: 2,
          message: 'Geolocation is not supported',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState((prev) => ({
          ...prev,
          coordinates: position.coords,
          isLoading: false,
          permissionStatus: 'granted',
        }));
        localStorage.setItem(STORAGE_KEY, 'true');
        setHasAskedPermission(true);
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error,
          isLoading: false,
          permissionStatus: error.code === 1 ? 'denied' : prev.permissionStatus,
        }));
        localStorage.setItem(STORAGE_KEY, 'true');
        setHasAskedPermission(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  // Auto-fetch location if already granted (only once)
  useEffect(() => {
    if (
      state.permissionStatus === 'granted' &&
      !hasAutoFetched.current &&
      !state.coordinates
    ) {
      hasAutoFetched.current = true;
      // Use setTimeout to avoid cascading renders warning
      const timeoutId = setTimeout(() => {
        getCurrentPosition();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [state.permissionStatus, state.coordinates, getCurrentPosition]);

  const markAsAsked = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasAskedPermission(true);
  }, []);

  const shouldShowModal =
    !hasAskedPermission && state.permissionStatus !== 'granted';

  return {
    ...state,
    getCurrentPosition,
    markAsAsked,
    shouldShowModal,
    hasAskedPermission,
  };
}
