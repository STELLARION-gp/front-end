import { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '300px',
};

const defaultCenter = {
    lat: 7.8731, // Sri Lanka center
    lng: 80.7718,
};

type LatLng = {
    lat: number;
    lng: number;
};

type LocationPickerProps = {
    value?: LatLng | null;
    onChange: (value: LatLng) => void;
    apiKey: string;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, apiKey }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });
    const mapRef = useRef<google.maps.Map | null>(null);

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
    }, [onChange]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={value || defaultCenter}
            zoom={value ? 12 : 7}
            onClick={handleMapClick}
            onLoad={(map) => { mapRef.current = map; }}
        >
            {value && <Marker position={value} />}
        </GoogleMap>
    ) : (
        <div>Loading map...</div>
    );
};

export default LocationPicker;
