'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import { Progress } from '@/features/shared/components/ui';
import { dummyBmcs } from '@/features/shared/constants/dummy-bmc';

export function ExploreMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const animationRef = useRef<number | null>(null);
  const isRotatingRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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

      dummyBmcs.forEach((bmc) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([bmc.coordinates.lon, bmc.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${bmc.items.find((i) => i.tag === 'value_propositions')?.content[0] || 'Business'}</strong>`
            )
          )
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });

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
