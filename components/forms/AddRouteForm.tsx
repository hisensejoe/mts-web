"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx, inputStyle } from "@/lib/utils";
import { ROUTE_DESTINATIONS } from "@/lib/constants";
import { FieldInput, FieldSelect } from "@/components/ui/FormFields";
import Divider from "@/components/ui/Divider";
import SectionHead from "@/components/ui/SectionHead";
import type { Route } from "@/types";

interface AddRouteFormProps {
  onSave: (route: Route) => void;
  onClose: () => void;
}

const ORIGINS = ["Tema Port", "Takoradi Port", "Accra Depot", "Kumasi Yard"];

export default function AddRouteForm({ onSave, onClose }: AddRouteFormProps) {
  const { dark } = useTheme();
  const [from, setFrom] = useState("Tema Port");
  const [to, setTo] = useState("");
  const [distance, setDistance] = useState("");
  const [crossBorder, setCrossBorder] = useState(false);
  const [p20, setP20] = useState("");
  const [p30, setP30] = useState("");
  const [p40, setP40] = useState("");
  const [pD, setPD] = useState("");
  const [saved, setSaved] = useState(false);

  const allFilled = !!(to && distance && p20 && p30 && p40 && pD);

  const handleSave = () => {
    const route: Route = {
      id: "RT-" + Date.now().toString(36).slice(-4).toUpperCase(),
      from,
      to,
      distance: parseFloat(distance),
      price20ft: parseFloat(p20),
      price30ft: parseFloat(p30),
      price40ft: parseFloat(p40),
      priceDouble: parseFloat(pD),
      crossBorder,
    };
    onSave(route);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  if (saved) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">✅</div>
        <div className="text-emerald-400 font-black text-xl">Route Added!</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHead icon="📍" title="Route Details" sub="Set origin, destination, and distance" />

      <div className="grid grid-cols-2 gap-4">
        <FieldSelect
          label="Origin"
          req
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          options={ORIGINS}
        />
        <div>
          <label
            style={{ color: tx(dark).secondary }}
            className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
          >
            Destination <span className="text-amber-500">*</span>
          </label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Type or select…"
            list="dest-list"
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            style={inputStyle(dark)}
          />
          <datalist id="dest-list">
            {ROUTE_DESTINATIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldInput
          label="Distance (km)"
          req
          type="number"
          placeholder="e.g. 270"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        {/* Cross-border toggle */}
        <div className="flex items-end pb-1">
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCrossBorder((b) => !b)}
          >
            <div
              style={{
                background: crossBorder
                  ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                  : dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.12)",
              }}
              className="w-10 h-6 rounded-full relative flex-shrink-0 transition-all"
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                style={{ left: crossBorder ? "calc(100% - 1.375rem)" : "0.125rem" }}
              />
            </div>
            <span
              style={{ color: dark ? "#fff" : "#0f172a" }}
              className="text-sm font-semibold"
            >
              Cross-border 🌍
            </span>
          </label>
        </div>
      </div>

      <Divider label="Pricing Matrix" />

      <div className="grid grid-cols-2 gap-4">
        {(
          [
            ["20ft Container", p20, setP20],
            ["30ft Container", p30, setP30],
            ["40ft Container", p40, setP40],
            ["Double Container", pD, setPD],
          ] as [string, string, (v: string) => void][]
        ).map(([lbl, val, setter]) => (
          <FieldInput
            key={lbl}
            label={lbl}
            req
            prefix="₵"
            type="number"
            placeholder="0"
            value={val}
            onChange={(e) => setter(e.target.value)}
          />
        ))}
      </div>

      {/* Live preview */}
      {allFilled && (
        <div
          style={{
            background: dark ? "rgba(251,191,36,0.06)" : "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.2)",
          }}
          className="rounded-xl p-4"
        >
          <div className="text-amber-500 font-bold text-xs mb-2">
            Preview: {from} → {to} · {distance} km {crossBorder ? "🌍" : ""}
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {(
              [
                ["20ft", p20],
                ["30ft", p30],
                ["40ft", p40],
                ["Double", pD],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k}>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  {k}
                </div>
                <div className="text-emerald-500 font-black text-sm">
                  ₵{parseFloat(v).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          style={{
            background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            color: tx(dark).secondary,
          }}
          className="flex-1 py-3 rounded-xl font-semibold text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!allFilled}
          style={{
            background: allFilled
              ? "linear-gradient(135deg,#f59e0b,#d97706)"
              : "rgba(251,191,36,0.2)",
            color: allFilled ? "#000" : tx(dark).secondary,
          }}
          className="flex-1 py-3 rounded-xl font-black text-sm disabled:cursor-not-allowed"
        >
          Save Route →
        </button>
      </div>
    </div>
  );
}
