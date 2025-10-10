import React, { useEffect, useRef } from "react";

const GoogleMap = ({ trackingData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapInstanceRef.current && mapRef.current && window.google) {
        // Create route coordinates
        const routeCoords = trackingData.trackPoints.map((point) => ({
          lat: parseFloat(point.position.latitude),
          lng: parseFloat(point.position.longitude),
        }));

        // Initialize Google Map
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: routeCoords[0],
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        });

        // Create polyline for route
        const routePath = new window.google.maps.Polyline({
          path: routeCoords,
          geodesic: true,
          strokeColor: "#007bff",
          strokeOpacity: 1.0,
          strokeWeight: 4,
        });

        routePath.setMap(map);

        // Add start marker (green)
        new window.google.maps.Marker({
          position: routeCoords[0],
          map: map,
          title: "Start Point",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#28a745",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          },
        });

        // Add end marker (red)
        new window.google.maps.Marker({
          position: routeCoords[routeCoords.length - 1],
          map: map,
          title: "End Point",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#dc3545",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          },
        });

        // Fit map to route bounds
        const bounds = new window.google.maps.LatLngBounds();
        routeCoords.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds);

        mapInstanceRef.current = map;
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [trackingData]);

  return (
    <div
      ref={mapRef}
      style={{ height: "500px", width: "100%" }}
    ></div>
  );
};

export default GoogleMap;