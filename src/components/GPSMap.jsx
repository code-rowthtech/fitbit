import React, { useEffect, useRef } from "react";

const GPSMap = ({ trackData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!trackData?.trackPoints?.length || !window.google) return;

    const initMap = () => {
      const trackPoints = trackData.trackPoints;
      const startPoint = trackPoints[0];
      const endPoint = trackPoints[trackPoints.length - 1];

      // Create map centered on start point
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: {
          lat: parseFloat(startPoint.position.latitude),
          lng: parseFloat(startPoint.position.longitude),
        },
        mapTypeId: "roadmap",
      });

      mapInstanceRef.current = map;

      // Convert track points to coordinates
      const path = trackPoints.map((point) => ({
        lat: parseFloat(point.position.latitude),
        lng: parseFloat(point.position.longitude),
      }));

      // Create polyline for the route
      const routePath = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#003465",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });

      routePath.setMap(map);

      // Add start marker
      new window.google.maps.Marker({
        position: path[0],
        map: map,
        title: "Start",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#00ff00" stroke="#fff" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20),
        },
      });

      // Add end marker
      new window.google.maps.Marker({
        position: path[path.length - 1],
        map: map,
        title: "End",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#ff0000" stroke="#fff" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20),
        },
      });

      // Fit map to show entire route
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((point) => bounds.extend(point));
      map.fitBounds(bounds);
    };

    if (window.google?.maps) {
      initMap();
    } else {
      // Load Google Maps API
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
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

  const totalDistance =
    trackData.trackPoints[trackData.trackPoints.length - 1]?.distance || 0;
  const duration =
    trackData.trackPoints.length > 1
      ? new Date(trackData.trackPoints[trackData.trackPoints.length - 1].time) -
        new Date(trackData.trackPoints[0].time)
      : 0;

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Activity Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Sport:</span>
            <p className="font-medium">{trackData.sport}</p>
          </div>
          <div>
            <span className="text-gray-600">Distance:</span>
            <p className="font-medium">
              {(parseFloat(totalDistance) / 1000).toFixed(2)} km
            </p>
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
      </div>
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border border-gray-300"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
};

export default GPSMap;
