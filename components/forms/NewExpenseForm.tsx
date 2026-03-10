"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx, genId, today, nowT } from "@/lib/utils";
import { INITIAL_TRIPS } from "@/lib/data";
import { EXPENSE_TYPES, FUEL_STATIONS, WITNESS_OPTIONS } from "@/lib/constants";
import { FieldInput, FieldSelect, FieldTextarea, FieldLabel } from "@/components/ui/FormFields";
import Divider from "@/components/ui/Divider";
import SectionHead from "@/components/ui/SectionHead";
import InfoBox from "@/components/ui/InfoBox";
import type { Driver, Expense, PagedData, Trip, Vehicle } from "@/types";
import axiosInstance from "@/lib/axios";

interface NewExpenseFormProps {
  onSave: (expense: Expense) => void;
  onClose: () => void;
  trips?: Trip[];
}

export default function NewExpenseForm({ onSave, onClose, trips }: NewExpenseFormProps) {
  const { dark } = useTheme();
  const [saved, setSaved] = useState(false);

  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [tripId, setTripId] = useState("");
  const [expType, setExpType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [time, setTime] = useState(nowT());
  const [odometer, setOdometer] = useState("");
  const [odomAfter, setOdomAfter] = useState("");
  const [litres, setLitres] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [station, setStation] = useState("");
  const [receipt, setReceipt] = useState("");
  const [witness, setWitness] = useState("");
  const [gps, setGps] = useState(false);
  const [notes, setNotes] = useState("");


  // get vehicles list from api call /api/v1/vehicles
  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const res = await axiosInstance.get<PagedData<Vehicle>>("/api/v1/vehicles");
      const vehicles = res.data.items;
      console.log("API response for vehicles:", res.data);
      console.log("Fetched vehicles:", vehicles);
      setVehicles(vehicles ?? []);
    } catch (error) {
      setVehicles([]); // Clear drivers on error
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoadingVehicles(false);
    }
  };

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
    fetchVehicles();
    fetchDrivers();
  }, []);

  // const selV = MOCK_VEHICLES.find((v) => v.id === vehicleId);
  // const effD =
  //   MOCK_DRIVERS.find((d) => d.id === driverId) ??
  //   (selV ? MOCK_DRIVERS.find((d) => d.id === selV.driverId) : undefined);

  const isFuel = expType === "Fuel";
  const calcAmt =
    isFuel && litres && unitPrice
      ? (parseFloat(litres) * parseFloat(unitPrice)).toFixed(2)
      : "";
  const kmDriven =
    odometer && odomAfter ? parseInt(odomAfter) - parseInt(odometer) : null;
  const kpl =
    isFuel && litres && kmDriven && kmDriven > 0
      ? (kmDriven / parseFloat(litres)).toFixed(1)
      : null;

  const handleVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleId(e.target.value);
    const v = vehicles.find((x) => x.id === e.target.value);
    if (v?.id) setDriverId(v.id);
    if (v) setOdometer(String(v.odometerKm));
  };

  const canSave = !!(vehicleId && expType && date && receipt && (amount || calcAmt));

  const handleSave = () => {
    const exp: Expense = {
      id: genId("EXP"),
      type: expType,
      vehicleId,
      vehicle:  "",
      driverId:  null,
      driver: "—",
      tripId: tripId || null,
      amount: parseFloat(amount || calcAmt),
      date,
      time,
      odometer: odometer ? parseInt(odometer) : null,
      odometerAfter: odomAfter ? parseInt(odomAfter) : null,
      litres: litres ? parseFloat(litres) : null,
      unitPrice: unitPrice ? parseFloat(unitPrice) : null,
      station: station || null,
      receipt,
      notes,
      authorised: false,
      authorisedBy: "",
      secondWitness: witness,
      gpsConfirmed: gps,
    };
    onSave(exp);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  if (saved) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <div className="text-emerald-400 font-black text-xl mb-2">Expense Logged</div>
        <div style={{ color: tx(dark).secondary }} className="text-sm">
          Pending authorisation
        </div>
      </div>
    );
  }

  const activeTripList = (trips ?? INITIAL_TRIPS).filter(
    (t) => t.status !== "Cancelled" && t.status !== "Back at Base"
  );

  return (
    <div className="space-y-5">
      <SectionHead icon="🚛" title="Vehicle & Driver" sub="Select vehicle — driver auto-fills from default" />
      <div className="grid grid-cols-2 gap-4">
        <FieldSelect
          label="Vehicle"
          req
          value={vehicleId}
          onChange={handleVehicle}
          options={vehicles.map((v) => ({ value: v.id, label: `${v.registrationNumber} – ${v.fuelType}` }))}
        />
        <FieldSelect
          label="Driver"
          hint="Auto from vehicle"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          options={drivers.map((d) => ({ value: d.id, label: d.fullName }))}
        />
      </div>

      {/* {effD && (
        <div
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          }}
          className="rounded-xl p-3 flex items-center gap-3 text-xs"
        >
          <div
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-black font-black text-sm flex-shrink-0"
          >
            {effD.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div style={{ color: tx(dark).muted }}>
            <strong style={{ color: dark ? "#fff" : "#0f172a" }}>{effD.name}</strong> · Per
            diem: <span className="text-emerald-500 font-bold">₵{effD.perDiem}/day</span> · ★
            {effD.rating}
          </div>
        </div>
      )} */}

      <FieldSelect
        label="Link to Trip"
        hint="Optional"
        value={tripId}
        onChange={(e) => setTripId(e.target.value)}
        options={activeTripList.map((t) => ({
          value: t.id,
          label: `${t.id} – ${t.route} (${t.driver})`,
        }))}
      />

      <Divider label="Expense Details" />
      <SectionHead icon="💳" title="Cost Type & Amount" sub="Type, amount, and verification reference" color="green" />

      <div className="grid grid-cols-2 gap-4">
        <FieldSelect
          label="Expense Type"
          req
          value={expType}
          onChange={(e) => setExpType(e.target.value)}
          options={[...EXPENSE_TYPES]}
        />
        <FieldInput label="Date" req type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <FieldInput label="Time of Expense" type="time" value={time} onChange={(e) => setTime(e.target.value)} />

      {/* Fuel details */}
      {isFuel && (
        <div
          className="space-y-4 p-4 rounded-xl"
          style={{
            background: dark ? "rgba(251,191,36,0.04)" : "rgba(251,191,36,0.06)",
            border: "1px solid rgba(251,191,36,0.15)",
          }}
        >
          <div className="text-amber-500 font-bold text-xs uppercase tracking-wider">
            ⛽ Fuel Details
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FieldInput
              label="Litres"
              req
              type="number"
              placeholder="0.0"
              min="0"
              value={litres}
              onChange={(e) => setLitres(e.target.value)}
            />
            <FieldInput
              label="Price / Litre (₵)"
              req
              prefix="₵"
              type="number"
              placeholder="0.00"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <div>
              <FieldLabel label="Calc. Amount" />
              <div
                style={{
                  background: dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  color: "#10b981",
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-black"
              >
                {calcAmt ? `₵${parseFloat(calcAmt).toLocaleString()}` : "—"}
              </div>
            </div>
          </div>
          <FieldSelect
            label="Fuel Station"
            req
            value={station}
            onChange={(e) => setStation(e.target.value)}
            options={[...FUEL_STATIONS]}
          />
          {kpl && (
            <div
              style={{
                background: dark ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
              className="rounded-xl p-3 text-xs text-blue-400"
            >
              <strong>{kpl} km/L</strong> efficiency · {kmDriven} km between readings
            </div>
          )}
        </div>
      )}

      {!isFuel && (
        <FieldInput
          label="Amount (₵)"
          req
          prefix="₵"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      )}

      <Divider label="Odometer Readings  ·  Anti-Theft" />
      <div className="grid grid-cols-2 gap-4">
        <FieldInput
          label="Odometer Before"
          hint="km reading now"
          req={isFuel}
          prefix="km"
          type="number"
          placeholder={"0"}
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
        />
        <FieldInput
          label="Odometer After"
          hint={isFuel ? "after fuelling" : "at return"}
          prefix="km"
          type="number"
          placeholder="—"
          value={odomAfter}
          onChange={(e) => setOdomAfter(e.target.value)}
        />
      </div>
      {kmDriven !== null && kmDriven < 0 && (
        <InfoBox icon="⚠️" color="red">
          Odometer after is lower than before — verify readings before saving.
        </InfoBox>
      )}
      {kmDriven !== null && kmDriven > 800 && (
        <InfoBox icon="⚠️" color="amber">
          Large range ({kmDriven} km) between readings. Confirm this is correct.
        </InfoBox>
      )}

      <Divider label="Verification & Reference" />
      <div className="grid grid-cols-2 gap-4">
        <FieldInput
          label="Receipt / Invoice No."
          req
          placeholder="e.g. RCP-001234"
          value={receipt}
          onChange={(e) => setReceipt(e.target.value)}
        />
        <FieldSelect
          label="Second Witness / Verifier"
          hint="Recommended for large amounts"
          value={witness}
          onChange={(e) => setWitness(e.target.value)}
          options={[...WITNESS_OPTIONS]}
        />
      </div>

      {/* GPS checkbox */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
        style={{
          background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        }}
        onClick={() => setGps((g) => !g)}
      >
        <div
          style={{
            background: gps
              ? "linear-gradient(135deg,#10b981,#059669)"
              : dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
        >
          {gps && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <div>
          <div style={{ color: dark ? "#fff" : "#0f172a" }} className="text-sm font-semibold">
            GPS location confirmed at time of expense
          </div>
          <div style={{ color: tx(dark).muted }} className="text-xs">
            Tick if driver location matches the station / checkpoint
          </div>
        </div>
      </div>

      <FieldTextarea
        label="Additional Notes"
        hint="Optional"
        rows={2}
        placeholder="Context, breakdown description, checkpoint name…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {parseFloat(amount || calcAmt) > 2000 && (
        <InfoBox icon="🔒" color="red" title="High-Value Expense">
          Amounts over ₵2,000 require Super Admin authorisation before reimbursement.
        </InfoBox>
      )}

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
            background: canSave ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(251,191,36,0.2)",
            color: canSave ? "#000" : tx(dark).secondary,
          }}
          className="flex-1 py-3 rounded-xl font-black text-sm disabled:cursor-not-allowed"
        >
          Log Expense →
        </button>
      </div>
    </div>
  );
}
