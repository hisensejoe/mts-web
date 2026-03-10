"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import { genId, genWB, genBK, today, nowT, routePrice } from "@/lib/utils";
import {
  MOCK_ROUTES,
  MOCK_CUSTOMERS,
} from "@/lib/data";
import { CONTAINER_TYPES, PICKUP_POINTS } from "@/lib/constants";
import {
  FieldInput,
  FieldSelect,
  FieldTextarea,
} from "@/components/ui/FormFields";
import Divider from "@/components/ui/Divider";
import SectionHead from "@/components/ui/SectionHead";
import InfoBox from "@/components/ui/InfoBox";
import Badge from "@/components/ui/Badge";
import type { Driver, Trip, Vehicle } from "@/types";

interface NewTripWizardProps {
  onSave: (trip: Trip) => void;
  onClose: () => void;
}

const STEPS = ["Pickup & Customer", "Package & Pricing", "Driver & Vehicle", "Delivery Info"];

export default function NewTripWizard({ onSave, onClose }: NewTripWizardProps) {
  const { dark } = useTheme();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  // Step 1
  const [custId, setCustId] = useState("");
  const [pickup, setPickup] = useState("");
  const [departDate, setDepartDate] = useState(today());
  const [departTime, setDepartTime] = useState(nowT());
  const [contactOverride, setContactOverride] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");

  // Step 2
  const [waybill] = useState(genWB());
  const [booking] = useState(genBK());
  const [cType, setCType] = useState("");
  const [cOther, setCOther] = useState("");
  const [weight, setWeight] = useState("");
  const [routeId, setRouteId] = useState("");
  const [priceMode, setPriceMode] = useState<"route" | "manual">("route");
  const [manualPrice, setManualPrice] = useState("");

  // Step 3
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [driverInst, setDriverInst] = useState("");
  const [estReturn, setEstReturn] = useState("");

  // Step 4
  const [deliveryAddr, setDeliveryAddr] = useState("");
  const [recName, setRecName] = useState("");
  const [recPhone, setRecPhone] = useState("");
  const [delivNotes, setDelivNotes] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

  const selRoute   = MOCK_ROUTES.find((r) => r.id === routeId);
  const selVehicle = vehicles.find((v) => v.id === vehicleId);
  const selCustomer= MOCK_CUSTOMERS.find((c) => c.id === custId);
  const selDriver  =
    drivers.find((d) => d.id === driverId) ??
    (selVehicle ? drivers.find((d) => d.id === selVehicle.id) : undefined);

  const rPrice = selRoute ? routePrice(selRoute, cType) : 0;
  const finalPrice = priceMode === "route" ? rPrice : parseFloat(manualPrice || "0");

  const handleVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleId(e.target.value);
    const v = vehicles.find((x) => x.id === e.target.value);
    if (v?.id && !driverId) setDriverId(v.id);
  };

  const can = [
    !!custId && !!pickup && !!departDate,
    !!cType && !!routeId && (priceMode === "manual" ? !!manualPrice : true),
    !!vehicleId,
    !!deliveryAddr && !!recName && !!recPhone,
  ];

  const handleSave = () => {
    const trip: Trip = {
      id: genId("TRP"),
      driver: selDriver?.fullName ?? "",
      driverId: selDriver?.id ?? null,
      vehicle: selVehicle?.registrationNumber ?? "",
      vehicleId,
      route: selRoute ? `${selRoute.from} → ${selRoute.to}` : "",
      routeId,
      customer: selCustomer?.name ?? "",
      customerId: custId,
      status: "Depart Base",
      step: 0,
      date: departDate,
      departDate,
      departTime,
      amount: finalPrice,
      cargo: cType === "Other (specify)" ? cOther : cType,
      waybill,
      booking,
      weight,
      cancelledAt: null,
      cancelReason: null,
      cancelNote: "",
      cancelledBy: "",
      deliveryAddr,
      recipientName: recName,
      recipientPhone: recPhone,
      driverInstructions: driverInst,
      priceMode,
    };
    onSave(trip);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  if (saved) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <div className="text-emerald-400 font-black text-xl mb-2">Trip Created!</div>
        <div style={{ color: tx(dark).secondary }} className="text-sm">
          Waybill <strong className="text-amber-400">{waybill}</strong> · Booking{" "}
          <strong className="text-blue-400">{booking}</strong>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            className="flex-1 text-left"
          >
            <div
              className="h-1 rounded-full mb-1.5"
              style={{
                background:
                  i <= step
                    ? "linear-gradient(90deg,#f59e0b,#d97706)"
                    : dark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
              }}
            />
            <div
              className="text-xs font-semibold truncate"
              style={{ color: i === step ? "#f59e0b" : tx(dark).muted }}
            >
              {i + 1}. {s}
            </div>
          </button>
        ))}
      </div>

      {/* ── Step 0: Pickup & Customer ── */}
      {step === 0 && (
        <div className="space-y-4">
          <SectionHead icon="🏢" title="Pickup & Customer Details" sub="Who's booking and where we're collecting from" />
          <FieldSelect
            label="Customer / Company"
            req
            value={custId}
            onChange={(e) => setCustId(e.target.value)}
            options={MOCK_CUSTOMERS.map((c) => ({ value: c.id, label: `${c.name} – ${c.contact}` }))}
          />
          {selCustomer && (
            <div
              style={{
                background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              }}
              className="rounded-xl p-3 text-xs space-y-1"
            >
              <div style={{ color: tx(dark).muted }}>
                Contact:{" "}
                <span style={{ color: dark ? "#fff" : "#0f172a" }} className="font-semibold">
                  {selCustomer.contact}
                </span>{" "}
                · {selCustomer.phone}
              </div>
              <div style={{ color: tx(dark).muted }}>Email: {selCustomer.email}</div>
            </div>
          )}
          <FieldInput
            label="Contact Override"
            hint="Optional – defaults to account contact"
            placeholder="Different contact name"
            value={contactOverride}
            onChange={(e) => setContactOverride(e.target.value)}
          />
          <FieldSelect
            label="Pickup Location"
            req
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            options={[...PICKUP_POINTS]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Departure Date" req type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
            <FieldInput label="Departure Time" type="time" value={departTime} onChange={(e) => setDepartTime(e.target.value)} />
          </div>
          <FieldTextarea
            label="Pickup Notes"
            hint="Optional"
            rows={2}
            placeholder="Gate instructions, access codes, contact at port…"
            value={pickupNotes}
            onChange={(e) => setPickupNotes(e.target.value)}
          />
          <InfoBox icon="💡" color="blue" title="Customer Portal Recommendation">
            Give customers access to the <strong>Customer Portal</strong> to submit booking
            requests directly. They request → it appears in your queue → you create the trip
            here. This eliminates back-and-forth phone calls while keeping operations in
            control.
          </InfoBox>
        </div>
      )}

      {/* ── Step 1: Package & Pricing ── */}
      {step === 1 && (
        <div className="space-y-4">
          <SectionHead icon="📦" title="Package & Pricing" sub="Waybill, container type, route, and delivery cost" />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Waybill No." hint="Auto-generated" value={waybill} readOnly />
            <FieldInput label="Booking Ref." hint="Auto-generated" value={booking} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldSelect
              label="Container Type"
              req
              value={cType}
              onChange={(e) => setCType(e.target.value)}
              options={[...CONTAINER_TYPES]}
            />
            <FieldInput
              label="Weight (tonnes)"
              type="number"
              placeholder="e.g. 28.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
            />
          </div>
          {cType === "Other (specify)" && (
            <FieldInput
              label="Specify Cargo Type"
              req
              placeholder="Describe cargo"
              value={cOther}
              onChange={(e) => setCOther(e.target.value)}
            />
          )}
          <Divider label="Route & Pricing" />
          <FieldSelect
            label="Route"
            req
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            options={MOCK_ROUTES.map((r) => ({
              value: r.id,
              label: `${r.from} → ${r.to} (${r.distance} km)${r.crossBorder ? " 🌍" : ""}`,
            }))}
          />
          {selRoute && (
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ["20ft", selRoute.price20ft],
                  ["30ft", selRoute.price30ft],
                  ["40ft", selRoute.price40ft],
                  ["Double", selRoute.priceDouble],
                ] as [string, number][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                  className="rounded-xl p-2.5 text-center"
                >
                  <div style={{ color: tx(dark).muted }} className="text-xs mb-0.5">
                    {k}
                  </div>
                  <div className="text-emerald-500 font-black text-sm">₵{v.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Price mode toggle */}
          <div className="flex gap-3">
            {(["route", "manual"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setPriceMode(val)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                style={{
                  background:
                    priceMode === val
                      ? dark
                        ? "rgba(251,191,36,0.12)"
                        : "rgba(251,191,36,0.15)"
                      : "transparent",
                  borderColor:
                    priceMode === val
                      ? "rgba(251,191,36,0.4)"
                      : dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  color: priceMode === val ? "#f59e0b" : tx(dark).secondary,
                }}
              >
                {val === "route" ? "Use Route Price" : "Manual / One-off"}
              </button>
            ))}
          </div>

          {priceMode === "route" && rPrice > 0 && cType && (
            <div
              style={{
                background: dark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
              className="rounded-xl p-3 flex items-center justify-between"
            >
              <span style={{ color: tx(dark).secondary }} className="text-sm">
                Price for {cType}
              </span>
              <span className="text-emerald-400 font-black text-xl">₵{rPrice.toLocaleString()}</span>
            </div>
          )}

          {priceMode === "manual" && (
            <>
              <FieldInput
                label="Manual Delivery Cost"
                req
                prefix="₵"
                type="number"
                placeholder="0.00"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
              />
              <InfoBox icon="⚠️" color="amber">
                Manual prices bypass the route matrix and are flagged in audit reports. Ensure
                this is approved by a supervisor.
              </InfoBox>
            </>
          )}

          <InfoBox icon="📋" color="blue" title="Pricing Best Practice">
            Use <strong>Route Price</strong> for standard runs — consistent billing with no
            manual errors. Use <strong>Manual</strong> only for negotiated contracts or
            special one-off runs.
          </InfoBox>
        </div>
      )}

      {/* ── Step 2: Driver & Vehicle ── */}
      {step === 2 && (
        <div className="space-y-4">
          <SectionHead
            icon="👤"
            title="Driver & Vehicle Assignment"
            sub="Select vehicle first — driver auto-fills from its default"
            color="purple"
          />
          <FieldSelect
            label="Vehicle"
            req
            value={vehicleId}
            onChange={handleVehicle}
            options={vehicles.map((v) => ({
              value: v.id,
              label: `${v.registrationNumber} (${v.status})`,
            }))}
          />
          {selVehicle && (
            <div
              style={{
                background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              }}
              className="rounded-xl p-3 text-xs space-y-1"
            >
              <div style={{ color: tx(dark).muted }}>
                Make:{" "}
                <strong style={{ color: dark ? "#fff" : "#0f172a" }}>
                  {selVehicle.manufactureYear} {selVehicle.make} {selVehicle.model}
                </strong>
              </div>
              <div style={{ color: tx(dark).muted }}>
                Odometer:{" "}
                <span className="font-mono font-semibold">
                  {selVehicle.odometerKm} km
                </span>
              </div>
            </div>
          )}
          <FieldSelect
            label="Driver"
            hint="Auto-filled from vehicle default"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            options={drivers.map((d) => ({
              value: d.id,
              label: `${d.fullName} – ${d.status} (★${d.rating})`,
            }))}
          />
          {selDriver && (
            <div
              style={{
                background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              }}
              className="rounded-xl p-3 flex items-center justify-between text-xs"
            >
              <div style={{ color: tx(dark).muted }}>
                License: <span className="font-mono">{selDriver.licenseNumber}</span> · Per diem:{" "}
                <span className="text-emerald-500 font-bold">₵{selDriver.perDiem}/day</span>
              </div>
              <Badge status={selDriver.status} />
            </div>
          )}
          <FieldTextarea
            label="Instructions to Driver"
            hint="Optional"
            rows={3}
            placeholder="Route notes, delivery contacts, port pass details, overnight stop…"
            value={driverInst}
            onChange={(e) => setDriverInst(e.target.value)}
          />
          <FieldInput
            label="Estimated Return Date"
            hint="Optional"
            type="date"
            value={estReturn}
            onChange={(e) => setEstReturn(e.target.value)}
          />
        </div>
      )}

      {/* ── Step 3: Delivery Info ── */}
      {step === 3 && (
        <div className="space-y-4">
          <SectionHead
            icon="📬"
            title="Delivery Information"
            sub="Where it's going and who receives it"
            color="green"
          />
          <FieldTextarea
            label="Delivery Address"
            req
            rows={2}
            placeholder="Full street address, area, city, region…"
            value={deliveryAddr}
            onChange={(e) => setDeliveryAddr(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput
              label="Recipient Name"
              req
              placeholder="Full name at delivery point"
              value={recName}
              onChange={(e) => setRecName(e.target.value)}
            />
            <FieldInput
              label="Recipient Phone"
              req
              placeholder="+233-XX-XXX-XXXX"
              value={recPhone}
              onChange={(e) => setRecPhone(e.target.value)}
            />
          </div>
          <FieldTextarea
            label="Delivery Notes"
            hint="Optional"
            rows={2}
            placeholder="Access codes, unloading requirements, fragile items…"
            value={delivNotes}
            onChange={(e) => setDelivNotes(e.target.value)}
          />
          <Divider label="Summary" />
          <div
            style={{
              background: dark ? "rgba(251,191,36,0.05)" : "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
            className="rounded-xl p-4 space-y-2 text-sm"
          >
            {(
              [
                ["Customer", selCustomer?.name ?? "—"],
                ["Pickup", pickup || "—"],
                ["Route", selRoute ? `${selRoute.from} → ${selRoute.to}` : "—"],
                ["Cargo", cType === "Other (specify)" ? cOther : cType || "—"],
                ["Weight", weight ? `${weight} t` : "—"],
                ["Driver", selDriver?.fullName ?? "—"],
                ["Vehicle", selVehicle?.registrationNumber ?? "—"],
                ["Delivery Cost", finalPrice ? `₵${finalPrice.toLocaleString()}${priceMode === "manual" ? " (manual)" : ""}` : "—"],
                ["Waybill", waybill],
                ["Booking Ref", booking],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span style={{ color: tx(dark).muted }}>{k}</span>
                <span
                  style={{ color: dark ? "#fff" : "#0f172a" }}
                  className="font-semibold text-right ml-4"
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div
        className="flex gap-3 mt-6 pt-5"
        style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` }}
      >
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              color: tx(dark).secondary,
            }}
            className="px-5 py-3 rounded-xl font-semibold text-sm"
          >
            ← Back
          </button>
        ) : (
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
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!can[step]}
            style={{
              background: can[step] ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(251,191,36,0.2)",
              color: can[step] ? "#000" : tx(dark).secondary,
            }}
            className="flex-1 py-3 rounded-xl font-black text-sm disabled:cursor-not-allowed"
          >
            Next: {STEPS[step + 1]} →
          </button>
        ) : (
          <button
            onClick={handleSave}
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            className="flex-1 py-3 rounded-xl text-black font-black text-sm"
          >
            ✓ Create Trip
          </button>
        )}
      </div>
    </div>
  );
}
