import React, { useEffect, useRef } from 'react';

const GPSMapView = ({ gpsData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!gpsData?.trackPoints?.length) return;

    const loadGoogleMaps = async () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places';
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      initMap();
    };

    const initMap = () => {
      const trackPoints = gpsData.trackPoints;
      const startPoint = trackPoints[0];

      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: parseFloat(startPoint.position.latitude),
          lng: parseFloat(startPoint.position.longitude)
        },
        zoom: 14,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      });

      mapInstanceRef.current = map;

      const coordinates = trackPoints.map(point => ({
        lat: parseFloat(point.position.latitude),
        lng: parseFloat(point.position.longitude)
      }));

      const polyline = new window.google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: '#003465',
        strokeOpacity: 0.8,
        strokeWeight: 4
      });

      polyline.setMap(map);

      new window.google.maps.Marker({
        position: coordinates[0],
        map: map,
        title: 'Start',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#00ff00',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
          scale: 8
        }
      });

      new window.google.maps.Marker({
        position: coordinates[coordinates.length - 1],
        map: map,
        title: 'End',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#ff0000',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
          scale: 8
        }
      });

      const bounds = new window.google.maps.LatLngBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds);
    };

    loadGoogleMaps();

    return () => {
      mapInstanceRef.current = null;
    };
  }, [gpsData]);

  if (!gpsData?.trackPoints?.length) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded">
        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>No GPS data available</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-100 h-100" />;
};

export default GPSMapView;