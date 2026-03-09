import type React from "react";
import type { Route } from "@/types";

export const genId  = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
export const genWB  = () => `WB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
export const genBK  = () => `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
export const today  = () => new Date().toISOString().split("T")[0];
export const nowT   = () => new Date().toTimeString().slice(0, 5);

export function routePrice(route: Route, containerType: string): number {
  if (!route) return 0;
  if (containerType.startsWith("20ft"))   return route.price20ft;
  if (containerType.startsWith("30ft"))   return route.price30ft;
  if (containerType.startsWith("40ft"))   return route.price40ft;
  if (containerType.startsWith("Double")) return route.priceDouble;
  return 0;
}

/** Theme-aware inline text colour tokens */
export const tx = (dark: boolean) => ({
  primary:   dark ? "#f8fafc" : "#0f172a",
  secondary: dark ? "#94a3b8" : "#64748b",
  muted:     dark ? "#475569" : "#94a3b8",
});

/** Theme-aware card background style object */
export const cardBg = (dark: boolean): React.CSSProperties =>
  dark
    ? { background: "linear-gradient(135deg,#1e293b,#0f172a)", border: "1px solid rgba(255,255,255,0.06)" }
    : { background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };

/** Theme-aware form field input style object */
export const inputStyle = (dark: boolean): React.CSSProperties => ({
  background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
  border:     `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
  color:      dark ? "#f8fafc" : "#0f172a",
});

