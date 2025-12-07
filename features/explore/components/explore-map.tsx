'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import { Progress } from '@/features/shared/components/ui';
import { createBmcPopupHTML } from './bmc-marker-popup';
import { useSelectedBmc } from '../hooks/use-selected-bmc';
import { usePublicBmcs } from '../hooks/use-public-bmcs';

export function ExploreMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const animationRef = useRef<number | null>(null);
  const isRotatingRef = useRef(true);
  const currentOpenPopupRef = useRef<mapboxgl.Popup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { selectedBmcId, setSelectedBmcId } = useSelectedBmc();
  const { bmcs, isLoading: isBmcsLoading } = usePublicBmcs();

  useEffect(() => {
    mapboxgl.accessToken = process.env
      .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: { lat: -2.5, lon: 118.0 },
      zoom: 3,
      projection: 'globe',
    });

    let startTime: number | null = null;
    const initialLon = 118.0;

    const rotateCamera = (timestamp: number) => {
      if (!mapRef.current || !isRotatingRef.current) return;
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const newLon = initialLon + ((elapsed / 1000) % 360);

      mapRef.current.setCenter([newLon, -2.5]);
      animationRef.current = requestAnimationFrame(rotateCamera);
    };

    const stopRotation = () => {
      isRotatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    mapRef.current.on('load', () => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setIsLoading(false), 300);

      animationRef.current = requestAnimationFrame(rotateCamera);
    });

    mapRef.current.on('click', stopRotation);
    mapRef.current.on('dragstart', stopRotation);

    const markers = markersRef.current;

    return () => {
      clearInterval(progressInterval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      markers.forEach((marker) => marker.remove());
      mapRef.current?.remove();
    };
  }, []);

  // Add markers when BMC data is loaded
  useEffect(() => {
    if (!mapRef.current || isBmcsLoading || bmcs.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Filter BMCs with valid location
    const bmcsWithLocation = bmcs.filter(
      (bmc) => bmc.location && bmc.location.latitude && bmc.location.longitude
    );

    bmcsWithLocation.forEach((bmc, index) => {
      if (!bmc.location) return;

      // Create custom marker element with avatar
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.overflow = 'hidden';
      el.style.backgroundColor = '#e5e7eb';

      // Create avatar image with random seed
      const img = document.createElement('img');
      const randomSeed = `${bmc.id || index}`;
      img.src = `https://api.dicebear.com/9.x/open-peeps/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${encodeURIComponent(randomSeed)}`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.alt = 'Avatar';
      el.appendChild(img);

      const popupHTML = createBmcPopupHTML({
        bmc,
        avatarSeed: randomSeed,
      });

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '340px',
        className: 'bmc-popup',
      }).setHTML(popupHTML);

      // Update URL when marker is clicked
      el.addEventListener('click', () => {
        // Close currently open popup before opening new one
        if (
          currentOpenPopupRef.current &&
          currentOpenPopupRef.current !== popup
        ) {
          currentOpenPopupRef.current.remove();
        }
        currentOpenPopupRef.current = popup;
        setSelectedBmcId(bmc.id);
      });

      // Track when popup opens
      popup.on('open', () => {
        currentOpenPopupRef.current = popup;
      });

      // Clear selection when popup is closed
      popup.on('close', () => {
        if (currentOpenPopupRef.current === popup) {
          currentOpenPopupRef.current = null;
        }
        setSelectedBmcId(null);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([bmc.location.longitude, bmc.location.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.set(bmc.id, marker);
    });
  }, [bmcs, isBmcsLoading, setSelectedBmcId]);

  // Open popup when selectedBmcId changes (e.g., from timeline click)
  useEffect(() => {
    if (!selectedBmcId || !mapRef.current) return;

    const marker = markersRef.current.get(selectedBmcId);
    if (!marker) return;

    const popup = marker.getPopup();

    // Close currently open popup before opening new one
    if (currentOpenPopupRef.current && currentOpenPopupRef.current !== popup) {
      currentOpenPopupRef.current.remove();
    }

    // Stop rotation and fly to marker
    isRotatingRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const lngLat = marker.getLngLat();
    mapRef.current.flyTo({
      center: [lngLat.lng, lngLat.lat],
      zoom: 5,
      duration: 1500,
    });

    // Open popup after fly animation
    setTimeout(() => {
      const markerPopup = marker.getPopup();
      if (markerPopup && !markerPopup.isOpen()) {
        marker.togglePopup();
      }
    }, 1600);
  }, [selectedBmcId]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 z-100 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg">
            <div className="text-lg font-medium text-foreground">
              Map sedang disiapkan...
            </div>
            <Progress value={progress} className="w-64" />
            <div className="text-sm text-muted-foreground">{progress}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
