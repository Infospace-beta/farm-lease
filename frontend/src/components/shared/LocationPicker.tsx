"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon - only on client side
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
  locationName?: string;
  onLocationNameChange?: (name: string) => void;
}

/** Component to update map center when coordinates change externally */
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

/** Component to handle map clicks */
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  locationName,
  onLocationNameChange,
}: LocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<[number, number]>(() => {
    const lat = parseFloat(latitude) || -1.2921;
    const lng = parseFloat(longitude) || 36.8219;
    return [lat, lng];
  });

  const [error, setError] = useState<string | null>(null);
  const markerRef = useRef<L.Marker>(null);

  // Ensure component only renders map on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!onLocationNameChange) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const addr = data.address ?? {};
      const parts = [
        addr.suburb ?? addr.village ?? addr.town ?? addr.city ?? addr.municipality,
        addr.county ?? addr.state_district ?? addr.state,
      ].filter(Boolean);
      onLocationNameChange(parts.join(", ") || data.display_name || "");
    } catch {
      // fail silently
    }
  };

  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      onLocationChange(lat.toFixed(6), lng.toFixed(6));
      setPosition([lat, lng]);
      reverseGeocode(lat, lng);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    onLocationChange(lat.toFixed(6), lng.toFixed(6));
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onLocationChange(lat.toFixed(6), lng.toFixed(6));
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location access denied. Please enable location permissions."
            : "Unable to retrieve your location."
        );
      }
    );
  };

  const handleLatChange = (val: string) => {
    onLocationChange(val, longitude);
  };

  const handleLngChange = (val: string) => {
    onLocationChange(latitude, val);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            location_on
          </span>
          Location
        </h4>
      </div>

      <p className="text-xs text-slate-500">
        Pinpoint your land's location. This helps us suggest suitable crops.
      </p>

      {/* Map */}
      <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm h-64">
        {!isMounted ? (
          <div className="flex items-center justify-center h-full bg-slate-100">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              <p className="text-xs text-slate-500 mt-2">Loading map...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDragEnd,
              }}
              ref={markerRef}
            />
            <MapUpdater position={position} />
            <MapClickHandler onLocationSelect={handleMapClick} />
          </MapContainer>
        )}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md" style={{ zIndex: 1000 }}>
          <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">
              touch_app
            </span>
            Drag to adjust
          </p>
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="0.000001"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            value={latitude}
            onChange={(e) => handleLatChange(e.target.value)}
            placeholder="-1.2921"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="0.000001"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            value={longitude}
            onChange={(e) => handleLngChange(e.target.value)}
            placeholder="36.8219"
          />
        </div>
      </div>

      {/* Location Name */}
      {onLocationNameChange !== undefined && (
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Location Name
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            value={locationName ?? ""}
            onChange={(e) => onLocationNameChange(e.target.value)}
            placeholder="e.g. Naivasha Town, Nakuru County"
          />
          <p className="mt-1 text-xs text-slate-400">
            Auto-filled on pin drop. Shown to lessees as the plot location.
          </p>
        </div>
      )}

      {/* Use Current Location Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all"
      >
        <span className="material-symbols-outlined text-lg">my_location</span>
        Use Current Location
      </button>

      {/* Error & Info */}
      {error ? (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">
            error
          </span>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
          <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">
            lightbulb
          </span>
          <p className="text-xs text-amber-700">
            Ensure accurate coordinates. We use satellite data to analyze soil
            health and water retention automatically.
          </p>
        </div>
      )}
    </div>
  );
}
