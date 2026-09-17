"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import area from "@turf/area";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

interface MapboxRoofDrawProps {
  onAreaCalculated: (areaSqM: number) => void;
  latitude?: number;
  longitude?: number;
}

export function MapboxRoofDraw({ onAreaCalculated, latitude, longitude }: MapboxRoofDrawProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [drawnArea, setDrawnArea] = useState<number>(0);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const centerLng = longitude !== undefined ? longitude : 77.5946;
    const centerLat = latitude !== undefined ? latitude : 12.9716;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [centerLng, centerLat],
      zoom: 18,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    map.current.addControl(draw.current);

    map.current.on("load", () => {
      map.current?.resize();
    });

    setTimeout(() => {
      map.current?.resize();
    }, 250);

    const updateArea = (e: any) => {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const calculatedArea = area(data);
        const roundedArea = Math.round(calculatedArea * 100) / 100;
        setDrawnArea(roundedArea);
        onAreaCalculated(roundedArea);
      } else {
        setDrawnArea(0);
        onAreaCalculated(0);
      }
    };

    map.current.on("draw.create", updateArea);
    map.current.on("draw.delete", updateArea);
    map.current.on("draw.update", updateArea);

    // Geolocation to center on user
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );
  }, [onAreaCalculated]);

  useEffect(() => {
    if (map.current && latitude !== undefined && longitude !== undefined) {
      map.current.flyTo({ center: [longitude, latitude], zoom: 18 });
    }
  }, [latitude, longitude]);

  return (
    <>
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
      <link href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css" rel="stylesheet" />
      <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-line bg-secondary/30">
        <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-soft border border-line text-xs font-bold">
        Draw your roof using the polygon tool on the right.
      </div>
      {drawnArea > 0 && (
        <div className="absolute bottom-4 left-4 z-10 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-soft border border-line">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Drawn Area</p>
          <p className="text-lg font-extrabold text-foreground">{drawnArea.toFixed(0)} m²</p>
        </div>
      )}
    </div>
    </>
  );
}
