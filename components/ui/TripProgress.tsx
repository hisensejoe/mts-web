"use client";

import { useTheme } from "@/context/ThemeContext";
import { TRIP_STEPS } from "@/lib/constants";

interface TripProgressProps {
  step: number;
  cancelled: boolean;
}

export default function TripProgress({ step, cancelled }: TripProgressProps) {
  const { dark } = useTheme();

  if (cancelled) {
    return <span className="text-red-400 text-xs font-semibold">— Cancelled</span>;
  }

  return (
    <div>
      <div className="flex gap-0.5">
        {TRIP_STEPS.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            style={{
              background:
                i <= step
                  ? "linear-gradient(90deg,#f59e0b,#d97706)"
                  : dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
            }}
          />
        ))}
      </div>
      <div className="text-xs text-amber-500 mt-1 font-medium">{TRIP_STEPS[step]}</div>
    </div>
  );
}
