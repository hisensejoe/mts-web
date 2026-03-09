"use client";

import { useSession } from "@/context/SessionContext";
import LoginPage from "@/components/layout/LoginPage";
import AdminPortal from "@/components/admin/AdminPortal";
import CustomerPortal from "@/components/customer/CustomerPortal";
import type { CustomerUser } from "@/types";

export default function Home() {
  const { session, login, logout } = useSession();

  if (!session) {
    return <LoginPage onAuth={login} />;
  }

  if (session.role === "admin") {
    return <AdminPortal onLogout={logout} />;
  }

  if (session.role === "super_admin") {
    return <AdminPortal onLogout={logout} />;
  }

  if (session.role === "customer") {
    return (
      <CustomerPortal
        user={session.user as CustomerUser}
        onLogout={logout}
      />
    );
  }

  return null;
}
