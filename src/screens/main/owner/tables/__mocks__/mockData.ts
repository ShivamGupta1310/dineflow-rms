import { colors } from "@theme/colors";

export const tables = [
  {
    table_id: 1,
    table_number: "T1",
    capacity: 4,
    status: "occupied",
    customer_name: null,
    customer_mobile: null,
    occupied_at: "2026-06-09T11:57:33.578337",
    total_order_amount: 240,
    created_at: "2026-05-26T05:46:43.128756",
  },
  {
    table_id: 2,
    table_number: "T2",
    capacity: 2,
    status: "available",
    customer_name: null,
    customer_mobile: null,
    occupied_at: null,
    total_order_amount: 0,
    created_at: "2026-05-26T05:46:43.128756",
  },
  {
    table_id: 3,
    table_number: "T3",
    capacity: 6,
    status: "available",
    customer_name: null,
    customer_mobile: null,
    occupied_at: null,
    total_order_amount: 0,
    created_at: "2026-05-26T05:46:43.128756",
  },
  {
    table_id: 4,
    table_number: "T4",
    capacity: 8,
    status: "ready to pay",
    customer_name: null,
    customer_mobile: null,
    occupied_at: null,
    total_order_amount: 400,
    created_at: "2026-05-26T05:46:43.128756",
  },
];

export const ownerTables = {
  tables,
  loading: false,
  error: null,
};

export const mockState = {
  ownerTables,
};

export const translations: Record<string, string> = {
  "owner.tables.tables": "Tables",
  "owner.tables.tableDesc": "Manage restaurant tables",
  "owner.tables.allTables": "All Tables",
  "owner.tables.statusGuide": "Status Guide",
  "owner.tables.statusGuideDesc": "Understand each table state.",
  "owner.tables.available": "Available",
  "owner.tables.availableDesc": "Table is free and ready for guests.",
  "owner.tables.occupied": "Occupied",
  "owner.tables.occupiedDesc": "Table is currently occupied.",
  "owner.tables.reserved": "Reserved",
  "owner.tables.reservedDesc": "Table is reserved for a guest.",
  "owner.tables.readyToPay": "Ready to Pay",
  "owner.tables.readyToPayDesc": "Bill generated and ready for pay.",
  "owner.tables.noTableAvailable": "No tables available",
};

export const baseTabs = [
  {
    id: "1",
    title: "All",
    status: "all",
    count: 4,
    activeBorderColor: "#F25800",
  },
  {
    id: "2",
    title: "Available",
    status: "available",
    count: 2,
    activeBorderColor: "#1FBC43",
    activeBackgroundColor: "#e8f8ec",
    dotColor: "#1FBC43",
  },
  {
    id: "3",
    title: "Occupied",
    status: "occupied",
    count: 1,
    activeBorderColor: "#FA6302",
    activeBackgroundColor: "#FEEFE5",
    dotColor: "#FA6302",
  },
  {
    id: "4",
    title: "Reserved",
    status: "reserved",
    count: 0,
    activeBorderColor: "#2B72FE",
    activeBackgroundColor: "#E9F0FE",
    dotColor: "#2B72FE",
  },
  {
    id: "5",
    title: "Ready To Pay",
    status: "ready to pay",
    count: 1,
    activeBorderColor: "#9735EB",
    activeBackgroundColor: "#F4EAFD",
    dotColor: "#9735EB",
  },
];

export const baseStatusGuideCards = [
  {
    id: "available",
    title: "Available",
    description: "Table is free and ready for guests.",
    backgroundColor: colors.statusAvailableBG,
    iconColor: colors.statusAvailable,
    testID: "status-guide-card-available",
  },
  {
    id: "occupied",
    title: "Occupied",
    description: "Table is currently occupied.",
    backgroundColor: colors.statusOccupiedBG,
    iconColor: colors.statusOccupied,
    testID: "status-guide-card-occupied",
  },
  {
    id: "reserved",
    title: "Reserved",
    description: "Table is reserved for a guest.",
    backgroundColor: colors.statusReservedBG,
    iconColor: colors.statusReserved,
    testID: "status-guide-card-reserved",
  },
  {
    id: "ready-to-pay",
    title: "Ready To Pay",
    description: "Bill generated and ready for pay.",
    backgroundColor: colors.statusReadyToPayBG,
    iconColor: colors.statusReadyToPay,
    testID: "status-guide-card-ready-to-pay",
  },
];
