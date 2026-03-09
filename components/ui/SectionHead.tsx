"use client";

import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import type { SectionHeadColor } from "@/types";

interface SectionHeadProps {
  icon: string;
  title: string;
  sub?: string;
  color?: SectionHeadColor;
}

const BG: Record<SectionHeadColor, string> = {
  amber:  "rgba(251,191,36,0.12)",
  blue:   "rgba(59,130,246,0.12)",
  green:  "rgba(16,185,129,0.12)",
  purple: "rgba(168,85,247,0.12)",
};
const BORDER: Record<SectionHeadColor, string> = {
  amber:  "rgba(251,191,36,0.25)",
  blue:   "rgba(59,130,246,0.25)",
  green:  "rgba(16,185,129,0.25)",
  purple: "rgba(168,85,247,0.25)",
};

export default function SectionHead({
  icon,
  title,
  sub,
  color = "amber",
}: SectionHeadProps) {
  const { dark } = useTheme();
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        style={{ background: BG[color], border: `1px solid ${BORDER[color]}` }}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
      >
        {icon}
      </div>
      <div>
        <div
          style={{ color: dark ? "#fff" : "#0f172a" }}
          className="font-black text-sm"
        >
          {title}
        </div>
        {sub && (
          <div style={{ color: tx(dark).muted }} className="text-xs mt-0.5">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
