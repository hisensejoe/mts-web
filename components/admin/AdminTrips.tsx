"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cardBg, tx, inputStyle } from "@/lib/utils";
import { TRIP_STEPS, CANCELLABLE_STEPS } from "@/lib/constants";
import TripProgress from "@/components/ui/TripProgress";
import Badge from "@/components/ui/Badge";
import InfoBox from "@/components/ui/InfoBox";
import CancelPanel from "@/components/forms/CancelPanel";
import type { Trip, TripStatus } from "@/types";

interface AdminTripsProps {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  onNewTrip: () => void;
}

type FilterKey = "all" | "active" | "completed" | "cancelled";

export default function AdminTrips({ trips, setTrips, onNewTrip }: AdminTripsProps) {
  const { dark } = useTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  const counts: Record<FilterKey, number> = {
    all:       trips.length,
    active:    trips.filter((t) => t.status !== "Cancelled" && t.status !== "Back at Base").length,
    completed: trips.filter((t) => t.status === "Back at Base").length,
    cancelled: trips.filter((t) => t.status === "Cancelled").length,
  };

  const doCancel = (reason: string, note: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              status: "Cancelled" as TripStatus,
              cancelReason: reason,
              cancelNote: note,
              cancelledAt: new Date()
                .toLocaleString("en-GB", { hour12: false })
                .slice(0, 16)
                .replace(",", ""),
              cancelledBy: "Ama Korantema",
            }
          : t
      )
    );
    setShowCancel(false);
  };

  const doAdvance = () => {
    const selected = trips.find((t) => t.id === selectedId);
    if (!selected || selected.step >= 10 || selected.status === "Cancelled") return;
    const newStep = selected.step + 1;
    const newStatus = TRIP_STEPS[newStep] as TripStatus;
    setTrips((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, step: newStep, status: newStatus } : t))
    );
  };

  const filtered = trips.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      [t.id, t.driver, t.customer, t.route, t.waybill, t.booking].some((x) =>
        x?.toLowerCase().includes(q)
      );
    const matchFilter =
      filter === "all" ||
      (filter === "active" && t.status !== "Cancelled" && t.status !== "Back at Base") ||
      (filter === "completed" && t.status === "Back at Base") ||
      (filter === "cancelled" && t.status === "Cancelled");
    return matchSearch && matchFilter;
  });

  // ── Detail view ────────────────────────────────────────────────────────────
  if (selectedId) {
    const trip = trips.find((t) => t.id === selectedId)!;
    const isCancelled = trip.status === "Cancelled";
    const canCancel =
      !isCancelled && (CANCELLABLE_STEPS as readonly number[]).includes(trip.step);

    return (
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { setSelectedId(null); setShowCancel(false); }}
            style={{ color: tx(dark).muted }}
            className="text-sm flex items-center gap-1.5 hover:opacity-70"
          >
            ← Trips
          </button>
          <span style={{ color: tx(dark).muted }}>/</span>
          <span className="text-amber-500 font-mono font-bold">{trip.id}</span>
          <Badge status={trip.status} />
          {canCancel && !showCancel && (
            <button
              onClick={() => setShowCancel(true)}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            >
              Cancel Trip
            </button>
          )}
        </div>

        {/* Cancel panel */}
        {showCancel && (
          <div style={cardBg(dark)} className="rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
                🚫
              </div>
              <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold text-sm">
                Cancel Trip {trip.id}
              </div>
            </div>
            <CancelPanel
              trip={trip}
              onConfirm={doCancel}
              onDismiss={() => setShowCancel(false)}
            />
          </div>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <div
            style={{
              background: dark ? "rgba(239,68,68,0.07)" : "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.22)",
            }}
            className="rounded-2xl p-5 flex items-start gap-4"
          >
            <span className="text-3xl">🚫</span>
            <div>
              <div className="text-red-400 font-black text-base mb-3">Trip Cancelled</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {(
                  [
                    ["Reason", trip.cancelReason ?? "—"],
                    ["By", trip.cancelledBy || "—"],
                    ["At", trip.cancelledAt ?? "—"],
                    ["Note", trip.cancelNote || "—"],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: tx(dark).muted }} className="text-xs mb-0.5">
                      {k}
                    </div>
                    <div
                      style={{ color: dark ? "#fff" : "#0f172a" }}
                      className="font-semibold"
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {/* Main card */}
          <div style={cardBg(dark)} className="rounded-2xl p-6 col-span-2">
            <h2 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-xl font-black mb-1">
              {trip.id}
            </h2>
            <p style={{ color: tx(dark).secondary }} className="text-sm mb-5">
              {trip.route}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {(
                [
                  ["Driver",  trip.driver],
                  ["Vehicle", trip.vehicle],
                  ["Customer",trip.customer],
                  ["Cargo",   trip.cargo],
                  ["Weight",  trip.weight ? `${trip.weight} t` : "—"],
                  ["Amount",  `₵${trip.amount.toLocaleString()}`],
                  ["Date",    trip.date],
                  ["Waybill", trip.waybill],
                  ["Booking", trip.booking],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
                  }}
                  className="rounded-xl p-3"
                >
                  <div style={{ color: tx(dark).muted }} className="text-xs mb-0.5">
                    {k}
                  </div>
                  <div
                    style={{ color: dark ? "#fff" : "#0f172a" }}
                    className="text-sm font-semibold font-mono"
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {trip.driverInstructions && (
              <div
                style={{
                  background: dark ? "rgba(251,191,36,0.05)" : "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.15)",
                }}
                className="rounded-xl p-3 mb-4 text-sm text-amber-400"
              >
                📋 <strong>Driver Instructions:</strong> {trip.driverInstructions}
              </div>
            )}

            {/* Manual price badge */}
            {trip.priceMode === "manual" && (
              <div className="mb-3">
                <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full">
                  ⚠️ Manual Price
                </span>
              </div>
            )}

            {/* Step tracker */}
            <div className="space-y-1.5">
              {TRIP_STEPS.map((stepLabel, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        i < trip.step
                          ? "linear-gradient(135deg,#f59e0b,#d97706)"
                          : i === trip.step && !isCancelled
                          ? "rgba(251,191,36,0.2)"
                          : dark
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.06)",
                      border:
                        i === trip.step && !isCancelled
                          ? "2px solid #f59e0b"
                          : "none",
                    }}
                  >
                    {i < trip.step ? (
                      <span className="text-black text-xs font-bold">✓</span>
                    ) : i === trip.step && !isCancelled ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse block" />
                    ) : (
                      <span style={{ color: tx(dark).muted }} className="text-xs">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: isCancelled
                        ? tx(dark).muted
                        : i <= trip.step
                        ? dark
                          ? "#f8fafc"
                          : "#0f172a"
                        : tx(dark).muted,
                      fontWeight: i === trip.step && !isCancelled ? 700 : 400,
                    }}
                  >
                    {stepLabel}
                  </span>
                  {i === trip.step && !isCancelled && (
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!isCancelled && trip.step < 10 && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={doAdvance}
                  style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
                  className="px-4 py-2 rounded-xl text-black text-sm font-bold"
                >
                  Advance Step →
                </button>
                {canCancel && (
                  <button
                    onClick={() => setShowCancel(true)}
                    className="px-4 py-2 rounded-xl text-red-400 text-sm font-semibold border border-red-500/20 bg-red-500/5"
                  >
                    Cancel Trip
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Side cards */}
          <div className="space-y-4">
            <div style={cardBg(dark)} className="rounded-2xl p-5">
              <h3
                style={{ color: dark ? "#fff" : "#0f172a" }}
                className="font-bold text-sm mb-3"
              >
                Delivery
              </h3>
              <div className="space-y-1 text-sm">
                <div style={{ color: tx(dark).secondary }}>{trip.deliveryAddr}</div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-semibold">
                  {trip.recipientName}
                </div>
                <div style={{ color: tx(dark).muted }} className="text-xs font-mono">
                  {trip.recipientPhone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Trips
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            {trips.length} total
          </p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trips, waybill, booking…"
            className="rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-56"
            style={inputStyle(dark)}
          />
          <button
            onClick={onNewTrip}
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            className="px-4 py-2 rounded-xl text-black text-sm font-bold"
          >
            + New Trip
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "active", "completed", "cancelled"] as FilterKey[]).map((val) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className="px-4 py-1.5 rounded-full text-xs font-bold border capitalize"
            style={{
              background:
                filter === val
                  ? val === "cancelled"
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(251,191,36,0.12)"
                  : "transparent",
              borderColor:
                filter === val
                  ? val === "cancelled"
                    ? "rgba(239,68,68,0.3)"
                    : "rgba(251,191,36,0.3)"
                  : dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              color:
                filter === val
                  ? val === "cancelled"
                    ? "#f87171"
                    : "#f59e0b"
                  : tx(dark).secondary,
            }}
          >
            {val} ({counts[val]})
          </button>
        ))}
      </div>

      <div style={cardBg(dark)} className="rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              {["ID", "Driver", "Route", "Waybill", "Progress", "Amount", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: tx(dark).muted }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((trip) => (
              <tr
                key={trip.id}
                onClick={() => setSelectedId(trip.id)}
                className="cursor-pointer hover:bg-white/[0.02]"
                style={{
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                  opacity: trip.status === "Cancelled" ? 0.55 : 1,
                }}
              >
                <td className="px-4 py-3 text-amber-500 text-sm font-mono font-semibold">
                  {trip.id}
                </td>
                <td style={{ color: dark ? "#fff" : "#0f172a" }} className="px-4 py-3 text-sm">
                  {trip.driver}
                </td>
                <td
                  style={{ color: tx(dark).secondary }}
                  className="px-4 py-3 text-xs max-w-[110px] truncate"
                >
                  {trip.route}
                </td>
                <td style={{ color: tx(dark).muted }} className="px-4 py-3 text-xs font-mono">
                  {trip.waybill}
                </td>
                <td className="px-4 py-3 w-32">
                  <TripProgress step={trip.step} cancelled={trip.status === "Cancelled"} />
                </td>
                <td className="px-4 py-3 text-emerald-500 text-sm font-semibold">
                  ₵{trip.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Badge status={trip.status} />
                </td>
                <td style={{ color: tx(dark).muted }} className="px-4 py-3 text-xs">
                  →
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ color: tx(dark).muted }}
                  className="text-center py-12 text-sm"
                >
                  No trips found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
