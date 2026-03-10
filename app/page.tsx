"use client";

import { useSession } from "@/context/SessionContext";
import LoginPage from "@/components/layout/LoginPage";
import AdminPortal from "@/components/admin/AdminPortal";
import CustomerPortal from "@/components/customer/CustomerPortal";

export default function Home() {
  const { session, isLoading, login, logout } = useSession();

  if (!session && !isLoading) {
    return <LoginPage onAuth={login} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#080f1e' }}>
        <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
      </div>
    );
  }

  if (session?.role === "admin") {
    return <AdminPortal onLogout={logout} />;
  }

  if (session?.role === "super_admin") {
    return <AdminPortal onLogout={logout} />;
  }

  if (session?.role === "customer") {
    return (
      <CustomerPortal
        user={session.user}
        onLogout={logout}
      />
    );
  }

  return null;
}
