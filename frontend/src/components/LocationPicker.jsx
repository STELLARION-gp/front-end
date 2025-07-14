import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '300px',
};

const defaultCenter = {
    lat: 7.8731, // Sri Lanka center
    lng: 80.7718,
};

const LocationPicker = ({ value, onChange, apiKey }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });
    const mapRef = useRef(null);

    const handleMapClick = useCallback((e) => {
        onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }, [onChange]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={value || defaultCenter}
            zoom={value ? 12 : 7}
            onClick={handleMapClick}
            onLoad={map => (mapRef.current = map)}
        >
            {value && <Marker position={value} />}
        </GoogleMap>
    ) : (
        <div>Loading map...</div>
    );
};

export default LocationPicker;
