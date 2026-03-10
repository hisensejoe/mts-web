import { useTheme } from "@/context/ThemeContext";
import { tx } from "@/lib/utils";
import { Customer, Driver } from "@/types";
import { useState } from "react";
import SectionHead from "../ui/SectionHead";
import axiosInstance from "@/lib/axios";

interface FormRequest {
  companyName?: string | number;
  contactName: string | number;
  contactPhone?: string;
  contactEmail?: string;
}

interface AddAddCustomerFormProps {
  onSave: (customer: Customer) => void;
  onClose: () => void;
}

export default function AddAddCustomerForm({ onSave, onClose }: AddAddCustomerFormProps) {
    const { dark } = useTheme();
    const [saved, setSaved] = useState(false);
    const [formInputs, setFormInputs] = useState<FormRequest>({
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const allFilled = !!(formInputs.companyName && formInputs.contactName && formInputs.contactPhone && formInputs.contactEmail);
  // handle save api call
    const handleSave = async () => {
      const response = await axiosInstance.post<Customer>('/api/v1/customers', {
        "company_name": formInputs.companyName,
        "contact_name": formInputs.contactName,
        "contact_phone": formInputs.contactPhone,
        "contact_email": formInputs.contactEmail,
      });
      onSave(response.data);
      setSaved(true);
      setTimeout(onClose, 800);
      
    };
  
    if (saved) {
      return (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">✅</div>
          <div className="text-emerald-400 font-black text-xl">Customer Added!</div>
        </div>
      );
    }

  return (
    <div className="space-y-5">
      <SectionHead icon="📍" title="Customer Details" sub="Set customer information" />
      
      <input
        type="text"
        placeholder="Company Name"
        value={formInputs.companyName}
        onChange={(e) => setFormInputs({ ...formInputs, companyName: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <input
        type="text"
        placeholder="Contact Name"
        value={formInputs.contactName}
        onChange={(e) => setFormInputs({ ...formInputs, contactName: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={formInputs.contactPhone}
        onChange={(e) => setFormInputs({ ...formInputs, contactPhone: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <input
        type="text"
        placeholder="Contact Email"
        value={formInputs.contactEmail}
        onChange={(e) => setFormInputs({ ...formInputs, contactEmail: e.target.value })}

        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                style={{
                  background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  color: tx(dark).secondary,
                }}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!allFilled}
                style={{
                  background: allFilled
                    ? "linear-gradient(135deg,#f59e0b,#d97706)"
                    : "rgba(251,191,36,0.2)",
                  color: allFilled ? "#000" : tx(dark).secondary,
                }}
                className="flex-1 py-3 rounded-xl font-black text-sm disabled:cursor-not-allowed"
              >
                Save Customer →
              </button>
            </div>
    </div>
  );
}