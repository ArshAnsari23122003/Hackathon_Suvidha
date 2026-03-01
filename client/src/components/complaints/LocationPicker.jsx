// it shows where is the nearest complaint box and also shows the location of the user
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";  
import L from "leaflet";

// Custom icon for complaint boxes
const complaintBoxIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

const LocationPicker = () => {
    const [userLocation, setUserLocation] = useState(null);

    // Sample complaint box locations
    const complaintBoxes = [
        { id: 1, name: "Complaint Box 1", position: [28.7041, 77.1025] }, // Delhi
        { id: 2, name: "Complaint Box 2", position: [19.0760, 72.8777] }, // Mumbai
        { id: 3, name: "Complaint Box 3", position: [12.9716, 77.5946] }, // Bangalore
    ];

    // Get user's current location
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Select Your Location</h1>
            <button
                onClick={handleGetLocation}
                className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Get My Location
            </button>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                />
                {complaintBoxes.map((box) => (
                    <Marker key={box.id} position={box.position} icon={complaintBoxIcon}>
                        <Popup>{box.name}</Popup>
                    </Marker>
                ))}
                {userLocation && (
                    <Marker position={userLocation} icon={L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",   
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30],
                    })}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LocationPicker;