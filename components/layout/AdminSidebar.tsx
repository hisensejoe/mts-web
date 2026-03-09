"use client";

import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";

export type AdminPage =
  | "dashboard"
  | "trips"
  | "vehicles"
  | "drivers"
  | "customers"
  | "expenses"
  | "routes"
  | "users";

interface AdminSidebarProps {
  active: AdminPage;
  setActive: (p: AdminPage) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: AdminPage; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⊞",  label: "Dashboard"        },
  { id: "trips",     icon: "🗺",  label: "Trips"            },
  { id: "vehicles",  icon: "🚛",  label: "Vehicles"         },
  { id: "drivers",   icon: "👤",  label: "Drivers"          },
  { id: "customers", icon: "🏢",  label: "Customers"        },
  { id: "expenses",  icon: "💳",  label: "Expenses"         },
  { id: "routes",    icon: "📍",  label: "Routes & Pricing" },
  { id: "users",     icon: "👥",  label: "User Management"  },
];

export default function AdminSidebar({
  active,
  setActive,
  collapsed,
  setCollapsed,
  onLogout,
}: AdminSidebarProps) {
  const { dark } = useTheme();

  return (
    <aside
      style={{
        background: dark
          ? "linear-gradient(180deg,#0f172a,#0d1526)"
          : "linear-gradient(180deg,#1e3a5f,#162e4a)",
        borderRight: dark
          ? "1px solid rgba(251,191,36,0.08)"
          : "1px solid rgba(255,255,255,0.08)",
        width: collapsed ? 72 : 240,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Logo */}
      <div
        className="p-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", flexShrink: 0 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
        >
          <span className="text-black font-black text-lg">M</span>
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-black text-base tracking-tight leading-none">
              MTS Fleet
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Admin Console</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-slate-300 text-lg flex-shrink-0"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
            style={{
              background:
                active === item.id
                  ? "linear-gradient(135deg,rgba(251,191,36,0.15),rgba(217,119,6,0.1))"
                  : "transparent",
              borderLeft:
                active === item.id ? "3px solid #f59e0b" : "3px solid transparent",
            }}
          >
            <span
              className="text-lg flex-shrink-0"
              style={{
                filter:
                  active === item.id ? "none" : "grayscale(0.5) opacity(0.6)",
              }}
            >
              {item.icon}
            </span>
            {!collapsed && (
              <span
                className="text-sm font-medium"
                style={{ color: active === item.id ? "#fbbf24" : "#94a3b8" }}
              >
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div
        className="p-3 space-y-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3 px-2 py-2">
          <div
            style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              flexShrink: 0,
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
          >
            <span className="text-black text-sm font-bold">AK</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">
                Ama Korantema
              </div>
              <div className="text-slate-500 text-xs">Super Admin</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 text-xs"
          >
            <span>⎋</span>
            <span>Sign out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
