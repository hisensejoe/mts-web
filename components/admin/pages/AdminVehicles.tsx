import AddVehicleForm from "@/components/forms/AddVehicleForm";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useTheme } from "@/context/ThemeContext";
import axiosInstance from "@/lib/axios";
import { cardBg, tx } from "@/lib/utils";
import { PagedData, Vehicle } from "@/types";
import { useEffect, useState } from "react";

export function AdminVehicles() {
  const { dark } = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // get driver list from api call /api/v1/drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<PagedData<Vehicle>>("/api/v1/vehicles");
      const vehicles = res.data.items;
      console.log("API response for drivers:", res.data);
      console.log("Fetched drivers:", vehicles);
      setVehicles(vehicles ?? []);
    } catch (error) {
      setVehicles([]); // Clear drivers on error
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
                  <AddVehicleForm
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
            Vehicles
          </h1>
          <p style={{ color: tx(dark).secondary }} className="text-sm">
            {vehicles.length} in fleet
          </p>
        </div>
        <button
            onClick={() => setShowAdd(true)}
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add Vehicle
        </button>
      </div>
      {loading && (
              <div> <div className="flex items-center justify-center py-10"> <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div> </div> </div>
            )}
            {!loading && vehicles.length === 0 && (
                <div className="flex items-center justify-center py-10">
  <div
    className="text-center"
    style={{ color: tx(dark).secondary }}
  >
    No vehicles found. Click "Add Vehicle" to create one.
  </div>
</div>
            )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!loading && vehicles.length > 0 && vehicles.map((v) => (
          <div key={v.id} style={cardBg(dark)} className="rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-amber-500 font-mono font-bold text-lg">
                  {v.registrationNumber}
                </div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  {v.manufactureYear} {v.make} {v.model}
                </div>
              </div>
              <Badge status={v.status} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🚛</span>
              <div>
                <div
                  style={{ color: dark ? "#fff" : "#0f172a" }}
                  className="text-sm font-semibold"
                >
                  {v.fuelType}
                </div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  {v.assignedDriverId}
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
                  style={{
                    color: dark ? "#fff" : "#0f172a",
                    fontFamily: "monospace",
                  }}
                  className="text-sm font-bold"
                >
                  {v.odometerKm} km
                </div>
              </div>
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Fuel
                </div>
                <div
                  style={{ color: dark ? "#fff" : "#0f172a" }}
                  className="text-sm font-bold"
                >
                  {v.fuelType}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
