"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cardBg, tx } from "@/lib/utils";
import { MOCK_VEHICLES } from "@/lib/data";
import TripProgress from "@/components/ui/TripProgress";
import Badge from "@/components/ui/Badge";
import type { Trip } from "@/types";

interface AdminDashboardProps {
  trips: Trip[];
  onNewTrip: () => void;
}

const PERIODS = ["daily", "weekly", "monthly", "yearly"] as const;

export default function AdminDashboard({ trips, onNewTrip }: AdminDashboardProps) {
  const { dark } = useTheme();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("monthly");

  const stats = [
    { label: "Total Trips",  value: trips.length,                                                                   icon: "🗺",  c: "from-amber-500 to-orange-500"  },
    { label: "Active",       value: trips.filter((t) => t.status !== "Cancelled" && t.status !== "Back at Base").length, icon: "🚛",  c: "from-blue-500 to-cyan-500"     },
    { label: "Fleet",        value: MOCK_VEHICLES.length,                                                            icon: "🚚",  c: "from-purple-500 to-pink-500"   },
    { label: "Revenue",      value: "₵84,200",                                                                       icon: "💰",  c: "from-yellow-500 to-amber-500"  },
    { label: "Expenses",     value: "₵18,450",                                                                       icon: "💳",  c: "from-red-500 to-rose-500"      },
    { label: "Cancelled",    value: trips.filter((t) => t.status === "Cancelled").length,                            icon: "🚫",  c: "from-slate-500 to-slate-600"   },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Operations Dashboard
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            Friday, 28 February 2025
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex p-1 rounded-xl"
            style={{
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize"
                style={{
                  background:
                    p === period ? "linear-gradient(135deg,#f59e0b,#d97706)" : "transparent",
                  color: p === period ? "#000" : tx(dark).secondary,
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={onNewTrip}
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            className="px-4 py-2 rounded-xl text-black text-sm font-bold"
          >
            + New Trip
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} style={cardBg(dark)} className="rounded-2xl p-5">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-lg shadow-lg mb-4`}
            >
              {s.icon}
            </div>
            <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black mb-1">
              {s.value}
            </div>
            <div style={{ color: tx(dark).secondary }} className="text-xs font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent trips table */}
      <div style={cardBg(dark)} className="rounded-2xl overflow-hidden">
        <div
          className="flex items-center justify-between p-5"
          style={{
            borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          <h3 style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
            Recent Trips
          </h3>
          <span style={{ color: tx(dark).muted }} className="text-xs">
            {trips.length} trips
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                {["ID", "Driver", "Route", "Customer", "Progress", "Amount", "Status"].map(
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
              {trips.map((t) => (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                    opacity: t.status === "Cancelled" ? 0.5 : 1,
                  }}
                >
                  <td className="px-4 py-3 text-amber-500 text-sm font-mono font-semibold">
                    {t.id}
                  </td>
                  <td
                    style={{ color: dark ? "#fff" : "#0f172a" }}
                    className="px-4 py-3 text-sm"
                  >
                    {t.driver}
                  </td>
                  <td
                    style={{ color: tx(dark).secondary }}
                    className="px-4 py-3 text-xs max-w-[120px] truncate"
                  >
                    {t.route}
                  </td>
                  <td
                    style={{ color: dark ? "#cbd5e1" : "#475569" }}
                    className="px-4 py-3 text-sm"
                  >
                    {t.customer}
                  </td>
                  <td className="px-4 py-3 w-32">
                    <TripProgress step={t.step} cancelled={t.status === "Cancelled"} />
                  </td>
                  <td className="px-4 py-3 text-emerald-500 text-sm font-semibold">
                    ₵{t.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
