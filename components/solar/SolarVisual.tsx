"use client";

import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface SolarVisualProps {
  compact?: boolean;
  coverage?: number;
  showYieldBadge?: boolean;
  yieldValue?: string;
  className?: string;
}

export function SolarVisual({
  compact = false,
  coverage = 72,
  showYieldBadge = true,
  yieldValue = "1,338 kWh/kW",
  className,
}: SolarVisualProps) {
  return (
    <div
      className={cn(
        "solar-scene relative isolate overflow-hidden rounded-2xl border border-line/60 select-none",
        compact ? "h-64 sm:h-72" : "h-80 sm:h-96 lg:h-[24rem]",
        className
      )}
      aria-label="Illustration of a solar-powered home"
    >
      {/* Ground Terrain */}
      <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-terrain" />

      {/* Floating Sun in upper-right sky */}
      <div className="solar-sun absolute right-[8%] sm:right-[12%] top-[8%] z-10 grid h-14 w-14 sm:h-18 sm:w-18 place-items-center rounded-full bg-solar text-solar-foreground shadow-solar">
        <Sun className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />
      </div>

      {/* Solar Yield Badge - cleanly in upper-left sky, strictly above house roof */}
      {showYieldBadge && (
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20 rounded-xl border border-line/80 bg-surface/90 px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-soft backdrop-blur-md">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Estimated Solar Yield
          </span>
          <p className="mt-0.5 font-display text-sm sm:text-base font-extrabold text-foreground">
            {yieldValue}
          </p>
        </div>
      )}

      {/* House Illustration - Anchored to terrain, below the sky zone */}
      <div className="absolute bottom-[8%] left-1/2 h-[48%] sm:h-[50%] w-[78%] sm:w-[68%] max-w-md -translate-x-1/2 rounded-t-2xl rounded-b-xl bg-house shadow-scene">
        {/* Slanted Roof with Solar Panel Array */}
        <div className="absolute -top-[28%] left-1/2 h-[46%] w-[108%] -translate-x-1/2 -skew-x-12 rounded-lg bg-roof shadow-md">
          <div className="absolute inset-[8%] grid grid-cols-4 gap-1 sm:gap-1.5 overflow-hidden rounded-md">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="panel relative overflow-hidden rounded-[2px] sm:rounded-[3px] border border-panel-line bg-panel"
              >
                <div
                  className="panel-shine absolute inset-y-0 w-1/2 -translate-x-full bg-panel-shine"
                  style={{ animationDelay: `${index * 0.16}s` }}
                />
              </div>
            ))}
            {/* Dark uninstalled roof area overlay based on coverage */}
            <div
              className="absolute bottom-0 left-0 top-0 bg-roof/75 transition-[width] duration-500 pointer-events-none"
              style={{ width: `${Math.max(0, 100 - coverage)}%` }}
            />
          </div>
        </div>

        {/* Front Door */}
        <div className="absolute bottom-0 left-[14%] h-[58%] w-[22%] rounded-t-lg bg-window shadow-xs" />

        {/* Window with Warm Glow */}
        <div className="absolute bottom-[16%] right-[14%] grid h-[36%] w-[32%] grid-cols-2 gap-1 rounded-md bg-window p-1 shadow-window">
          <span className="bg-window-glow rounded-[1px]" />
          <span className="bg-window-glow rounded-[1px]" />
          <span className="bg-window-glow rounded-[1px]" />
          <span className="bg-window-glow rounded-[1px]" />
        </div>
      </div>

      {/* Energy Flow Path from panels towards ground */}
      <div className="energy-path absolute right-[22%] sm:right-[26%] top-[34%] h-[38%] w-[20%] border-b-2 border-r-2 border-dashed border-energy/60 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="energy-particle absolute h-2 w-2 rounded-full bg-energy shadow-energy"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </div>

      {/* Clean Energy Generation Pill - Bottom Right on terrain */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-20 rounded-lg border border-line/70 bg-surface/90 px-2.5 py-1.5 sm:px-3 sm:py-1.5 shadow-xs backdrop-blur-md">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
          <span className="h-2 w-2 rounded-full bg-energy pulse-dot" />
          Producing clean energy
        </p>
      </div>
    </div>
  );
}
