import type {
  Route,
  Customer,
  Driver,
  Vehicle,
  Trip,
  Expense,
} from "@/types";

export const MOCK_ROUTES: Route[] = [
  { id: "RT-001", from: "Tema Port", to: "Kumasi",          distance: 270,  price20ft: 2800, price30ft: 3200,  price40ft: 4200,  priceDouble: 7800,  crossBorder: false },
  { id: "RT-002", from: "Tema Port", to: "Tamale",          distance: 600,  price20ft: 5500, price30ft: 6500,  price40ft: 8000,  priceDouble: 14500, crossBorder: false },
  { id: "RT-003", from: "Tema Port", to: "Takoradi",        distance: 215,  price20ft: 2200, price30ft: 2700,  price40ft: 3500,  priceDouble: 6500,  crossBorder: false },
  { id: "RT-004", from: "Tema Port", to: "Lomé, Togo",      distance: 145,  price20ft: 3500, price30ft: 4200,  price40ft: 5500,  priceDouble: 10000, crossBorder: true  },
  { id: "RT-005", from: "Tema Port", to: "Ouagadougou, BF", distance: 1050, price20ft: 9500, price30ft: 11000, price40ft: 14000, priceDouble: 25000, crossBorder: true  },
  { id: "RT-006", from: "Tema Port", to: "Accra CBD",       distance: 28,   price20ft: 800,  price30ft: 1100,  price40ft: 1400,  priceDouble: 2600,  crossBorder: false },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "CUST-001", name: "Vivo Energy",           contact: "Emmanuel Baffoe",   phone: "+233-30-221-4532", email: "logistics@vivoenergy.com",  trips: 28, totalValue: 89200  },
  { id: "CUST-002", name: "Nestlé Ghana",           contact: "Patricia Osei",     phone: "+233-30-274-5500", email: "supply@nestle.com.gh",       trips: 45, totalValue: 142000 },
  { id: "CUST-003", name: "AngloGold Ashanti",      contact: "Richard Appiagyei", phone: "+233-30-287-5000", email: "logistics@anglogold.com",    trips: 19, totalValue: 178500 },
  { id: "CUST-004", name: "Ghana Ports Authority",  contact: "Charles Yankah",    phone: "+233-30-227-2321", email: "ops@ghanaports.gov.gh",      trips: 62, totalValue: 210000 },
  { id: "CUST-005", name: "Meridian Port Services", contact: "Sylvia Asante",     phone: "+233-30-220-1800", email: "logistics@meridianport.com", trips: 38, totalValue: 98700  },
];

export const MOCK_STATUS: Array<{ status: string; name: string }> = [
  { status: "available", name: "Available"},
  { status: "assigned", name: "Assigned" },
  { status: "in_transit", name: "In Transit / On Trip" },
  { status: "loading", name: "Loading / Unloading"},
  { status: "maintenance", name: "Maintenance" },
  { status: "reserved", name: "Reserved / Scheduled" },
];

export const MOCK_FUEL_TYPES: Array<{ type: string; name: string }> = [
  { type: "diesel", name: "Diesel"},
  { type: "petrol", name: "Petrol" },
  { type: "electric", name: "Electric" },
];

export const INITIAL_TRIPS: Trip[] = [
  { id: "TRP-001", driver: "Kwame Mensah",  driverId: "DR-001", vehicle: "GR-2341-23", vehicleId: "VH-001", route: "Tema Port → Kumasi",    routeId: "RT-001", customer: "Vivo Energy",           customerId: "CUST-001", status: "In Transit",        step: 4,  date: "2025-02-28", departDate: "2025-02-28", departTime: "06:30", amount: 4200, cargo: "40ft Container", waybill: "WB-A1B2C3", booking: "BK-X9Y8Z7", weight: "28.5", cancelledAt: null, cancelReason: null, cancelNote: "", cancelledBy: "", deliveryAddr: "Adum, Kumasi",                recipientName: "Joseph Agyei",    recipientPhone: "+233-24-000-0001", driverInstructions: "Call recipient 1hr before arrival", priceMode: "route" },
  { id: "TRP-002", driver: "Kofi Boateng",  driverId: "DR-002", vehicle: "GR-8821-22", vehicleId: "VH-002", route: "Tema Port → Accra CBD", routeId: "RT-006", customer: "Ghana Ports Authority", customerId: "CUST-004", status: "Arrive at Customer", step: 5,  date: "2025-02-28", departDate: "2025-02-28", departTime: "08:00", amount: 1400, cargo: "20ft Container", waybill: "WB-D4E5F6", booking: "BK-A1B2C3", weight: "18.2", cancelledAt: null, cancelReason: null, cancelNote: "", cancelledBy: "", deliveryAddr: "Harbour Road, Accra",          recipientName: "Ama Pokua",       recipientPhone: "+233-24-000-0002", driverInstructions: "Security escort required",           priceMode: "route" },
  { id: "TRP-003", driver: "Yaw Asante",    driverId: "DR-003", vehicle: "GW-1102-24", vehicleId: "VH-003", route: "Tema Port → Takoradi",  routeId: "RT-003", customer: "AngloGold Ashanti",     customerId: "CUST-003", status: "Back at Base",      step: 10, date: "2025-02-27", departDate: "2025-02-27", departTime: "05:00", amount: 5500, cargo: "40ft Container", waybill: "WB-G7H8I9", booking: "BK-D4E5F6", weight: "32.0", cancelledAt: null, cancelReason: null, cancelNote: "", cancelledBy: "", deliveryAddr: "Mining Ave, Takoradi",         recipientName: "Kwesi Baako",     recipientPhone: "+233-24-000-0003", driverInstructions: "Mine access requires gate pass",     priceMode: "manual" },
  { id: "TRP-004", driver: "Ama Serwaa",    driverId: "DR-004", vehicle: "GR-4490-23", vehicleId: "VH-004", route: "Tema Port → Kumasi",    routeId: "RT-001", customer: "Nestlé Ghana",          customerId: "CUST-002", status: "Load Container",    step: 2,  date: "2025-02-28", departDate: "2025-02-28", departTime: "09:30", amount: 3200, cargo: "30ft Container", waybill: "WB-J1K2L3", booking: "BK-G7H8I9", weight: "22.1", cancelledAt: null, cancelReason: null, cancelNote: "", cancelledBy: "", deliveryAddr: "Dadeeso Industrial, Kumasi",   recipientName: "Akua Asante",     recipientPhone: "+233-24-000-0004", driverInstructions: "",                                   priceMode: "route" },
  { id: "TRP-005", driver: "Kojo Frimpong", driverId: "DR-005", vehicle: "GR-3312-22", vehicleId: "VH-005", route: "Tema Port → Tamale",    routeId: "RT-002", customer: "Nestlé Ghana",          customerId: "CUST-002", status: "Depart Base",       step: 0,  date: "2025-02-28", departDate: "2025-02-28", departTime: "04:00", amount: 8000, cargo: "40ft Container", waybill: "WB-M4N5O6", booking: "BK-J1K2L3", weight: "30.5", cancelledAt: null, cancelReason: null, cancelNote: "", cancelledBy: "", deliveryAddr: "Tamale Central Depot",         recipientName: "Kofi Nkrumah",    recipientPhone: "+233-24-000-0005", driverInstructions: "Cross Brong Ahafo before nightfall", priceMode: "route" },
  { id: "TRP-006", driver: "Adwoa Darko",   driverId: "DR-006", vehicle: "GW-9901-24", vehicleId: "VH-006", route: "Tema Port → Accra CBD", routeId: "RT-006", customer: "Vivo Energy",           customerId: "CUST-001", status: "Gate Out",          step: 3,  date: "2025-02-27", departDate: "2025-02-27", departTime: "11:00", amount: 1100, cargo: "30ft Container", waybill: "WB-P7Q8R9", booking: "BK-M4N5O6", weight: "16.8", cancelledAt: null, cancelReason: null, cancelNote: "", cancelledBy: "", deliveryAddr: "Spintex Road, Accra",          recipientName: "Yaw Dankwa",      recipientPhone: "+233-24-000-0006", driverInstructions: "",                                   priceMode: "route" },
  { id: "TRP-CANC", driver: "Nana Ama",     driverId: null,     vehicle: "GR-5541-22", vehicleId: "VH-008", route: "Tema Port → Takoradi",  routeId: "RT-003", customer: "Nestlé Ghana",          customerId: "CUST-002", status: "Cancelled",         step: 1,  date: "2025-02-25", departDate: "2025-02-25", departTime: "07:00", amount: 3500, cargo: "30ft Container", waybill: "WB-V4W5X6", booking: "BK-S1T2U3", weight: "20.0", cancelledAt: "2025-02-25 14:32", cancelReason: "Container not ready at port", cancelNote: "Rescheduling next week", cancelledBy: "Ama Korantema", deliveryAddr: "Takoradi West", recipientName: "Kwame Frimpong", recipientPhone: "+233-24-000-0008", driverInstructions: "", priceMode: "route" },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: "EXP-001", type: "Fuel",        vehicleId: "VH-001", vehicle: "GR-2341-23", driverId: "DR-001", driver: "Kwame Mensah", tripId: "TRP-001", amount: 890,  date: "2025-02-28", time: "14:22", odometer: 128340, odometerAfter: 128560, litres: 120,  unitPrice: 7.42, station: "Shell Tema", receipt: "RCP-001234", notes: "Enroute Kumasi",                    authorised: true,  authorisedBy: "Kweku Boateng", secondWitness: "",                    gpsConfirmed: true  },
  { id: "EXP-002", type: "Per Diem",    vehicleId: "VH-001", vehicle: "GR-2341-23", driverId: "DR-001", driver: "Kwame Mensah", tripId: "TRP-001", amount: 250,  date: "2025-02-28", time: "06:00", odometer: null,   odometerAfter: null,   litres: null, unitPrice: null, station: null,         receipt: "PD-2802-KM", notes: "Daily allowance",                   authorised: true,  authorisedBy: "Ama Korantema", secondWitness: "",                    gpsConfirmed: false },
  { id: "EXP-003", type: "Maintenance", vehicleId: "VH-007", vehicle: "GR-7723-23", driverId: null,     driver: "—",           tripId: null,      amount: 3400, date: "2025-02-26", time: "10:00", odometer: 145600, odometerAfter: null,   litres: null, unitPrice: null, station: null,         receipt: "INV-0234",   notes: "Brake pad replacement – both axles", authorised: false, authorisedBy: "",              secondWitness: "Yaw Darko – Finance", gpsConfirmed: false },
];
