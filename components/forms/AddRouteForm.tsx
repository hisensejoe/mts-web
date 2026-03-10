"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx, inputStyle } from "@/lib/utils";
import { ROUTE_DESTINATIONS } from "@/lib/constants";
import { FieldInput, FieldSelect } from "@/components/ui/FormFields";
import Divider from "@/components/ui/Divider";
import SectionHead from "@/components/ui/SectionHead";
import type { Route } from "@/types";
import axiosInstance from "@/lib/axios";

interface FormRequest {
  origin?: string;
  destination?: string;
  routeType?: string;
  distanceKm?: number;
  price20ft?: number;
  price230ft?: number;
  price40ft?: number;
  priceDouble?: number;
  crossBorderFee?: number;
}

interface AddRouteFormProps {
  onSave: (route: Route) => void;
  onClose: () => void;
}

const ORIGINS = ["Tema Port", "Takoradi Port", "Accra Depot", "Kumasi Yard"];

export default function AddRouteForm({ onSave, onClose }: AddRouteFormProps) {
  const { dark } = useTheme();
  const [formInputs, setFormInputs] = useState<FormRequest>({
    origin: "",
    destination: "",
    routeType: "",
    distanceKm: undefined,
    price20ft: undefined,
    price230ft: undefined,
    price40ft: undefined,
    priceDouble: undefined,
    crossBorderFee: undefined,
  });
  const [crossBorder, setCrossBorder] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const allFilled = !!(formInputs.origin && formInputs.destination && formInputs.distanceKm && formInputs.price20ft && formInputs.price230ft && formInputs.price40ft && formInputs.priceDouble);

  const handleSave = async () => {
    try {
      setLoading(true);
      // api call
    const res = await axiosInstance.post<Route>("/api/v1/routes", {
      "origin": formInputs.origin,
      "destination": formInputs.destination,
      "distance_km": formInputs.distanceKm,
      "price_20ft": formInputs.price20ft,
      "price_30ft": formInputs.price230ft,
      "price_40ft": formInputs.price40ft,
      "price_double": formInputs.priceDouble,
    });
    const route = res.data;
    onSave(route);
    setSaved(true);
    setTimeout(onClose, 800);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
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
          value={formInputs.origin}
          onChange={(e) => setFormInputs({ ...formInputs, origin: e.target.value })}
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
            value={formInputs.destination}
            onChange={(e) => setFormInputs({ ...formInputs, destination: e.target.value })}
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
          value={formInputs.distanceKm || ""}
          onChange={(e) => setFormInputs({ ...formInputs, distanceKm: Number(e.target.value) })}
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
            ["20ft Container", formInputs.price20ft, (e: string) => setFormInputs({ ...formInputs, origin: e })],
            ["30ft Container", formInputs.price230ft, (e: string) => setFormInputs({ ...formInputs, origin: e })],
            ["40ft Container", formInputs.price40ft, (e: string) => setFormInputs({ ...formInputs, origin: e })],
            ["Double Container", formInputs.priceDouble, (e: string) => setFormInputs({ ...formInputs, origin: e })],
          ] as unknown as [string, string, (v: string) => void][]
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

      <div className="grid grid-cols-2 gap-4">
        <FieldInput
            label='Cross-border Fee'
            req
            prefix="₵"
            type="number"
            placeholder="0"
            value={formInputs.crossBorderFee}
            onChange={(e) => setFormInputs({ ...formInputs, crossBorderFee: Number(e.target.value) })}
          />
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
            Preview: {formInputs.origin} → {formInputs.destination} · {formInputs.distanceKm} km {crossBorder ? "🌍" : ""}
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {(
              [
                ["20ft", formInputs.price20ft],
                ["30ft", formInputs.price230ft],
                ["40ft", formInputs.price40ft],
                ["Double", formInputs.priceDouble],
              ] as [string, number][]
            ).map(([k, v]) => (
              <div key={k}>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  {k}
                </div>
                <div className="text-emerald-500 font-black text-sm">
                  ₵{v}
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
