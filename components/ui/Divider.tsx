"use client";

import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";

export default function Divider({ label }: { label?: string }) {
  const { dark } = useTheme();
  const line = { background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" };
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px" style={line} />
      {label && (
        <span
          style={{ color: tx(dark).muted }}
          className="text-xs font-semibold uppercase tracking-wider"
        >
          {label}
        </span>
      )}
      <div className="flex-1 h-px" style={line} />
    </div>
  );
}
