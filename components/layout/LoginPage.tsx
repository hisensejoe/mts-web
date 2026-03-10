"use client";

import { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { tx, inputStyle } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import type { UserAccount, UserRole } from "@/types";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { verify } from "crypto";

interface LoginPageProps {
  onAuth: (accessToken: string, role: UserRole, user: UserAccount) => void;
}

type Stage = "role" | "phone" | "otp" | "pin";

export default function LoginPage({ onAuth }: LoginPageProps) {
  const { dark } = useTheme();
  const [stage, setStage] = useState<Stage>("role");
  const [role, setRole] = useState<UserRole>("admin");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pin, setPin] = useState("");
  const [cpn, setCpn] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinErr, setPinErr] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const sim = (fn: () => void, ms = 1100) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); fn(); }, ms);
  };

  // handle auth/login with phone
  const handleLogin = async (phone: string) => {
    setLoading(true);
    // prefix 0 to match backend format, since we only store the last 9 digits:
    const formattedPhone = phone.length === 9 && !phone.startsWith("0") ? "0" + phone : phone;
    // make api call to send OTP here, then on success:
    try {
      await axiosInstance.post<void>('/api/v1/auth/login', { phone: formattedPhone });
      // set user object in context here if needed, e.g. setUser({ phone: formattedPhone, role });
      setStage("otp");
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // hannle OTP vefication – in real app, call verify-otp endpoint here, then on success:
  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
       // prefix 0 to match backend format, since we only store the last 9 digits:
      const formattedPhone = phone.length === 9 && !phone.startsWith("0") ? "0" + phone : phone;
    
      const response = await axiosInstance.post<any>('/api/v1/auth/verify-otp', { phone: formattedPhone, otp });
      console.log("OTP verification response:", response.data); // log full response for debugging
      const { accessToken, user } = response.data; // assuming response contains user object with role and other details
      onAuth(accessToken, user.role, user); 
      // setStage("pin");
    } catch (err) {
      let errorMessage = "OTP verification failed. Please try again.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp];
    n[i] = v;
    setOtp(n);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "Enter" && otp.join("").length === 6) handleVerifyOtp(otp.join(""));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const val = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (val.length) {
      const n = [...otp];
      val.split("").forEach((d, i) => { if (i < 6) n[i] = d; });
      setOtp(n);
      refs.current[Math.min(val.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const bg = dark ? "#080f1e" : "#f0f4ff";

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 relative overflow-hidden"
        style={{
          background: dark
            ? "linear-gradient(160deg,#0f172a 0%,#1e293b 60%,#0f1f0f 100%)"
            : "linear-gradient(160deg,#1e3a5f 0%,#2d5282 100%)",
        }}
      >
        {/* Decorative rings */}
        <div style={{ position: "absolute", right: "-80px", top: "50%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(251,191,36,0.1)" }} />
        <div style={{ position: "absolute", right: "-140px", top: "50%", transform: "translateY(-50%)", width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(251,191,36,0.05)" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
          >
            <span className="text-black font-black text-2xl">M</span>
          </div>
          <div>
            <div className="text-white font-black text-xl tracking-tight leading-none">MTS Fleet</div>
            <div className="text-slate-400 text-xs mt-0.5">Motor Transport Services</div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-4xl font-black text-white leading-tight mb-4">
            Ghana&apos;s Premier<br />
            <span
              style={{
                background: "linear-gradient(90deg,#f59e0b,#fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fleet Management
            </span>
            <br />Platform
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Real-time tracking, seamless bookings, and full transparency — from Tema Port to
            your doorstep.
          </p>
          <div className="space-y-3">
            {[
              ["🚛", "11-stage real-time trip tracking"],
              ["📦", "Live booking and container status"],
              ["💳", "Expense management with audit trails"],
              ["🌍", "Domestic & cross-border routes"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-slate-400 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">
          © 2026 MTS Motor Transport Services · Tema, Ghana
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {/* Role select */}
          {stage === "role" && (
            <div>
              <div className="mb-8">
                <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-3xl font-black mb-2">
                  Welcome back
                </h1>
                <p style={{ color: tx(dark).secondary }} className="text-sm">
                  Select your account type
                </p>
              </div>
              <div className="space-y-3">
                {(
                  [
                    {
                      role: "admin" as UserRole,
                      icon: "🛡",
                      label: "Admin / Operations",
                      sub: "Full access — trips, vehicles, drivers, expenses",
                      accent: "amber",
                    },
                    {
                      role: "customer" as UserRole,
                      icon: "🏢",
                      label: "Customer / Company",
                      sub: "Track shipments, request bookings",
                      accent: "blue",
                    },
                  ]
                ).map((r) => (
                  <button
                    key={r.role}
                    onClick={() => { setRole(r.role); setStage("phone"); }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl border text-left hover:scale-[1.01] transition-all"
                    style={{
                      background:
                        r.accent === "amber"
                          ? dark
                            ? "rgba(251,191,36,0.06)"
                            : "rgba(251,191,36,0.1)"
                          : dark
                          ? "rgba(59,130,246,0.06)"
                          : "rgba(59,130,246,0.08)",
                      border: `1px solid ${r.accent === "amber" ? "rgba(251,191,36,0.25)" : "rgba(59,130,246,0.25)"}`,
                    }}
                  >
                    <div
                      style={{
                        background:
                          r.accent === "amber"
                            ? "linear-gradient(135deg,#f59e0b,#d97706)"
                            : "linear-gradient(135deg,#3b82f6,#2563eb)",
                      }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    >
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
                        {r.label}
                      </div>
                      <div style={{ color: tx(dark).secondary }} className="text-xs mt-0.5">
                        {r.sub}
                      </div>
                    </div>
                    <span
                      style={{ color: r.accent === "amber" ? "#f59e0b" : "#3b82f6" }}
                      className="text-xl"
                    >
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phone */}
          {stage === "phone" && (
            <div>
              <button
                onClick={() => setStage("role")}
                style={{ color: tx(dark).muted }}
                className="flex items-center gap-2 text-sm mb-8 hover:opacity-70"
              >
                ← Back
              </button>
              <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-3xl font-black mb-2">
                Enter your number
              </h1>
              <p style={{ color: tx(dark).secondary }} className="text-sm mb-8">
                We&apos;ll send a verification code
              </p>
              <div className="flex gap-2 mb-5">
                <div
                  style={{ ...inputStyle(dark), display: "flex", alignItems: "center", padding: "0 1rem" }}
                  className="rounded-xl border flex-shrink-0"
                >
                  <span style={{ color: dark ? "#e2e8f0" : "#0f172a" }} className="text-sm font-semibold">
                    🇬🇭 +233
                  </span>
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, "").slice(0, 9))}
                  placeholder="XX XXX XXXX"
                  maxLength={9}
                  className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  style={inputStyle(dark)}
                />
              </div>
              <button
                onClick={() => handleLogin(phone)}
                disabled={loading || phone.length < 9}
                className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000" }}
              >
                {loading ? "Sending…" : "Send OTP →"}
              </button>
            </div>
          )}

          {/* OTP */}
          {stage === "otp" && (
            <div>
              <button
                onClick={() => setStage("phone")}
                style={{ color: tx(dark).muted }}
                className="flex items-center gap-2 text-sm mb-8 hover:opacity-70"
              >
                ← Back
              </button>
              <div
                style={{
                  background: dark ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.15)",
                  border: "1px solid rgba(251,191,36,0.3)",
                }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
              >
                📱
              </div>
              <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-3xl font-black mb-2">
                Check your phone
              </h1>
              <p style={{ color: tx(dark).secondary }} className="text-sm mb-6">
                Enter the <strong style={{ color: "#fbbf24" }}>6-digit code</strong> sent to
                +233 {phone}
              </p>

              {/* OTP inputs – split 3|3 */}
              <div className="flex items-center gap-2 justify-center mb-2">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    ref={(r) => { refs.current[i] = r; }}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-14 h-16 text-center text-2xl font-black rounded-xl focus:outline-none transition-all"
                    style={{
                      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                      border: `2px solid ${otp[i] ? "#f59e0b" : dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)"}`,
                      color: dark ? "#fff" : "#0f172a",
                      transform: otp[i] ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                ))}
                <div style={{ color: tx(dark).muted, fontSize: "1.5rem", fontWeight: 900 }}>—</div>
                {[3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(r) => { refs.current[i] = r; }}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-14 h-16 text-center text-2xl font-black rounded-xl focus:outline-none transition-all"
                    style={{
                      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                      border: `2px solid ${otp[i] ? "#f59e0b" : dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)"}`,
                      color: dark ? "#fff" : "#0f172a",
                      transform: otp[i] ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              {/* Fill-indicator dots */}
              <div className="flex justify-center gap-1.5 mb-4">
                {otp.map((d, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: d ? "#f59e0b" : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                      transform: d ? "scale(1.3)" : "scale(1)",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </div>

              {/* <p style={{ color: tx(dark).muted }} className="text-xs mb-5 text-center">
                <span
                  className="text-amber-500 cursor-pointer hover:underline"
                  onClick={() => setOtp(["1", "2", "3", "4", "5", "6"])}
                >
                  Use demo code
                </span>
              </p> */}
              <button
                onClick={() => handleVerifyOtp(otp.join(""))}
                disabled={loading || otp.join("").length < 6}
                className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000" }}
              >
                {loading ? "Verifying…" : "Verify →"}
              </button>
            </div>
          )}

          {/* PIN */}
          {stage === "pin" && (
            <div>
              <div
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
              >
                🔒
              </div>
              <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-3xl font-black mb-2">
                Create a PIN
              </h1>
              <p style={{ color: tx(dark).secondary }} className="text-sm mb-6">
                Skip the OTP next time.
              </p>

              <div className="space-y-4 mb-4">
                <div>
                  <label style={{ color: tx(dark).secondary }} className="text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    4-digit PIN <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => { setPin(e.target.value.replace(/\D/, "").slice(0, 4)); setPinErr(""); }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    style={inputStyle(dark)}
                  />
                </div>
                <div>
                  <label style={{ color: tx(dark).secondary }} className="text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Confirm PIN <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm PIN"
                    value={cpn}
                    onChange={(e) => { setCpn(e.target.value.replace(/\D/, "").slice(0, 4)); setPinErr(""); }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    style={inputStyle(dark)}
                  />
                </div>
              </div>

              {pinErr && <p className="text-red-400 text-xs mb-3">{pinErr}</p>}

              <button
                onClick={() => {
                  if (pin !== cpn) { setPinErr("PINs do not match"); return; }
                  // sim(() => onAuth(role), 800);
                }}
                disabled={loading || pin.length < 4}
                className="w-full py-3.5 rounded-xl font-bold text-sm mb-3 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff" }}
              >
                {loading ? "Setting up…" : "Access Dashboard →"}
              </button>

              <button
                // onClick={() => onAuth(role)}
                style={{ color: tx(dark).muted }}
                className="w-full text-sm text-center py-2 hover:opacity-70"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
