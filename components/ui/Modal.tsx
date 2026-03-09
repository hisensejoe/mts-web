"use client";

import { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cardBg, tx } from "@/lib/utils";

interface ModalProps {
  title: string;
  sub?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ title, sub, onClose, children, wide = false }: ModalProps) {
  const { dark } = useTheme();
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        style={{
          ...cardBg(dark),
          border: `1px solid ${dark ? "rgba(251,191,36,0.15)" : "rgba(0,0,0,0.12)"}`,
          maxHeight: "94vh",
          width: "100%",
          maxWidth: wide ? "860px" : "580px",
        }}
        className="rounded-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-6 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
            background: dark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
          }}
        >
          <div>
            <h3
              style={{ color: dark ? "#fff" : "#0f172a" }}
              className="font-black text-lg tracking-tight"
            >
              {title}
            </h3>
            {sub && (
              <p style={{ color: tx(dark).muted }} className="text-xs mt-0.5">
                {sub}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              color: tx(dark).secondary,
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xl ml-4 hover:opacity-70"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
