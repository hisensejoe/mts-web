"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx, inputStyle } from "@/lib/utils";

// ─── FieldLabel ───────────────────────────────────────────────────────────────

interface FieldLabelProps {
  label: string;
  req?: boolean;
  hint?: string;
}

export function FieldLabel({ label, req, hint }: FieldLabelProps) {
  const { dark } = useTheme();
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label
        style={{ color: tx(dark).secondary }}
        className="text-xs font-semibold uppercase tracking-wider"
      >
        {label}
        {req && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      {hint && (
        <span style={{ color: tx(dark).muted }} className="text-xs italic">
          {hint}
        </span>
      )}
    </div>
  );
}

// ─── FieldInput ───────────────────────────────────────────────────────────────

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  req?: boolean;
  hint?: string;
  prefix?: string;
  className?: string;
}

export function FieldInput({
  label,
  req,
  hint,
  prefix,
  className = "",
  readOnly,
  ...rest
}: FieldInputProps) {
  const { dark } = useTheme();
  return (
    <div className={className}>
      {label && <FieldLabel label={label} req={req} hint={hint} />}
      <div className="relative">
        {prefix && (
          <span
            style={{ color: tx(dark).secondary }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm z-10"
          >
            {prefix}
          </span>
        )}
        <input
          readOnly={readOnly}
          {...rest}
          className={`w-full rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all
            ${readOnly ? "opacity-60 cursor-not-allowed" : ""}
            ${prefix ? "pl-8 pr-4" : "px-4"}`}
          style={inputStyle(dark)}
        />
      </div>
    </div>
  );
}

// ─── FieldSelect ──────────────────────────────────────────────────────────────

type SelectOption = string | { value: string; label: string };

interface FieldSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  req?: boolean;
  hint?: string;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function FieldSelect({
  label,
  req,
  hint,
  options = [],
  placeholder,
  className = "",
  ...rest
}: FieldSelectProps) {
  const { dark } = useTheme();
  return (
    <div className={className}>
      {label && <FieldLabel label={label} req={req} hint={hint} />}
      <select
        {...rest}
        className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none cursor-pointer"
        style={inputStyle(dark)}
      >
        <option value="">{placeholder ?? `Select ${label ?? ""}…`}</option>
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

// ─── FieldTextarea ────────────────────────────────────────────────────────────

interface FieldTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  req?: boolean;
  hint?: string;
  className?: string;
}

export function FieldTextarea({
  label,
  req,
  hint,
  className = "",
  rows = 3,
  ...rest
}: FieldTextareaProps) {
  const { dark } = useTheme();
  return (
    <div className={className}>
      {label && <FieldLabel label={label} req={req} hint={hint} />}
      <textarea
        rows={rows}
        {...rest}
        className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
        style={inputStyle(dark)}
      />
    </div>
  );
}
