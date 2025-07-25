'use client';

// src/components/territories/TerritoryBoundaryDrawer.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV4YW1wbGUifQ.example_token';

interface TerritoryBoundaryDrawerProps {
  onBoundaryComplete: (boundary: any) => void;
  existingBoundary?: any;
  center?: [number, number];
}

export const TerritoryBoundaryDrawer: React.FC<TerritoryBoundaryDrawerProps> = ({
  onBoundaryComplete,
  existingBoundary,
  center = [-95.3698, 29.7604]
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: 12
    });

    // Initialize draw controls
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon',
      styles: [
        // Custom styles for drawing
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#9333EA',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#9333EA',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#9333EA',
            'fill-opacity': 0.5
          }
        },
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#9333EA',
            'line-width': 3
          }
        }
      ]
    });

    map.current.addControl(draw.current);

    // Add existing boundary if provided
    if (existingBoundary) {
      draw.current.add(existingBoundary);
    }

    // Event handlers
    map.current.on('draw.create', (e: any) => {
      setIsDrawing(false);
      onBoundaryComplete(e.features[0]);
    });

    map.current.on('draw.update', (e: any) => {
      onBoundaryComplete(e.features[0]);
    });

    map.current.on('draw.modechange', (e: any) => {
      setIsDrawing(e.mode === 'draw_polygon');
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [center, existingBoundary, onBoundaryComplete]);

  const clearDrawing = () => {
    if (draw.current) {
      draw.current.deleteAll();
    }
  };

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="h-96 w-full rounded-lg overflow-hidden"
      />
      
      {/* Drawing Instructions */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700 z-[1000]">
        <h4 className="text-white font-semibold text-sm mb-2">Draw Territory Boundary</h4>
        <div className="text-xs text-gray-300 space-y-1">
          <p>• Click to start drawing a polygon</p>
          <p>• Click each point to create boundary</p>
          <p>• Double-click or press Enter to finish</p>
          <p>• Use trash icon to delete</p>
        </div>
        {isDrawing && (
          <div className="mt-2 text-xs text-purple-400 font-medium">
            Drawing in progress...
          </div>
        )}
      </div>

      {/* Clear Button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={clearDrawing}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
