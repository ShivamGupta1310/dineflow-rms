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

export const waiterTables = {
  tables,
  loading: false,
  error: null,
};

export const waiterOrder = {
  orders: [
    {
      order_id: 1025,
      order_number: "ORD-1025",
      order_status: "order_placed",
      created_at: "2026-06-24T10:24:23.093355",
      items: [
        {
          order_item_id: 63,
          menu_item_id: 191,
          item_name: "Paneer Tikka",
          quantity: 2,
          unit_price: 280,
          total_price: 560,
          item_status: "order_placed",
          image_url: "https://i.pravatar.cc/250?u=63@pravatar.com",
        },
      ],
    },
  ],
  loading: false,
  error: null,
};

export const waiterOrders = waiterOrder;

export const mockState = {
  waiterTables,
  waiterOrder,
  waiterOrders,
};

export const translations: Record<string, string> = {
  "waiter.tables.tables": "Tables",
  "waiter.tables.tableDesc": "Manage all restaurant tables",
  "waiter.tables.allTables": "All Tables",
  "waiter.tables.statusGuide": "Status Guide",
  "waiter.tables.statusGuideDesc": "Understand each table state.",
  "waiter.tables.available": "Available",
  "waiter.tables.availableDesc": "Table is free and ready for guests.",
  "waiter.tables.occupied": "Occupied",
  "waiter.tables.occupiedDesc": "Table is currently occupied.",
  "waiter.tables.reserved": "Reserved",
  "waiter.tables.reservedDesc": "Table is reserved for a guest.",
  "waiter.tables.readyToPay": "Ready to Pay",
  "waiter.tables.readyToPayDesc": "Bill generated and ready for pay.",
  "waiter.tables.noTableAvailable": "No tables available",
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
