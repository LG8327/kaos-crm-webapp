'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export const MapTest = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('🗺️ Initializing map test...');
    console.log('🗺️ Token:', mapboxgl.accessToken ? 'Set ✅' : 'Not Set ❌');

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40],
        zoom: 9
      });

      map.on('load', () => {
        console.log('✅ Test map loaded successfully!');
      });

      map.on('error', (e) => {
        console.error('❌ Test map error:', e);
      });

      return () => map.remove();
    } catch (error) {
      console.error('❌ Test map init error:', error);
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-white text-xl mb-4">Mapbox Test</h2>
      <div 
        ref={mapContainer} 
        className="w-full h-96 border border-gray-700 rounded-lg"
      />
    </div>
  );
};
