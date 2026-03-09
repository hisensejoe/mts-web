"use client";

import { useTheme } from "@/context/ThemeContext";
import { STATUS_COLORS_DARK, STATUS_COLORS_LIGHT } from "@/lib/constants";

interface BadgeProps {
  status: string;
}

export default function Badge({ status }: BadgeProps) {
  const { dark } = useTheme();
  const map = dark ? STATUS_COLORS_DARK : STATUS_COLORS_LIGHT;
  const cls =
    map[status] ??
    (dark
      ? "bg-slate-500/20 text-slate-400 border-slate-500/30"
      : "bg-slate-100 text-slate-600 border-slate-300");
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {status}
    </span>
  );
}
