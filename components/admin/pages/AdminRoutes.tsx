import { MOCK_ROUTES } from "@/lib/data";
import { useTheme } from "@/context/ThemeContext";
import { Route } from "@/types/index";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import AddRouteForm from "@/components/forms/AddRouteForm";
import { cardBg, tx } from "@/lib/utils";

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