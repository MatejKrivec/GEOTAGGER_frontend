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

  //Baje se ta api key restricta na google konzoli kjer ga lahko potem uporablja samo ena domena
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCgJ8LbG1xEChvwgnIIt4dQmBEzaW2nqsY',
    libraries
  });

  const [, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(center);

  //console.log("The map "+map)

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
