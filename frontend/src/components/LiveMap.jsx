import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LiveMap = () => {
    const [position, setPosition] = useState([30.3165, 78.0322]); // Default: Dehradun

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (location) => {
                    setPosition([location.coords.latitude, location.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
        }
    }, []);

    return (
        <div style={{ width: "100%", height: "100vh", position: "absolute", right: 0 }}>
            <MapContainer center={position} zoom={13} style={{ width: "100%", height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                    <Popup>You are here!</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LiveMap;
