// ─── Domain Types ─────────────────────────────────────────────────────────────

export type TripStatus =
  | "Depart Base"
  | "Enter Port"
  | "Load Container"
  | "Gate Out"
  | "In Transit"
  | "Arrive at Customer"
  | "Start Offload"
  | "Finish Offload"
  | "Start Return"
  | "Drop Container"
  | "Back at Base"
  | "Cancelled";

export type PriceMode = "route" | "manual";

export interface Trip {
  id: string;
  driver: string;
  driverId: string | null;
  vehicle: string;
  vehicleId: string;
  route: string;
  routeId: string;
  customer: string;
  customerId: string;
  status: TripStatus;
  step: number;
  date: string;
  departDate: string;
  departTime: string;
  amount: number;
  cargo: string;
  waybill: string;
  booking: string;
  weight: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  cancelNote: string;
  cancelledBy: string;
  deliveryAddr: string;
  recipientName: string;
  recipientPhone: string;
  driverInstructions: string;
  priceMode: PriceMode;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  driver: string;
  driverId: string | null;
  status: "On Trip" | "Available" | "Maintenance";
  odometer: number;
  fuel: string;
  year: number;
  make: string;
  model: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  trips: number;
  rating: number;
  status: "On Trip" | "Available";
  joined: string;
  perDiem: number;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  trips: number;
  totalValue: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance: number;
  price20ft: number;
  price30ft: number;
  price40ft: number;
  priceDouble: number;
  crossBorder: boolean;
}

export interface Expense {
  id: string;
  type: string;
  vehicleId: string;
  vehicle: string;
  driverId: string | null;
  driver: string;
  tripId: string | null;
  amount: number;
  date: string;
  time: string;
  odometer: number | null;
  odometerAfter: number | null;
  litres: number | null;
  unitPrice: number | null;
  station: string | null;
  receipt: string;
  notes: string;
  authorised: boolean;
  authorisedBy: string;
  secondWitness: string;
  gpsConfirmed: boolean;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "customer";

export interface AdminUser {
  role: "super_admin" | "admin";
  fullName: string;
  id: null;
  phone: string;
}

export interface CustomerUser {
  role: "customer";
  name: string;
  company: string;
  customerId: string;
  phone: string;
}

export type AppUser = AdminUser | CustomerUser;

export interface Session {
  role: UserRole;
  user: AppUser;
}

// ─── UI Helper Types ──────────────────────────────────────────────────────────

export type InfoBoxColor = "amber" | "blue" | "red" | "green";
export type SectionHeadColor = "amber" | "blue" | "green" | "purple";
