"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cardBg, tx } from "@/lib/utils";
import {
  MOCK_VEHICLES,
  MOCK_DRIVERS,
  MOCK_CUSTOMERS,
} from "@/lib/data";
import { EXPENSE_TYPES } from "@/lib/constants";
import Badge from "@/components/ui/Badge";
import InfoBox from "@/components/ui/InfoBox";
import Modal from "@/components/ui/Modal";
import AddRouteForm from "@/components/forms/AddRouteForm";
import type { Expense, Route, Trip } from "@/types";

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export function AdminVehicles() {
  const { dark } = useTheme();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Vehicles
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            {MOCK_VEHICLES.length} in fleet
          </p>
        </div>
        <button
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_VEHICLES.map((v) => (
          <div key={v.id} style={cardBg(dark)} className="rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-amber-500 font-mono font-bold text-lg">{v.plate}</div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  {v.year} {v.make} {v.model}
                </div>
              </div>
              <Badge status={v.status} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🚛</span>
              <div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-sm font-semibold">
                  {v.type}
                </div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  {v.driver}
                </div>
              </div>
            </div>
            <div
              className="grid grid-cols-2 gap-3 pt-3"
              style={{
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Odometer
                </div>
                <div
                  style={{ color: dark ? "#fff" : "#0f172a", fontFamily: "monospace" }}
                  className="text-sm font-bold"
                >
                  {v.odometer.toLocaleString()} km
                </div>
              </div>
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Fuel
                </div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-sm font-bold">
                  {v.fuel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Drivers ──────────────────────────────────────────────────────────────────

export function AdminDrivers() {
  const { dark } = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="space-y-6">
      {showAdd && (
        <Modal
          title="Add New Driver"
          sub="Enter driver details and license information"
          onClose={() => setShowAdd(false)}
          wide
        >
          <AddDriverForm
            onSave={(d) => {}}
            onClose={() => setShowAdd(false)}
          />
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Drivers
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            {MOCK_DRIVERS.length} registered
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add Driver
        </button>
      </div>
      <div style={cardBg(dark)} className="rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              {["Driver", "Phone", "License", "Trips", "Rating", "Per Diem", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: tx(dark).muted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_DRIVERS.map((d) => (
              <tr
                key={d.id}
                style={{
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-xs"
                    >
                      {d.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span
                      style={{ color: dark ? "#fff" : "#0f172a" }}
                      className="text-sm font-medium"
                    >
                      {d.name}
                    </span>
                  </div>
                </td>
                <td style={{ color: tx(dark).secondary }} className="px-5 py-3 text-sm font-mono">
                  {d.phone}
                </td>
                <td style={{ color: tx(dark).muted }} className="px-5 py-3 text-xs font-mono">
                  {d.license}
                </td>
                <td style={{ color: dark ? "#fff" : "#0f172a" }} className="px-5 py-3 font-bold">
                  {d.trips}
                </td>
                <td className="px-5 py-3 text-amber-500 font-bold">★ {d.rating}</td>
                <td className="px-5 py-3 text-emerald-500 font-semibold text-sm">
                  ₵{d.perDiem}/day
                </td>
                <td className="px-5 py-3">
                  <Badge status={d.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function AdminCustomers() {
  const { dark } = useTheme();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Customers
          </h1>
        </div>
        <button
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add Customer
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_CUSTOMERS.map((c) => (
          <div key={c.id} style={cardBg(dark)} className="rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div
                style={{
                  background: dark
                    ? "rgba(251,191,36,0.12)"
                    : "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.2)",
                }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              >
                🏢
              </div>
              <div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
                  {c.name}
                </div>
                <div style={{ color: tx(dark).secondary }} className="text-xs">
                  {c.contact}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs mb-4" style={{ color: tx(dark).muted }}>
              <div>{c.phone}</div>
              <div>{c.email}</div>
            </div>
            <div
              className="grid grid-cols-2 gap-3 pt-3"
              style={{
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Trips
                </div>
                <div
                  style={{ color: dark ? "#fff" : "#0f172a" }}
                  className="font-bold text-lg"
                >
                  {c.trips}
                </div>
              </div>
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Total Value
                </div>
                <div className="text-emerald-500 font-bold text-sm">
                  ₵{c.totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

interface AdminExpensesProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  trips: Trip[];
  onNew: () => void;
}

export function AdminExpenses({ expenses, setExpenses, onNew }: AdminExpensesProps) {
  const { dark } = useTheme();
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered =
    typeFilter === "all" ? expenses : expenses.filter((e) => e.type === typeFilter);
  const total = filtered.reduce((s, e) => s + (e.amount || 0), 0);
  const pendingCount = expenses.filter((e) => !e.authorised).length;

  const fuelCards = [
    { icon: "⛽", label: "Fuel" },
    { icon: "💵", label: "Per Diem" },
    { icon: "🔧", label: "Maintenance" },
    { icon: "🛣", label: "Toll" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Expenses
          </h1>
        </div>
        <button
          onClick={onNew}
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Log Expense
        </button>
      </div>

      {pendingCount > 0 && (
        <InfoBox
          icon="🔒"
          color="amber"
          title={`${pendingCount} expense(s) pending authorisation`}
        >
          Review and approve before processing reimbursement.
        </InfoBox>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {fuelCards.map(({ icon, label }) => {
          const sum = expenses
            .filter((e) => e.type === label)
            .reduce((s, e) => s + (e.amount || 0), 0);
          return (
            <div key={label} style={cardBg(dark)} className="rounded-2xl p-5">
              <div className="text-2xl mb-2">{icon}</div>
              <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-xl font-black">
                ₵{sum.toLocaleString()}
              </div>
              <div style={{ color: tx(dark).muted }} className="text-xs mt-1">
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...EXPENSE_TYPES.slice(0, 6)].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border"
            style={{
              background: typeFilter === t ? "rgba(251,191,36,0.12)" : "transparent",
              borderColor:
                typeFilter === t
                  ? "rgba(251,191,36,0.3)"
                  : dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              color: typeFilter === t ? "#f59e0b" : tx(dark).secondary,
            }}
          >
            {t}
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
              {[
                "ID","Type","Vehicle","Driver","Trip","Receipt","Amount","Odometer","Auth","Date",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: tx(dark).muted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                style={{
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                <td className="px-4 py-3 text-amber-500 text-xs font-mono">{e.id}</td>
                <td className="px-4 py-3">
                  <span
                    style={{
                      background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                      color: tx(dark).secondary,
                    }}
                    className="text-xs px-2 py-0.5 rounded-lg"
                  >
                    {e.type}
                  </span>
                </td>
                <td style={{ color: tx(dark).secondary }} className="px-4 py-3 text-xs font-mono">
                  {e.vehicle}
                </td>
                <td style={{ color: dark ? "#fff" : "#0f172a" }} className="px-4 py-3 text-sm">
                  {e.driver}
                </td>
                <td className="px-4 py-3 text-amber-500 text-xs font-mono">
                  {e.tripId ?? "—"}
                </td>
                <td style={{ color: tx(dark).muted }} className="px-4 py-3 text-xs font-mono">
                  {e.receipt}
                </td>
                <td className="px-4 py-3 text-red-400 font-bold text-sm">
                  ₵{(e.amount || 0).toLocaleString()}
                </td>
                <td style={{ color: tx(dark).muted }} className="px-4 py-3 text-xs font-mono">
                  {e.odometer?.toLocaleString() ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {e.authorised ? (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      ✓ Auth
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setExpenses((prev) =>
                          prev.map((x) =>
                            x.id === e.id
                              ? { ...x, authorised: true, authorisedBy: "Ama Korantema" }
                              : x
                          )
                        )
                      }
                      className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full hover:bg-amber-500/20"
                    >
                      Approve
                    </button>
                  )}
                </td>
                <td style={{ color: tx(dark).muted }} className="px-4 py-3 text-xs">
                  {e.date}
                </td>
              </tr>
            ))}
            <tr
              style={{
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              <td
                colSpan={6}
                className="px-4 py-3 text-right text-sm font-semibold"
                style={{ color: tx(dark).secondary }}
              >
                Total
              </td>
              <td className="px-4 py-3 text-red-400 font-black text-base">
                ₵{total.toLocaleString()}
              </td>
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

import { MOCK_ROUTES } from "@/lib/data";
import AddDriverForm from "../forms/AddDriverForm";

export function AdminRoutes() {
  const { dark } = useTheme();
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      {showAdd && (
        <Modal
          title="Add New Route"
          sub="Set origin, destination & pricing matrix"
          onClose={() => setShowAdd(false)}
          wide
        >
          <AddRouteForm
            onSave={(r) => setRoutes((prev) => [...prev, r])}
            onClose={() => setShowAdd(false)}
          />
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Routes & Pricing
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            Price matrix by container type
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add Route
        </button>
      </div>

      <div style={cardBg(dark)} className="rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              {["Route", "km", "20ft", "30ft", "40ft", "Double", "Type", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: tx(dark).muted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                <td className="px-5 py-4">
                  <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-sm font-semibold">
                    {r.from}
                  </div>
                  <div style={{ color: tx(dark).muted }} className="text-xs">
                    → {r.to}
                  </div>
                </td>
                <td style={{ color: tx(dark).secondary }} className="px-5 py-4 text-sm">
                  {r.distance}
                </td>
                {[r.price20ft, r.price30ft, r.price40ft, r.priceDouble].map((p, i) => (
                  <td key={i} className="px-5 py-4 text-emerald-500 font-semibold text-sm">
                    ₵{p.toLocaleString()}
                  </td>
                ))}
                <td className="px-5 py-4">
                  {r.crossBorder ? (
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full">
                      🌍 International
                    </span>
                  ) : (
                    <span
                      style={{
                        background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                        color: tx(dark).muted,
                      }}
                      className="text-xs px-2 py-0.5 rounded-full"
                    >
                      Domestic
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <button
                    style={{
                      color: tx(dark).muted,
                      border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                    className="hover:text-amber-500 text-xs px-2 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────

const MOCK_STAFF = [
  { name: "Ama Korantema",  email: "ama@mtsfleet.com",   role: "Super Admin",        phone: "+233-24-555-0001", status: "Active",   lastLogin: "2025-02-28" },
  { name: "Kweku Boateng",  email: "kweku@mtsfleet.com",  role: "Operations Manager", phone: "+233-20-555-0002", status: "Active",   lastLogin: "2025-02-28" },
  { name: "Efua Mensah",    email: "efua@mtsfleet.com",   role: "Dispatcher",         phone: "+233-26-555-0003", status: "Active",   lastLogin: "2025-02-27" },
  { name: "Yaw Darko",      email: "yaw@mtsfleet.com",    role: "Finance",            phone: "+233-24-555-0004", status: "Inactive", lastLogin: "2025-02-15" },
];

export function AdminUsers() {
  const { dark } = useTheme();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            User Management
          </h1>
        </div>
        <button
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add User
        </button>
      </div>
      <div style={cardBg(dark)} className="rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              {["User", "Email", "Phone", "Role", "Last Login", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: tx(dark).muted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_STAFF.map((u, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    >
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span
                      style={{ color: dark ? "#fff" : "#0f172a" }}
                      className="text-sm font-medium"
                    >
                      {u.name}
                    </span>
                  </div>
                </td>
                <td style={{ color: tx(dark).secondary }} className="px-5 py-3 text-sm">
                  {u.email}
                </td>
                <td style={{ color: tx(dark).muted }} className="px-5 py-3 text-xs font-mono">
                  {u.phone}
                </td>
                <td className="px-5 py-3">
                  <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs px-2 py-0.5 rounded-full">
                    {u.role}
                  </span>
                </td>
                <td style={{ color: tx(dark).muted }} className="px-5 py-3 text-xs">
                  {u.lastLogin}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      u.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : ""
                    }`}
                    style={
                      u.status !== "Active"
                        ? {
                            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                            color: tx(dark).muted,
                            border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                            opacity: 0.6,
                          }
                        : {}
                    }
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
