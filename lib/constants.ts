export const TRIP_STEPS = [
  "Depart Base",
  "Enter Port",
  "Load Container",
  "Gate Out",
  "In Transit",
  "Arrive at Customer",
  "Start Offload",
  "Finish Offload",
  "Start Return",
  "Drop Container",
  "Back at Base",
] as const;

/** Steps at which a trip can still be cancelled (before Gate Out) */
export const CANCELLABLE_STEPS = [0, 1, 2, 3] as const;

export const CANCEL_REASONS = [
  "Customer requested cancellation",
  "Vehicle breakdown",
  "Driver unavailable",
  "Container not ready at port",
  "Route blocked / security concern",
  "Weather / force majeure",
  "Duplicate booking",
  "Customs hold",
  "Other",
] as const;

export const EXPENSE_TYPES = [
  "Fuel",
  "Per Diem",
  "Toll",
  "Maintenance",
  "Tire Change",
  "Spare Parts",
  "Police / Checkpoint Fee",
  "Loading Fee",
  "Other",
] as const;

export const FUEL_STATIONS = [
  "Shell Tema",
  "Total Takoradi",
  "GOIL Accra",
  "Shell Accra East",
  "Puma Kumasi",
  "Total Tamale",
  "GOIL Takoradi",
  "Other",
] as const;

export const CONTAINER_TYPES = [
  "20ft Container",
  "30ft Container",
  "40ft Container",
  "Double Container",
  "Flat Bed",
  "Other (specify)",
] as const;

export const PICKUP_POINTS = [
  "Tema Port – Main Gate",
  "Tema Port – Gate B",
  "Takoradi Port",
  "Accra Depot – Spintex",
  "Kumasi Yard",
  "Tamale Depot",
] as const;

export const ROUTE_DESTINATIONS = [
  "Accra CBD",
  "Kumasi",
  "Tamale",
  "Takoradi",
  "Ho",
  "Cape Coast",
  "Sunyani",
  "Bolgatanga",
  "Wa",
  "Lomé, Togo",
  "Ouagadougou, BF",
  "Abidjan, CI",
] as const;

export const WITNESS_OPTIONS = [
  "Kweku Boateng – Ops Manager",
  "Efua Mensah – Dispatcher",
  "Yaw Darko – Finance",
  "Ama Korantema – Super Admin",
] as const;

/** Tailwind badge classes for dark mode */
export const STATUS_COLORS_DARK: Record<string, string> = {
  "On Trip": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Maintenance: "bg-red-500/20 text-red-400 border-red-500/30",
  "In Transit": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Back at Base": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Load Container": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Gate Out": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Depart Base": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Enter Port": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "Arrive at Customer": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "Start Offload": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Finish Offload": "bg-lime-500/20 text-lime-400 border-lime-500/30",
  "Start Return": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Drop Container": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Cancelled: "bg-red-900/30 text-red-400 border-red-700/40",
};

/** Tailwind badge classes for light mode */
export const STATUS_COLORS_LIGHT: Record<string, string> = {
  "On Trip": "bg-amber-100 text-amber-700 border-amber-300",
  Available: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Maintenance: "bg-red-100 text-red-700 border-red-300",
  "In Transit": "bg-blue-100 text-blue-700 border-blue-300",
  "Back at Base": "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Load Container": "bg-purple-100 text-purple-700 border-purple-300",
  "Gate Out": "bg-orange-100 text-orange-700 border-orange-300",
  "Depart Base": "bg-cyan-100 text-cyan-700 border-cyan-300",
  "Enter Port": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Arrive at Customer": "bg-teal-100 text-teal-700 border-teal-300",
  "Start Offload": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Finish Offload": "bg-lime-100 text-lime-700 border-lime-300",
  "Start Return": "bg-pink-100 text-pink-700 border-pink-300",
  "Drop Container": "bg-rose-100 text-rose-700 border-rose-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};
