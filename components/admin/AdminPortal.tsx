"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import { INITIAL_TRIPS, INITIAL_EXPENSES } from "@/lib/data";
import AdminSidebar, { AdminPage } from "@/components/layout/AdminSidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Modal from "@/components/ui/Modal";
import NewTripWizard from "@/components/forms/NewTripWizard";
import NewExpenseForm from "@/components/forms/NewExpenseForm";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminTrips from "@/components/admin/AdminTrips";
import {
  AdminVehicles,
  AdminDrivers,
  AdminCustomers,
  AdminExpenses,
  AdminRoutes,
  AdminUsers,
} from "@/components/admin/AdminPages";
import type { Trip, Expense } from "@/types";

type ModalKind = "trip" | "expense" | null;

interface AdminPortalProps {
  onLogout: () => void;
}

export default function AdminPortal({ onLogout }: AdminPortalProps) {
  const { dark } = useTheme();
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  const activeCount = trips.filter(
    (t) => t.status !== "Cancelled" && t.status !== "Back at Base"
  ).length;

  const mainBg = dark
    ? "radial-gradient(ellipse at 20% 0%,rgba(251,191,36,0.03),transparent 60%),#080f1e"
    : "radial-gradient(ellipse at 20% 0%,rgba(59,130,246,0.05),transparent 60%),#eef2ff";

  const pages: Record<AdminPage, React.ReactNode> = {
    dashboard: (
      <AdminDashboard trips={trips} onNewTrip={() => setModal("trip")} />
    ),
    trips: (
      <AdminTrips trips={trips} setTrips={setTrips} onNewTrip={() => setModal("trip")} />
    ),
    vehicles:  <AdminVehicles />,
    drivers:   <AdminDrivers />,
    customers: <AdminCustomers />,
    expenses: (
      <AdminExpenses
        expenses={expenses}
        setExpenses={setExpenses}
        trips={trips}
        onNew={() => setModal("expense")}
      />
    ),
    routes: <AdminRoutes />,
    users:  <AdminUsers />,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        active={activePage}
        setActive={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-y-auto" style={{ background: mainBg }}>
        {/* Topbar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            background: dark ? "rgba(8,15,30,0.88)" : "rgba(238,242,255,0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)"}`,
          }}
        >
          <div style={{ color: tx(dark).secondary }} className="text-sm capitalize font-medium">
            {activePage.replace("-", " ")}
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{
                background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-500 font-semibold">
                {activeCount} Active Trip{activeCount !== 1 ? "s" : ""}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="p-6">{pages[activePage]}</div>
      </main>

      {/* Modals */}
      {modal === "trip" && (
        <Modal
          title="Create New Trip"
          sub="4-step wizard: pickup · package · driver · delivery"
          onClose={() => setModal(null)}
          wide
        >
          <NewTripWizard
            onSave={(t) => setTrips((prev) => [t, ...prev])}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal === "expense" && (
        <Modal
          title="Log Expense"
          sub="Full details with anti-theft verification controls"
          onClose={() => setModal(null)}
          wide
        >
          <NewExpenseForm
            onSave={(e) => setExpenses((prev) => [e, ...prev])}
            onClose={() => setModal(null)}
            trips={trips}
          />
        </Modal>
      )}
    </div>
  );
}
