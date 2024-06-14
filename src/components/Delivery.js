import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Delivery = ({ address, hub }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize map
    mapRef.current = L.map('map', {
      center: [0, 0], // Initial center
      zoom: 2, // Initial zoom level
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    setMap(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (map) {
      // Function to get coordinates from an address using Nominatim API
      const getCoordinates = async (location) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          return { lat: parseFloat(lat), lon: parseFloat(lon) };
        } else {
          throw new Error('Address not found');
        }
      };

      // Fetch coordinates and update map
      const updateMap = async () => {
        try {
          const addressCoords = await getCoordinates(address);
          const hubCoords = await getCoordinates(hub);

          map.setView([addressCoords.lat, addressCoords.lon], 12);

          // Add marker for address
          const addressMarker = L.marker([addressCoords.lat, addressCoords.lon])
            .addTo(map)
            .bindPopup(address)
            .openPopup();

          // Add marker for hub
          const hubMarker = L.marker([hubCoords.lat, hubCoords.lon])
            .addTo(map)
            .bindPopup(hub)
            .openPopup();

          // Draw a line between the address and hub
          const latlngs = [
            [addressCoords.lat, addressCoords.lon],
            [hubCoords.lat, hubCoords.lon]
          ];
          const polyline = L.polyline(latlngs, { color: 'green' }).addTo(map);

          // Adjust map view to fit both markers
          map.fitBounds(polyline.getBounds());
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };

      updateMap();
    }
  }, [map, address, hub]);

  

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default Delivery;
