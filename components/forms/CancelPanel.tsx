"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import { CANCELLABLE_STEPS, CANCEL_REASONS, TRIP_STEPS } from "@/lib/constants";
import { FieldSelect, FieldTextarea } from "@/components/ui/FormFields";
import InfoBox from "@/components/ui/InfoBox";
import type { Trip } from "@/types";

interface CancelPanelProps {
  trip: Trip;
  onConfirm: (reason: string, note: string) => void;
  onDismiss: () => void;
}

export default function CancelPanel({ trip, onConfirm, onDismiss }: CancelPanelProps) {
  const { dark } = useTheme();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canCancel =
    (CANCELLABLE_STEPS as readonly number[]).includes(trip.step) &&
    trip.status !== "Cancelled";

  if (!canCancel) {
    return (
      <InfoBox icon="⛔" color="red" title="Cannot Cancel at This Stage">
        Trip is at <strong>&quot;{TRIP_STEPS[trip.step]}&quot;</strong>. Gate-out has already
        occurred — escalate to Super Admin for a manual override.
      </InfoBox>
    );
  }

  if (confirmed) {
    return (
      <div className="space-y-4">
        <InfoBox icon="✅" color="green" title="Confirmed — Proceed?">
          Trip <strong>{trip.id}</strong> will be marked Cancelled. Driver and vehicle
          released. Cannot be undone by field staff.
        </InfoBox>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmed(false)}
            style={{
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              color: tx(dark).secondary,
            }}
            className="flex-1 py-3 rounded-xl font-semibold text-sm"
          >
            Go back
          </button>
          <button
            onClick={() => onConfirm(reason, note)}
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}
            className="flex-1 py-3 rounded-xl text-white font-black text-sm"
          >
            Yes – Cancel Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <InfoBox icon="⚠️" color="amber" title="Cancellation available — trip before Gate Out">
        Driver and vehicle will be freed immediately. Booking is archived with a reason.
      </InfoBox>

      <FieldSelect
        label="Cancellation Reason"
        req
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        options={[...CANCEL_REASONS]}
        placeholder="Select reason…"
      />

      <FieldTextarea
        label="Notes / Context"
        hint="Optional"
        rows={2}
        placeholder="Rescheduling info, customer message, incident details…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={onDismiss}
          style={{
            background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            color: tx(dark).secondary,
          }}
          className="flex-1 py-3 rounded-xl font-semibold text-sm"
        >
          Keep Trip
        </button>
        <button
          onClick={() => setConfirmed(true)}
          disabled={!reason}
          style={{
            background: reason ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.06)",
            color: reason ? "#f87171" : "#7f1d1d",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
          className="flex-1 py-3 rounded-xl font-bold text-sm disabled:cursor-not-allowed"
        >
          Continue to Cancel…
        </button>
      </div>
    </div>
  );
}
