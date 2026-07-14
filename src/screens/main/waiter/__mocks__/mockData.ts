export const createWaiterOrderSheetTable = (
  overrides: Record<string, unknown> = {},
) => ({
  table_id: 5,
  table_number: "T-05",
  capacity: 4,
  status: "occupied",
  occupied_at: null,
  total_order_amount: 0,
  created_at: "2026-07-08T10:00:00",
  customer_name: "Ava Patel",
  customer_mobile: "9876543210",
  ...overrides,
});

export const waiterOrderSheetMockState = {
  waiterOrder: {
    orders: [
      {
        order_id: 11,
        order_number: "ORD-11",
      },
    ],
    loading: false,
  },
};

export const waiterOrderSheetSessionPayload = {
  table_session_id: 77,
  customer_name: "Ava Patel",
  customer_mobile: "9876543210",
};
