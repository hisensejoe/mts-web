import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import { Driver, Vehicle } from "@/types";
import { useEffect, useState } from "react";
import SectionHead from "../ui/SectionHead";
import axiosInstance from "@/lib/axios";
import { FieldInput, FieldSelect } from "../ui/FormFields";
import { MOCK_FUEL_TYPES, MOCK_STATUS } from "@/lib/data";

interface FormRequest {
  registrationNumber?: string;
  manufactureYear?: string;
  fuelType?: string;
  odometerKm?: string;
  status?: string;
  assignedDriverId?: string;
}

interface AddVehicleFormProps {
  onSave: (vehicle: Vehicle) => void;
  onClose: () => void;
}

export default function AddVehicleForm({
  onSave,
  onClose,
}: AddVehicleFormProps) {
  const { dark } = useTheme();
  const [saved, setSaved] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formInputs, setFormInputs] = useState<FormRequest>({
    registrationNumber: "",
    manufactureYear: "",
    fuelType: "",
    odometerKm: "",
    status: "",
    assignedDriverId: "",
  });

  // get all drivers from api call /api/v1/drivers
  const fetchDrivers = async () => {
    try {
      setLoadingDrivers(true);
      const res = await axiosInstance.get<{ items: Driver[] }>(
        "/api/v1/drivers",
      );
      setDrivers(res.data.items ?? []);
    } catch (error) {
      setDrivers([]); // Clear drivers on error
      console.error("Error fetching drivers:", error);
    } finally {
      setLoadingDrivers(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const canSave = !!(formInputs.registrationNumber && formInputs.fuelType && formInputs.manufactureYear);
  // handle save api call
  const handleSave = async () => {
    const response = await axiosInstance.post<Vehicle>("/api/v1/vehicles", {
      registration_number: formInputs.registrationNumber,
      manufacture_year: formInputs.manufactureYear,
      fuel_type: formInputs.fuelType,
      odometer_km: formInputs.odometerKm,
      status: formInputs.status,
      assigned_driver_id: formInputs.assignedDriverId,
    });
    onSave(response.data);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  if (saved) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">✅</div>
        <div className="text-emerald-400 font-black text-xl">Driver Added!</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHead
        icon="🚛"
        title="Vehicle Identification"
        sub="Basic identifiers used to uniquely recognize the vehicle."
      />
      <div className="grid grid-cols-2 gap-4">
        <FieldInput
          label="Registration Number"
          req
          placeholder="Vehicle Registration Number"
          value={formInputs.registrationNumber}
          onChange={(e) =>
            setFormInputs({ ...formInputs, registrationNumber: e.target.value })
          }
        />
        <FieldInput
          label="Manufactured Year"
          req
          placeholder="Year of manufacture"
          value={formInputs.manufactureYear}
          onChange={(e) =>
            setFormInputs({ ...formInputs, manufactureYear: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FieldSelect
          label="Fuel Type"
          req
          value={formInputs.fuelType}
          onChange={(e) =>
            setFormInputs({ ...formInputs, fuelType: e.target.value })
          }
          options={MOCK_FUEL_TYPES.map((v) => ({
            value: v.type,
            label: `${v.name}`,
          }))}
        />
        <FieldInput
          label="Odometer Reading"
          hint="km reading now"
          prefix="km "
          type="number"
          placeholder="Vehicles odometer reading in kilometers"
          value={formInputs.odometerKm}
          onChange={(e) =>
            setFormInputs({ ...formInputs, odometerKm: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldSelect
          label="Assigned Driver"
          loading={loadingDrivers}
          req
          value={formInputs.assignedDriverId}
          onChange={(e) =>
            setFormInputs({ ...formInputs, assignedDriverId: e.target.value })
          }
          options={drivers.map((v) => ({
            value: v.id,
            label: `${v.fullName} – ${v.licenseNumber}`,
          }))}
        />
        <FieldSelect
          label="Vehicle Status"
          req
          value={formInputs.status}
          onChange={(e) =>
            setFormInputs({ ...formInputs, status: e.target.value })
          }
          options={MOCK_STATUS.map((v) => ({
            value: v.status,
            label: `${v.name}`,
          }))}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          style={{
            background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            color: tx(dark).secondary,
          }}
          className="px-5 py-3 rounded-xl font-semibold text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            background: canSave
              ? "linear-gradient(135deg,#f59e0b,#d97706)"
              : "rgba(251,191,36,0.2)",
            color: canSave ? "#000" : tx(dark).secondary,
          }}
          className="flex-1 py-3 rounded-xl font-black text-sm disabled:cursor-not-allowed"
        >
          Create Vehicle →
        </button>
      </div>
    </div>
  );
}
