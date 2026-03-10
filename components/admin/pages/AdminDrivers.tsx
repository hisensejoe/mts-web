import AddDriverForm from "@/components/forms/AddDriverForm";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useTheme } from "@/context/ThemeContext";
import axiosInstance from "@/lib/axios";
import { cardBg, tx } from "@/lib/utils";
import { Driver, PagedData } from "@/types";
import { useEffect, useState } from "react";

export function AdminDrivers() {
  const { dark } = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // get driver list from api call /api/v1/drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<PagedData<Driver>>("/api/v1/drivers");
      const drivers0 = res.data.items;
      console.log("API response for drivers:", res.data);
      console.log("Fetched drivers:", drivers0);
      setDrivers(drivers0 ?? []);
    } catch (error) {
      setDrivers([]); // Clear drivers on error
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle get driver list from api call
  useEffect(() => {
    fetchDrivers();
  }, []);

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
            onSave={(d) => {
              fetchDrivers();
            }}
            onClose={() => setShowAdd(false)}
          />
        </Modal>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ color: dark ? "#fff" : "#0f172a" }}
            className="text-2xl font-black"
          >
            Drivers
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            {drivers.length} registered
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
              {[
                "Driver",
                "Phone",
                "License",
                "Trips",
                "Rating",
                "Per Diem",
                "Status",
              ].map((h) => (
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
            {loading && (
              <tr>
                <td colSpan={100}>
                  <div className="flex items-center justify-center py-10">
                    <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            )}
            {!loading && drivers.length === 0 && (
              <tr>
                <td colSpan={100}>
                  <div
                    className="text-center py-10"
                    style={{ color: tx(dark).secondary }}
                  >
                    No drivers found. Click "Add Driver" to create one.
                  </div>
                </td>
              </tr>
            )}
            {!loading &&
              drivers.length > 0 &&
              drivers.map((d) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                  }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          background: "linear-gradient(135deg,#f59e0b,#d97706)",
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-xs"
                      >
                        {d.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span
                        style={{ color: dark ? "#fff" : "#0f172a" }}
                        className="text-sm font-medium"
                      >
                        {d.fullName}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{ color: tx(dark).secondary }}
                    className="px-5 py-3 text-sm font-mono"
                  >
                    {d.phone}
                  </td>
                  <td
                    style={{ color: tx(dark).muted }}
                    className="px-5 py-3 text-xs font-mono"
                  >
                    {d.licenseNumber}
                  </td>
                  <td
                    style={{ color: dark ? "#fff" : "#0f172a" }}
                    className="px-5 py-3 font-bold"
                  >
                    {d.status}
                  </td>
                  <td className="px-5 py-3 text-amber-500 font-bold">
                    ★ {d.rating}
                  </td>
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
