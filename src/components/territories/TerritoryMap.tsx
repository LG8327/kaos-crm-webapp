'use client';

// src/components/territories/TerritoryMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Debug: Log the token being used (safely)
console.log('🗺️ Mapbox token configured:', mapboxgl.accessToken ? 'Yes ✅' : 'No ❌');
if (mapboxgl.accessToken) {
  console.log('🗺️ Token type:', mapboxgl.accessToken.startsWith('pk.') ? 'Public token' : 'Secret token');
  console.log('🗺️ Token preview:', mapboxgl.accessToken.substring(0, 15) + '...');
}

interface Territory {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  assigned_to_id?: string;
  boundaries?: {
    type: string;
    coordinates: number[][][];
  };
  center_lat?: number;
  center_lng?: number;
  zoom_level?: number;
  assigned_user?: {
    name: string;
    email: string;
  };
  lead_count?: number;
  hot_leads?: number;
  total_value?: number;
}

interface TerritoryMapProps {
  territories: Territory[];
  selectedTerritory?: Territory | null;
  onTerritorySelect: (territory: Territory) => void;
}

export const TerritoryMap: React.FC<TerritoryMapProps> = ({
  territories,
  selectedTerritory,
  onTerritorySelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Houston, TX default center
  const [center] = useState<[number, number]>([-95.3698, 29.7604]);
  const [zoom] = useState(10);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if Mapbox token is set
    if (!mapboxgl.accessToken || mapboxgl.accessToken === '') {
      setMapError('Mapbox token not configured properly. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file.');
      return;
    }

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark theme to match our UI
        center: center,
        zoom: zoom,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        console.log('✅ Mapbox map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      });

      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
        setMapError(`Map loading error: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (error) {
      console.error('❌ Failed to initialize Mapbox:', error);
      setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing sources and layers
    territories.forEach((territory, index) => {
      const sourceId = `territory-${territory.id}`;
      const layerId = `territory-layer-${territory.id}`;
      const labelLayerId = `territory-label-${territory.id}`;

      if (map.current!.getSource(sourceId)) {
        if (map.current!.getLayer(labelLayerId)) {
          map.current!.removeLayer(labelLayerId);
        }
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
        map.current!.removeSource(sourceId);
      }
    });

    // Add territory data to map
    territories.forEach((territory) => {
      if (!territory.boundaries && (!territory.center_lat || !territory.center_lng)) {
        return; // Skip territories without geographic data
      }

      const sourceId = `territory-${territory.id}`;
      const layerId = `territory-layer-${territory.id}`;
      const labelLayerId = `territory-label-${territory.id}`;

      if (territory.boundaries) {
        // Add territory polygon
        const geoJsonData = {
          type: 'Feature' as const,
          properties: {
            id: territory.id,
            name: territory.name,
            color: territory.color,
            lead_count: territory.lead_count || 0,
            total_value: territory.total_value || 0,
            assigned_user: territory.assigned_user?.name || 'Unassigned'
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: territory.boundaries?.coordinates || []
          }
        };

        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData
        });

        // Add fill layer
        map.current!.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          layout: {},
          paint: {
            'fill-color': territory.color,
            'fill-opacity': 0.3
          }
        });

        // Add stroke layer
        map.current!.addLayer({
          id: `${layerId}-stroke`,
          type: 'line',
          source: sourceId,
          layout: {},
          paint: {
            'line-color': territory.color,
            'line-width': 2
          }
        });

        // Add click handler
        map.current!.on('click', layerId, () => {
          onTerritorySelect(territory);
        });

        // Change cursor on hover
        map.current!.on('mouseenter', layerId, () => {
          map.current!.getCanvas().style.cursor = 'pointer';
        });

        map.current!.on('mouseleave', layerId, () => {
          map.current!.getCanvas().style.cursor = '';
        });

      } else if (territory.center_lat && territory.center_lng) {
        // Add territory marker for territories without boundaries
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          className: 'territory-popup'
        }).setHTML(`
          <div class="bg-gray-900 text-white p-3 rounded-lg border border-gray-700">
            <h4 class="font-semibold text-lg mb-2">${territory.name}</h4>
            ${territory.description ? `<p class="text-sm text-gray-300 mb-2">${territory.description}</p>` : ''}
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Assigned:</span>
                <span>${territory.assigned_user?.name || 'Unassigned'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Leads:</span>
                <span>${territory.lead_count || 0}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Value:</span>
                <span>$${(territory.total_value || 0).toLocaleString()}</span>
              </div>
            </div>
            <button class="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors w-full" onclick="window.selectTerritory('${territory.id}')">
              View Details
            </button>
          </div>
        `);

        // Create custom marker
        const markerElement = document.createElement('div');
        markerElement.className = 'territory-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: ${territory.color};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        markerElement.innerHTML = `<span style="color: white; font-weight: bold; font-size: 12px;">${territory.lead_count || 0}</span>`;

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([territory.center_lng, territory.center_lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click handler to marker
        markerElement.addEventListener('click', () => {
          onTerritorySelect(territory);
        });
      }
    });

    // Add global function for popup buttons
    (window as any).selectTerritory = (territoryId: string) => {
      const territory = territories.find(t => t.id === territoryId);
      if (territory) {
        onTerritorySelect(territory);
      }
    };

  }, [territories, mapLoaded, onTerritorySelect]);

  // Sample territories for Houston if no data
  useEffect(() => {
    if (!map.current || !mapLoaded || territories.length > 0) return;

    // Add sample territories for demonstration
    const sampleTerritories = [
      {
        center: [-95.3698, 29.7604],
        color: '#9333EA',
        name: 'Downtown Houston',
        leads: 15
      },
      {
        center: [-95.4598, 29.7404],
        color: '#EF4444',
        name: 'Uptown Houston', 
        leads: 8
      },
      {
        center: [-95.2798, 29.7804],
        color: '#10B981',
        name: 'East Houston',
        leads: 12
      }
    ];

    sampleTerritories.forEach((territory, index) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'sample-territory-marker';
      markerElement.style.cssText = `
        width: 25px;
        height: 25px;
        background-color: ${territory.color};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        opacity: 0.7;
      `;
      markerElement.innerHTML = `<span style="color: white; font-weight: bold; font-size: 10px;">${territory.leads}</span>`;

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="bg-gray-900 text-white p-2 rounded border border-gray-700">
          <h4 class="font-semibold">${territory.name}</h4>
          <p class="text-sm text-gray-300">${territory.leads} leads</p>
          <p class="text-xs text-purple-400">Sample territory</p>
        </div>
      `);

      new mapboxgl.Marker(markerElement)
        .setLngLat(territory.center as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [territories, mapLoaded]);

  // Focus on selected territory
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedTerritory) return;

    console.log('🎯 Focusing on selected territory:', selectedTerritory.name);

    // Focus on territory center if available
    if (selectedTerritory.center_lat && selectedTerritory.center_lng) {
      map.current.flyTo({
        center: [selectedTerritory.center_lng, selectedTerritory.center_lat],
        zoom: selectedTerritory.zoom_level || 12,
        duration: 1500
      });
    } else if (selectedTerritory.boundaries?.coordinates) {
      // Fit bounds to territory boundaries
      const coordinates = selectedTerritory.boundaries.coordinates[0];
      const bounds = new mapboxgl.LngLatBounds();
      
      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
      
      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1500
      });
    }

    // Highlight the selected territory (optional visual enhancement)
    const layerId = `territory-layer-${selectedTerritory.id}`;
    if (map.current.getLayer(layerId)) {
      // Temporarily highlight the territory
      map.current.setPaintProperty(layerId, 'fill-opacity', 0.6);
      
      // Reset opacity after 2 seconds
      setTimeout(() => {
        if (map.current && map.current.getLayer(layerId)) {
          map.current.setPaintProperty(layerId, 'fill-opacity', 0.3);
        }
      }, 2000);
    }
  }, [selectedTerritory, mapLoaded]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-purple-500" />
          Territory Map View
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Click on territories to view details • Powered by Mapbox
        </p>
      </div>
      
      <div className="relative">
        <div
          ref={mapContainer}
          className="h-96 lg:h-[600px] w-full"
          style={{ position: 'relative' }}
        />
        
        {/* Map Legend */}
        {territories.length > 0 && (
          <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 z-[1000] max-w-48">
            <h4 className="text-white font-semibold mb-2 text-sm">Legend</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {territories.slice(0, 8).map(territory => (
                <div key={territory.id} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: territory.color }}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <span className="text-white text-xs truncate block">
                      {territory.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {territory.lead_count || 0} leads
                    </span>
                  </div>
                </div>
              ))}
              {territories.length > 8 && (
                <div className="text-gray-400 text-xs pt-1 border-t border-gray-700">
                  +{territories.length - 8} more territories
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Map Controls Info */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700 z-[1000]">
          <div className="flex items-center space-x-4 text-white text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{territories.length} Territories</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{territories.filter(t => t.is_active).length} Active</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{territories.reduce((sum, t) => sum + (t.lead_count || 0), 0)} Total Leads</span>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-white text-sm">Loading map...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {mapError && (
          <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-[1000]">
            <div className="text-center max-w-md mx-4">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-white font-semibold mb-2">Map Loading Error</h3>
                <p className="text-gray-300 text-sm mb-4">{mapError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
