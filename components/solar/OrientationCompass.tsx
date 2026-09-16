"use client";

import React from "react";
import { type Direction } from "@/data/mockSolarResult";

interface OrientationCompassProps {
  selectedOrientation: Direction;
  onOrientationChange: (direction: Direction) => void;
  className?: string;
}

const directions: { dir: Direction; angle: number; label: string; full: string }[] = [
  { dir: "N", angle: 0, label: "0°", full: "North" },
  { dir: "NE", angle: 45, label: "45°", full: "North-East" },
  { dir: "E", angle: 90, label: "90°", full: "East" },
  { dir: "SE", angle: 135, label: "135°", full: "South-East" },
  { dir: "S", angle: 180, label: "180°", full: "South" },
  { dir: "SW", angle: 225, label: "225°", full: "South-West" },
  { dir: "W", angle: 270, label: "270°", full: "West" },
  { dir: "NW", angle: 315, label: "315°", full: "North-West" },
];

const angleMap: Record<Direction, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export function OrientationCompass({
  selectedOrientation,
  onOrientationChange,
}: OrientationCompassProps) {
  const currentAngle = angleMap[selectedOrientation] ?? 180;
  const currentDir = directions.find((d) => d.dir === selectedOrientation);

  // Generate 72 tick marks around the 360 degree circle
  const tickMarks = Array.from({ length: 72 }, (_, i) => {
    const angle = i * 5;
    const isMajor = angle % 45 === 0;
    const isMedium = angle % 15 === 0;
    const length = isMajor ? 10 : isMedium ? 6 : 3;
    const strokeWidth = isMajor ? 2 : isMedium ? 1.5 : 1;
    return { angle, length, strokeWidth, isMajor };
  });

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none">
      {/* Compass Container */}
      <div className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-full border border-line bg-surface shadow-soft p-3">
        {/* SVG Compass Dial */}
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full overflow-visible"
          aria-label="Interactive solar orientation compass"
        >
          <defs>
            {/* Compass Dial Gradients */}
            <radialGradient id="dialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--surface)" stopOpacity="0.2" />
            </radialGradient>
            <linearGradient id="needleNorth" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--fresh)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
            <linearGradient id="needleSouth" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--line)" />
              <stop offset="100%" stopColor="var(--muted-foreground)" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Dial Background */}
          <circle cx="150" cy="150" r="140" fill="url(#dialGlow)" />

          {/* Outer Bezel Rings */}
          <circle
            cx="150"
            cy="150"
            r="138"
            fill="none"
            stroke="var(--line)"
            strokeWidth="2"
          />
          <circle
            cx="150"
            cy="150"
            r="126"
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <circle
            cx="150"
            cy="150"
            r="96"
            fill="none"
            stroke="var(--line)"
            strokeWidth="1.2"
          />

          {/* Radial Degree Ticks */}
          {tickMarks.map(({ angle, length, strokeWidth, isMajor }) => (
            <line
              key={angle}
              x1="150"
              y1={150 - 138}
              x2="150"
              y2={150 - 138 + length}
              stroke={isMajor ? "var(--primary)" : "var(--line)"}
              strokeWidth={strokeWidth}
              transform={`rotate(${angle} 150 150)`}
            />
          ))}

          {/* Degree Ring Labels */}
          {[
            { a: 0, t: "0°" },
            { a: 90, t: "90°" },
            { a: 180, t: "180°" },
            { a: 270, t: "270°" },
          ].map(({ a, t }) => (
            <text
              key={a}
              x="150"
              y="68"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[9px] font-bold"
              transform={`rotate(${a} 150 150)`}
            >
              {t}
            </text>
          ))}

          {/* Crosshairs */}
          <line
            x1="150"
            y1="55"
            x2="150"
            y2="245"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="55"
            y1="150"
            x2="245"
            y2="150"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* ROTATING NEEDLE - Fixed Pivot at exact center (150, 150) */}
          <g
            filter="url(#needleGlow)"
            style={{
              transform: `rotate(${currentAngle}deg)`,
              transformOrigin: "150px 150px",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* North-facing active pointer (Vibrant Emerald Green) */}
            <polygon
              points="150,44 158,150 150,140"
              fill="var(--fresh)"
            />
            <polygon
              points="150,44 142,150 150,140"
              fill="var(--primary)"
            />

            {/* South-facing tail pointer (Shaded Slate) */}
            <polygon
              points="150,236 156,150 150,160"
              fill="var(--line)"
            />
            <polygon
              points="150,236 144,150 150,160"
              fill="var(--muted-foreground)"
            />

            {/* Central Pivot Hub */}
            <circle cx="150" cy="150" r="14" fill="var(--primary)" />
            <circle cx="150" cy="150" r="8" fill="var(--solar)" />
            <circle cx="150" cy="150" r="3" fill="var(--surface)" />
          </g>
        </svg>

        {/* 8 Direction Clickable Marker Buttons (Placed around the perimeter) */}
        {directions.map(({ dir, angle }) => {
          // Trigonometric placement at radius 105px from dial center (50%, 50%)
          const rad = (angle * Math.PI) / 180;
          const radiusPercent = 38.5; // percentage of container
          const leftPercent = 50 + radiusPercent * Math.sin(rad);
          const topPercent = 50 - radiusPercent * Math.cos(rad);
          const isSelected = selectedOrientation === dir;

          return (
            <button
              type="button"
              key={dir}
              onClick={() => onOrientationChange(dir)}
              aria-label={`Select ${dir} (${angle}°)`}
              className={`absolute grid h-8 w-8 sm:h-9 sm:w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-xs font-extrabold transition-all duration-200 ${
                isSelected
                  ? "bg-solar text-solar-foreground shadow-solar scale-115 ring-2 ring-solar/50 z-20"
                  : "bg-surface/90 text-muted-foreground border border-line hover:bg-fresh hover:text-primary-foreground hover:scale-105 z-10"
              }`}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
              }}
            >
              {dir}
            </button>
          );
        })}
      </div>

      {/* Compass Azimuth Readout Badge */}
      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1 text-xs font-bold text-foreground border border-line">
          <span className="h-2 w-2 rounded-full bg-fresh" />
          <span>
            {currentDir?.full} ({currentAngle}° Azimuth)
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {selectedOrientation === "S"
            ? "100% Optimal Solar Yield in India"
            : selectedOrientation === "SE" || selectedOrientation === "SW"
            ? "~95% Optimal Solar Yield"
            : selectedOrientation === "E" || selectedOrientation === "W"
            ? "~85% Moderate Solar Yield"
            : "65-75% Solar Yield (Indirect Exposure)"}
        </p>
      </div>
    </div>
  );
}
