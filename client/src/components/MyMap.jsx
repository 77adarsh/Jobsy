import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to update the map view when props change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}


const MyMap = ({ latitude, longitude, zoom = 13 }) => {
  // Ensure coordinates are valid numbers
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        Invalid coordinates for map display.
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <div className="h-80 w-full"> {/* Added div with fixed height for the map */}
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
        <ChangeView center={position} zoom={zoom} /> {/* Updates map view on prop change */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Your Current Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MyMap;