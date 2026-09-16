"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation, Sun, ZoomIn, ZoomOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LocationCoords {
  lat: number;
  lng: number;
  solarIrradiance?: number;
}

export const CITY_COORDINATES: Record<string, LocationCoords> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946, solarIrradiance: 5.3 },
  Mumbai: { lat: 19.0760, lng: 72.8777, solarIrradiance: 5.1 },
  Delhi: { lat: 28.6139, lng: 77.2090, solarIrradiance: 5.2 },
  Chennai: { lat: 13.0827, lng: 80.2707, solarIrradiance: 5.4 },
  Hyderabad: { lat: 17.3850, lng: 78.4867, solarIrradiance: 5.3 },
  Pune: { lat: 18.5204, lng: 73.8567, solarIrradiance: 5.3 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, solarIrradiance: 5.6 },
  Kochi: { lat: 9.9312, lng: 76.2673, solarIrradiance: 4.9 },
  Jaipur: { lat: 26.9124, lng: 75.7873, solarIrradiance: 5.5 },
  Kolkata: { lat: 22.5726, lng: 88.3639, solarIrradiance: 4.8 },
};

interface GoogleMapLocationProps {
  city: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export function GoogleMapLocation({
  city,
  state = "India",
  latitude,
  longitude,
}: GoogleMapLocationProps) {
  const coords =
    latitude !== undefined && longitude !== undefined
      ? { lat: latitude, lng: longitude, solarIrradiance: 5.2 }
      : CITY_COORDINATES[city] ?? { lat: 12.9716, lng: 77.5946, solarIrradiance: 5.3 };

  const [zoomLevel, setZoomLevel] = useState(0.06);

  // Check for Google Maps API Key via Next.js or Vite environment variable
  const googleMapsKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    (typeof process !== "undefined" && process.env?.VITE_GOOGLE_MAPS_API_KEY) ||
    "";

  // Reset zoom on city change
  useEffect(() => {
    setZoomLevel(0.06);
  }, [city]);

  const handleZoomIn = () => setZoomLevel((z) => Math.max(0.015, z * 0.65));
  const handleZoomOut = () => setZoomLevel((z) => Math.min(0.25, z * 1.5));

  const bbox = `${coords.lng - zoomLevel * 1.3},${coords.lat - zoomLevel},${
    coords.lng + zoomLevel * 1.3
  },${coords.lat + zoomLevel}`;

  const mapUrl = googleMapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodeURIComponent(
        `${city}, ${state}`
      )}&zoom=13`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
        bbox
      )}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${city}, ${state}`
  )}`;

  return (
    <div className="relative flex h-full min-h-[26rem] w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      {/* Top Location Information Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line/80 bg-surface/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <MapPin className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="font-display text-sm font-extrabold text-foreground">
              {city}, {state}
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground">
              {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary">
            <Sun className="h-3.5 w-3.5 text-solar" />
            <span>{coords.solarIrradiance} kWh/m²/day</span>
          </div>
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Open in Google Maps"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Map Display (Real map via Google Maps if key configured, or interactive OSM tile map) */}
      <div className="relative flex-1 w-full bg-secondary/30">
        <iframe
          title={`Map of ${city}`}
          src={mapUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />

        {/* Map Marker overlay when using fallback */}
        {!googleMapsKey && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <div className="relative flex flex-col items-center">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-action">
                <MapPin className="h-5 w-5 text-white" />
              </span>
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-ping mt-1" />
            </div>
          </div>
        )}

        {/* Zoom & Navigation Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 rounded-xl border border-line bg-surface/90 p-1 shadow-soft backdrop-blur-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8 rounded-lg"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8 rounded-lg"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Satellite/Meteorological Calibration Badge */}
        <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-line bg-surface/90 px-3 py-2 shadow-soft backdrop-blur-md">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
            <Navigation className="h-3.5 w-3.5 text-fresh" />
            Solar Resource Grid: Calibrated
          </p>
        </div>
      </div>
    </div>
  );
}
