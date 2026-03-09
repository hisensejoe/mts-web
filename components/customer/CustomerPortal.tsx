"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cardBg, tx } from "@/lib/utils";
import { INITIAL_TRIPS, MOCK_VEHICLES, MOCK_ROUTES } from "@/lib/data";
import { CONTAINER_TYPES, PICKUP_POINTS, TRIP_STEPS } from "@/lib/constants";
import Badge from "@/components/ui/Badge";
import TripProgress from "@/components/ui/TripProgress";
import ThemeToggle from "@/components/ui/ThemeToggle";
import InfoBox from "@/components/ui/InfoBox";
import Divider from "@/components/ui/Divider";
import { FieldSelect, FieldInput, FieldTextarea } from "@/components/ui/FormFields";
import type { CustomerUser, Trip } from "@/types";

type CustomerTab = "dashboard" | "mytrips" | "vehicles" | "booking";

interface CustomerPortalProps {
  user: CustomerUser;
  onLogout: () => void;
}

const NAV_ITEMS: { id: CustomerTab; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⊞", label: "Overview"         },
  { id: "mytrips",   icon: "📦", label: "My Shipments"    },
  { id: "vehicles",  icon: "🚛", label: "Available Fleet" },
  { id: "booking",   icon: "➕", label: "Request Booking" },
];

export default function CustomerPortal({ user, onLogout }: CustomerPortalProps) {
  const { dark } = useTheme();
  const [tab, setTab] = useState<CustomerTab>("dashboard");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const myTrips = INITIAL_TRIPS.filter((t) => t.customerId === user.customerId);
  const availVehicles = MOCK_VEHICLES.filter((v) => v.status === "Available");
  const activeTrips = myTrips.filter(
    (t) => t.status !== "Cancelled" && t.status !== "Back at Base"
  );

  const pageBg = dark ? "#080f1e" : "#f0f4ff";

  const handleTabClick = (id: CustomerTab) => {
    setTab(id);
    setSelectedTrip(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: pageBg }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-20"
        style={{
          background: dark ? "rgba(8,15,30,0.95)" : "rgba(255,255,255,0.95)",
          borderBottom: `1px solid ${dark ? "rgba(59,130,246,0.15)" : "rgba(0,0,0,0.08)"}`,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
          >
            <span className="text-black font-black text-base">M</span>
          </div>
          <div>
            <div
              style={{ color: dark ? "#fff" : "#0f172a" }}
              className="font-black text-sm leading-none"
            >
              MTS Fleet
            </div>
            <div style={{ color: tx(dark).muted }} className="text-xs">
              Customer Portal
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background:
                  tab === item.id
                    ? dark
                      ? "rgba(59,130,246,0.2)"
                      : "rgba(59,130,246,0.15)"
                    : "transparent",
                color: tab === item.id ? "#60a5fa" : tx(dark).secondary,
                border: tab === item.id ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div
            style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
          >
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <button
            onClick={onLogout}
            style={{
              color: tx(dark).muted,
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}
            className="text-xs hover:text-red-400 px-3 py-1.5 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ── Dashboard ── */}
        {tab === "dashboard" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
                Good morning, {user.name.split(" ")[0]} 👋
              </h1>
              <p style={{ color: tx(dark).secondary }} className="text-sm mt-1">
                {user.company} shipments overview
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(
                [
                  { label: "Total",     value: myTrips.length,                                          icon: "📦", c: "from-blue-500 to-cyan-500"    },
                  { label: "In Progress",value: activeTrips.length,                                      icon: "🚛", c: "from-amber-500 to-orange-500" },
                  { label: "Completed", value: myTrips.filter((t) => t.status === "Back at Base").length, icon: "✅", c: "from-emerald-500 to-teal-500" },
                  { label: "Cancelled", value: myTrips.filter((t) => t.status === "Cancelled").length,   icon: "🚫", c: "from-red-500 to-rose-500"     },
                ]
              ).map((s, i) => (
                <div key={i} style={cardBg(dark)} className="rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-lg mb-3`}>
                    {s.icon}
                  </div>
                  <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black mb-1">
                    {s.value}
                  </div>
                  <div style={{ color: tx(dark).secondary }} className="text-xs">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {activeTrips.length > 0 && (
              <div
                style={{ ...cardBg(dark), border: "1px solid rgba(59,130,246,0.2)" }}
                className="rounded-2xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-5"
                  style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}` }}
                >
                  <h3 style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />
                    Active Shipments
                  </h3>
                  <button onClick={() => handleTabClick("mytrips")} className="text-blue-400 text-xs hover:underline">
                    View all →
                  </button>
                </div>
                {activeTrips.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => { setSelectedTrip(t); setTab("mytrips"); }}
                    className="p-5 cursor-pointer hover:opacity-80"
                    style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
                          {t.route}
                        </div>
                        <div style={{ color: tx(dark).muted }} className="text-xs font-mono">
                          {t.waybill} · {t.cargo}
                        </div>
                      </div>
                      <Badge status={t.status} />
                    </div>
                    <TripProgress step={t.step} cancelled={false} />
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleTabClick("booking")}
                style={{ ...cardBg(dark), border: "1px solid rgba(59,130,246,0.25)" }}
                className="p-6 rounded-2xl text-left hover:opacity-90 cursor-pointer"
              >
                <div className="text-3xl mb-3">➕</div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold text-base mb-1">
                  Request a Booking
                </div>
                <div style={{ color: tx(dark).secondary }} className="text-sm">
                  Book a vehicle for your next shipment
                </div>
              </button>
              <button
                onClick={() => handleTabClick("vehicles")}
                style={{ ...cardBg(dark), border: "1px solid rgba(16,185,129,0.2)" }}
                className="p-6 rounded-2xl text-left hover:opacity-90 cursor-pointer"
              >
                <div className="text-3xl mb-3">🚛</div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold text-base mb-1">
                  View Available Fleet
                </div>
                <div style={{ color: tx(dark).secondary }} className="text-sm">
                  {availVehicles.length} vehicles ready
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── My Shipments ── */}
        {tab === "mytrips" && (
          <div className="max-w-5xl mx-auto">
            {selectedTrip ? (
              <ShipmentDetail
                trip={selectedTrip}
                dark={dark}
                onBack={() => setSelectedTrip(null)}
              />
            ) : (
              <div className="space-y-5">
                <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
                  My Shipments
                </h1>
                <div style={cardBg(dark)} className="rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}` }}>
                        {["Booking", "Route", "Cargo", "Progress", "Amount", "Status"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: tx(dark).muted }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {myTrips.map((t) => (
                        <tr
                          key={t.id}
                          onClick={() => setSelectedTrip(t)}
                          className="cursor-pointer"
                          style={{
                            borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                            opacity: t.status === "Cancelled" ? 0.55 : 1,
                          }}
                        >
                          <td className="px-4 py-3 text-blue-400 text-sm font-semibold font-mono">{t.booking}</td>
                          <td style={{ color: dark ? "#fff" : "#0f172a" }} className="px-4 py-3 text-sm">{t.route}</td>
                          <td style={{ color: tx(dark).secondary }} className="px-4 py-3 text-xs">{t.cargo}</td>
                          <td className="px-4 py-3 w-36"><TripProgress step={t.step} cancelled={t.status === "Cancelled"} /></td>
                          <td className="px-4 py-3 text-emerald-500 text-sm font-semibold">₵{t.amount.toLocaleString()}</td>
                          <td className="px-4 py-3"><Badge status={t.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Available Fleet ── */}
        {tab === "vehicles" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
                  Available Fleet
                </h1>
                <p style={{ color: tx(dark).secondary }} className="text-sm">
                  {availVehicles.length} ready
                </p>
              </div>
              <button
                onClick={() => handleTabClick("booking")}
                style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}
                className="px-4 py-2 rounded-xl text-white text-sm font-bold"
              >
                Request Booking →
              </button>
            </div>
            <InfoBox icon="ℹ️" color="blue">Only available vehicles shown.</InfoBox>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {availVehicles.map((v) => (
                <div
                  key={v.id}
                  style={{ ...cardBg(dark), border: "1px solid rgba(16,185,129,0.2)" }}
                  className="rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-emerald-500 font-bold text-lg font-mono">{v.plate}</div>
                      <div style={{ color: tx(dark).muted }} className="text-xs">
                        {v.year} {v.make} {v.model}
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl">🚛</span>
                    <div>
                      <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
                        {v.type}
                      </div>
                      <div style={{ color: tx(dark).muted }} className="text-xs">
                        Fuel: {v.fuel}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTabClick("booking")}
                    className="w-full py-2.5 rounded-xl text-sm font-bold"
                    style={{
                      background: dark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.12)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.3)",
                    }}
                  >
                    Book this Vehicle →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Booking Request ── */}
        {tab === "booking" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
                Request a Booking
              </h1>
              <p style={{ color: tx(dark).secondary }} className="text-sm mt-1">
                MTS will confirm within 2 business hours
              </p>
            </div>

            <InfoBox icon="💡" color="blue" title="How it works">
              Submit this form. MTS Operations reviews, assigns a vehicle and driver, then
              confirms via phone. You&apos;ll track it here once confirmed.
            </InfoBox>

            <div style={cardBg(dark)} className="rounded-2xl p-6 space-y-5">
              <div
                style={{
                  background: dark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
                className="rounded-xl p-4"
              >
                <div className="text-blue-400 font-semibold text-sm mb-1">Booking for</div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
                  {user.company}
                </div>
              </div>

              <FieldSelect
                label="Pickup Location"
                req
                value=""
                onChange={() => {}}
                options={[...PICKUP_POINTS]}
              />
              <FieldSelect
                label="Destination"
                req
                value=""
                onChange={() => {}}
                options={MOCK_ROUTES.map((r) => ({
                  value: r.id,
                  label: `${r.to}${r.crossBorder ? " 🌍" : ""}`,
                }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <FieldSelect
                  label="Container Type"
                  req
                  value=""
                  onChange={() => {}}
                  options={[...CONTAINER_TYPES]}
                />
                <FieldInput label="Weight (tonnes)" type="number" placeholder="e.g. 22.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Preferred Pickup Date" req type="date" />
                <FieldInput label="Preferred Time" type="time" />
              </div>

              <Divider label="Delivery Details" />

              <FieldTextarea label="Delivery Address" req rows={2} placeholder="Full address…" />
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Recipient Name" req placeholder="Full name" />
                <FieldInput label="Recipient Phone" req placeholder="+233-XX-XXX-XXXX" />
              </div>
              <FieldTextarea
                label="Additional Notes"
                rows={2}
                placeholder="Special handling, access instructions…"
              />

              <button
                style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}
                className="w-full py-3.5 rounded-xl text-white font-black text-sm"
              >
                Submit Booking Request →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shipment detail sub-view ─────────────────────────────────────────────────

function ShipmentDetail({
  trip,
  dark,
  onBack,
}: {
  trip: Trip;
  dark: boolean;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        style={{ color: tx(dark).muted }}
        className="text-sm flex items-center gap-1.5 hover:opacity-70"
      >
        ← My Shipments
      </button>
      <div className="grid grid-cols-3 gap-4">
        {/* Main */}
        <div style={cardBg(dark)} className="rounded-2xl p-6 col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-xl font-black">
                {trip.route}
              </h2>
              <div style={{ color: tx(dark).secondary }} className="text-sm">
                {trip.cargo} · {trip.weight} t
              </div>
            </div>
            <Badge status={trip.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {(
              [
                ["Booking", trip.booking],
                ["Waybill", trip.waybill],
                ["Amount", `₵${trip.amount.toLocaleString()}`],
                ["Date", trip.date],
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

          {/* Steps */}
          <div className="space-y-1.5">
            {TRIP_STEPS.map((stepLabel, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      i < trip.step
                        ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                        : i === trip.step
                        ? "rgba(59,130,246,0.2)"
                        : dark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.06)",
                    border: i === trip.step ? "2px solid #3b82f6" : "none",
                  }}
                >
                  {i < trip.step ? (
                    <span className="text-white text-xs font-bold">✓</span>
                  ) : i === trip.step ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse block" />
                  ) : (
                    <span style={{ color: tx(dark).muted }} className="text-xs">
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: i <= trip.step ? (dark ? "#f8fafc" : "#0f172a") : tx(dark).muted,
                    fontWeight: i === trip.step ? 700 : 400,
                  }}
                >
                  {stepLabel}
                </span>
                {i === trip.step && (
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side */}
        <div className="space-y-4">
          <div style={cardBg(dark)} className="rounded-2xl p-5">
            <h3
              style={{ color: dark ? "#fff" : "#0f172a" }}
              className="font-bold text-sm mb-3"
            >
              Delivery Details
            </h3>
            <div className="space-y-1 text-sm">
              <div style={{ color: tx(dark).secondary }}>{trip.deliveryAddr}</div>
              <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-semibold">
                {trip.recipientName}
              </div>
            </div>
          </div>
          <InfoBox icon="💬" color="blue" title="Need help?">
            Contact MTS at <strong>+233-30-000-0000</strong> quoting{" "}
            <strong>{trip.booking}</strong>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}
