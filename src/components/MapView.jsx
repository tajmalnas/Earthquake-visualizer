import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import EarthquakePopup from './EarthquakePopup';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (magnitude) => {
  const size = Math.max(20, magnitude * 8);
  const color = magnitude >= 5 ? '#dc2626' : magnitude >= 3 ? '#ea580c' : '#16a34a';
  
  return L.divIcon({
    className: 'custom-earthquake-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(10, size / 3)}px;
      ">${magnitude.toFixed(1)}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const MapView = ({ earthquakes }) => {
  const center = [20, 0];
  const zoom = 2;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {earthquakes.map((earthquake) => {
        const [longitude, latitude, depth] = earthquake.geometry.coordinates;
        const magnitude = earthquake.properties.mag;
        
        return (
          <Marker
            key={earthquake.id}
            position={[latitude, longitude]}
            icon={createCustomIcon(magnitude)}
          >
            <Popup maxWidth={300} minWidth={250}>
              <EarthquakePopup earthquake={earthquake} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;