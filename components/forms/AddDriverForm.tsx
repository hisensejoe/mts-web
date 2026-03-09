import { useTheme } from "@/context/ThemeContext";
import { Driver } from "@/types";
import { useState } from "react";

interface FormRequest {
  fullName?: string | number;
  phone: string | number;
  licenseNumber?: string;
}

interface AddDriverFormProps {
  onSave: (driver: Driver) => void;
  onClose: () => void;
}

export default function AddRouteForm({ onSave, onClose }: AddDriverFormProps) {
    const { dark } = useTheme();
    const [formInputs, setFormInputs] = useState<FormRequest>({
    fullName: '',
    phone: '',
    licenseNumber: '',
  });

  return (
    <div className="space-y-5">
      <input
        type="text"
        placeholder="Full Name"
        value={formInputs.fullName}
        onChange={(e) => setFormInputs({ ...formInputs, fullName: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={formInputs.phone}
        onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <input
        type="text"
        placeholder="License Number"
        value={formInputs.licenseNumber}
        onChange={(e) => setFormInputs({ ...formInputs, licenseNumber: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
  );
}