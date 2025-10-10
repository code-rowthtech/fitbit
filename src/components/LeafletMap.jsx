import React, { useEffect, useRef } from 'react';

const LeafletMap = ({ trackData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!trackData?.trackPoints?.length) return;

    const loadLeaflet = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      initMap();
    };

    const initMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const trackPoints = trackData.trackPoints;
      const startPoint = trackPoints[0];

      // Create map
      const map = window.L.map(mapRef.current).setView([
        parseFloat(startPoint.position.latitude),
        parseFloat(startPoint.position.longitude)
      ], 15);

      mapInstanceRef.current = map;

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Convert track points to coordinates
      const coordinates = trackPoints.map(point => [
        parseFloat(point.position.latitude),
        parseFloat(point.position.longitude)
      ]);

      // Create polyline for the route
      const polyline = window.L.polyline(coordinates, {
        color: '#003465',
        weight: 4,
        opacity: 0.8
      }).addTo(map);

      // Add start marker (green)
      window.L.circleMarker(coordinates[0], {
        color: '#fff',
        fillColor: '#00ff00',
        fillOpacity: 1,
        radius: 8,
        weight: 2
      }).addTo(map).bindPopup('Start');

      // Add end marker (red)
      window.L.circleMarker(coordinates[coordinates.length - 1], {
        color: '#fff',
        fillColor: '#ff0000',
        fillOpacity: 1,
        radius: 8,
        weight: 2
      }).addTo(map).bindPopup('End');

      // Fit map to show entire route
      map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trackData]);

  if (!trackData?.trackPoints?.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No GPS data available</p>
      </div>
    );
  }

  const totalDistance = trackData.trackPoints[trackData.trackPoints.length - 1]?.distance || 0;
  const startTime = new Date(trackData.trackPoints[0].time);
  const endTime = new Date(trackData.trackPoints[trackData.trackPoints.length - 1].time);
  const duration = endTime - startTime;

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Activity Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Sport:</span>
            <p className="font-medium">{trackData.sport}</p>
          </div>
          <div>
            <span className="text-gray-600">Distance:</span>
            <p className="font-medium">{(parseFloat(totalDistance) / 1000).toFixed(2)} km</p>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <p className="font-medium">{Math.round(duration / 60000)} min</p>
          </div>
          <div>
            <span className="text-gray-600">Points:</span>
            <p className="font-medium">{trackData.trackPoints.length}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Started: {startTime.toLocaleString()}
        </div>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default LeafletMap;