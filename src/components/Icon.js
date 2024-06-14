import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Bicycle from '../Resources/Images/Bicycle.png';
import Drone from '../Resources/Images/Drone.png';
import Van from '../Resources/Images/Van.png';

const Icon = ({ address, hub, weight }) => {
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

      const getIconBasedOnWeight = (weight) => {
        let iconUrl;
        if (weight === 'Bicycle') {
          iconUrl = Bicycle;
        } else if (weight === 'Van') {
          iconUrl = Van;
        } else if (weight === 'Drone') {
          iconUrl = Drone;
        }
        return L.icon({
          iconUrl,
          iconSize: [30, 30], // Adjust icon size as needed
          className: ''
        });
      };
    

      const updateMap = async () => {
        try {
          const addressCoords = await getCoordinates(address);
          const hubCoords = await getCoordinates(hub);

          map.setView([addressCoords.lat, addressCoords.lon], 12);

          const addressMarkerIcon = getIconBasedOnWeight(weight);
          const addressMarker = L.marker([addressCoords.lat, addressCoords.lon], { icon: addressMarkerIcon })
            .addTo(map)
            .bindPopup(address)
            .openPopup();

          const hubMarkerIcon = getIconBasedOnWeight(weight);
          const hubMarker = L.marker([hubCoords.lat, hubCoords.lon], { icon: hubMarkerIcon })
            .addTo(map)
            .bindPopup(hub)
            .openPopup();

          const latlngs = [
            [addressCoords.lat, addressCoords.lon],
            [hubCoords.lat, hubCoords.lon]
          ];
          const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);

          map.fitBounds(polyline.getBounds());
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };

      updateMap();
    }
  }, [map, address, hub, weight]);


  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default Icon;
