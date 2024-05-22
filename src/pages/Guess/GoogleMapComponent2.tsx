import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Libraries  } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const GoogleMapComponent = ({ onLocationSelect }: { onLocationSelect: (address: string, location: any) => void }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCdwFcRukCF5DwPyaa15dXxX-Ls3Tq55Lo',
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(center);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();

    if (lat !== undefined && lng !== undefined) {
      setMarkerPosition({ lat, lng });

      // Geocoding the clicked location
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          onLocationSelect(results[0].formatted_address, { lat, lng });
        }
      });
    }
  }, [onLocationSelect]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={onMapClick}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  ) : null;
};

export default React.memo(GoogleMapComponent);
