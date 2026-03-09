"use client";

import { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import type { InfoBoxColor } from "@/types";

interface InfoBoxProps {
  icon: string;
  color?: InfoBoxColor;
  title?: string;
  children: ReactNode;
}

const COLORS: Record<InfoBoxColor, { dark: string; light: string }> = {
  amber: {
    dark:  "rgba(251,191,36,0.07)|border-amber-500/20|text-amber-400",
    light: "rgba(251,191,36,0.12)|border-amber-400/30|text-amber-700",
  },
  blue: {
    dark:  "rgba(59,130,246,0.07)|border-blue-500/20|text-blue-400",
    light: "rgba(59,130,246,0.1)|border-blue-400/30|text-blue-700",
  },
  red: {
    dark:  "rgba(239,68,68,0.08)|border-red-500/20|text-red-400",
    light: "rgba(239,68,68,0.1)|border-red-400/30|text-red-700",
  },
  green: {
    dark:  "rgba(16,185,129,0.07)|border-emerald-500/20|text-emerald-400",
    light: "rgba(16,185,129,0.1)|border-emerald-400/30|text-emerald-700",
  },
};

export default function InfoBox({
  icon,
  color = "amber",
  title,
  children,
}: InfoBoxProps) {
  const { dark } = useTheme();
  const [bg, border, textCls] = (dark ? COLORS[color].dark : COLORS[color].light).split("|");

  return (
    <div
      style={{ background: bg }}
      className={`rounded-xl p-4 border ${border} ${textCls}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          {title && <div className="font-bold text-sm mb-1">{title}</div>}
          <div style={{ color: tx(dark).secondary }} className="text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
