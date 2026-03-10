import AddCustomerForm from "@/components/forms/AddCustomerForm";
import Modal from "@/components/ui/Modal";
import { useTheme } from "@/context/ThemeContext";
import axiosInstance from "@/lib/axios";
import { cardBg, tx } from "@/lib/utils";
import { Customer, PagedData } from "@/types";
import { use, useEffect, useState } from "react";

export function AdminCustomers() {
  const { dark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showAdd, setShowAdd] = useState(false);

  // get cusyomer list from api call /api/v1/customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<PagedData<Customer>>("/api/v1/customers");
      const customers0 = res.data.items;
      console.log("API response for customers:", res.data);
      console.log("Fetched customers:", customers0);
      setCustomers(customers0 ?? []);
    } catch (error) {
      setCustomers([]); // Clear customers on error
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
        {showAdd && (
                        <Modal
                          title="Add New Customer"
                          sub="Enter customer details and contact information"
                          onClose={() => setShowAdd(false)}
                          wide
                        >
                          <AddCustomerForm
                            onSave={(c) => {
                              fetchCustomers();
                            }}
                            onClose={() => setShowAdd(false)}
                          />
                        </Modal>
                      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: dark ? "#fff" : "#0f172a" }} className="text-2xl font-black">
            Customers
          </h1>
        </div>
        <button
        onClick={() => setShowAdd(true)}
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          className="px-4 py-2 rounded-xl text-black text-sm font-bold"
        >
          + Add Customer
        </button>
      </div>
      {loading && (
              <div> <div className="flex items-center justify-center py-10"> <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div> </div> </div>
            )}
            {!loading && customers.length === 0 && (
                <div className="flex items-center justify-center py-10">
  <div
    className="text-center"
    style={{ color: tx(dark).secondary }}
  >
    No customers found. Click "Add Customer" to create one.
  </div>
</div>
            )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!loading && customers.length > 0 && customers.map((c) => (
          <div key={c.id} style={cardBg(dark)} className="rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div
                style={{
                  background: dark
                    ? "rgba(251,191,36,0.12)"
                    : "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.2)",
                }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              >
                🏢
              </div>
              <div>
                <div style={{ color: dark ? "#fff" : "#0f172a" }} className="font-bold">
                  {c.name}
                </div>
                <div style={{ color: tx(dark).secondary }} className="text-xs">
                  {c.contact}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs mb-4" style={{ color: tx(dark).muted }}>
              <div>{c.phone}</div>
              <div>{c.email}</div>
            </div>
            <div
              className="grid grid-cols-2 gap-3 pt-3"
              style={{
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Trips
                </div>
                <div
                  style={{ color: dark ? "#fff" : "#0f172a" }}
                  className="font-bold text-lg"
                >
                  {c.trips}
                </div>
              </div>
              <div>
                <div style={{ color: tx(dark).muted }} className="text-xs">
                  Total Value
                </div>
                <div className="text-emerald-500 font-bold text-sm">
                  ₵{c.totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}