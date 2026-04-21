import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

import type { LatLng } from '@/services/guidebooks/types';

export type LocationStatus = 'undetermined' | 'denied' | 'granted';

interface UseUserLocationResult {
  locationStatus: LocationStatus;
  coords: LatLng | null;
  requestPermission: () => Promise<void>;
}

export function useUserLocation(): UseUserLocationResult {
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>('undetermined');
  const [coords, setCoords] = useState<LatLng | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    // Check existing permission on mount without prompting
    Location.getForegroundPermissionsAsync()
      .then((result) => {
        if (result.status === 'granted') {
          setLocationStatus('granted');
          startTracking();
        } else if (result.status === 'denied') {
          setLocationStatus('denied');
        }
        // 'undetermined' — leave as default, wait for explicit request
      })
      .catch(() => {
        // expo-location unavailable (e.g. web) — stay undetermined
      });

    return () => {
      subscriptionRef.current?.remove();
    };
  }, []);

  const startTracking = async () => {
    const subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced },
      (location) => {
        setCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      },
    );
    subscriptionRef.current?.remove(); // clean up any previous
    subscriptionRef.current = subscription;
  };

  const requestPermission = async () => {
    const result = await Location.requestForegroundPermissionsAsync();
    if (result.status === 'granted') {
      setLocationStatus('granted');
      await startTracking();
    } else {
      setLocationStatus('denied');
    }
  };

  return { locationStatus, coords, requestPermission };
}
