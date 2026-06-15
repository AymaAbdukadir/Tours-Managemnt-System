import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const TourMap = ({ locations }) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    // Default center
    const defaultCenter = [34.111745, -118.113491];
    const validLocations = Array.isArray(locations)
        ? locations.filter(loc => loc.coordinates && loc.coordinates.length === 2)
        : [];

    const center = validLocations.length > 0
        ? [validLocations[0].coordinates[1], validLocations[0].coordinates[0]]
        : defaultCenter;

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map if not already initialized
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: center,
                zoom: 6,
                scrollWheelZoom: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        } else {
            // Update center if it changes
            mapRef.current.setView(center, 6);
        }

        // Clear existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current.removeLayer(layer);
            }
        });

        // Add fresh markers
        validLocations.forEach(loc => {
            L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: DefaultIcon })
                .addTo(mapRef.current)
                .bindPopup(`<span style="font-weight: bold; color: #10b981;">Day ${loc.day}: ${loc.description}</span>`);
        });

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                // We don't necessarily want to destroy it on every re-render, 
                // but let's be safe if the component actually unmounts.
            }
        };
    }, [center, validLocations]);

    // Handle full component unmount
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className="h-[400px] w-full rounded-3xl z-0 shadow-inner bg-gray-50 overflow-hidden"
        />
    );
};

export default TourMap;
