'use client';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import { Progress } from '@/features/shared/components/ui';

export default function ExplorePage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    mapboxgl.accessToken = process.env
      .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    // Simulate progress while map loads
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
      center: {
        lat: -0.570617,
        lon: 117.097182,
      },
      zoom: 12,
    });

    mapRef.current.on('load', () => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setIsLoading(false), 300);
    });

    return () => {
      clearInterval(progressInterval);
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-screen relative">
      <div id="map-container" ref={mapContainerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
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
