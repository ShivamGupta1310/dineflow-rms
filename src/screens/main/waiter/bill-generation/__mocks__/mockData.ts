import { BillMetadata, TableSession } from "@appTypes/waiterOrder.types";
import { BillSummaryFlatItem, BillSummaryOrder } from "@appTypes";

export const mockTableSession: TableSession = {
  tableSessionId: 101,
  customerName: "John Doe",
  customerMobile: "9876543210",
  notes: "",
};

export const mockBillMetadata: BillMetadata = {
  totalGuest: "4",
  sessionDate: "10 Jul 2026",
  sessionStartedAt: "12:30 PM",
  cgstPercentage: 2.5,
  sgstPercentage: 2.5,
  billDetails: {
    subtotal: 700,
    tax_amount: 35,
    discount_amount: 0,
    grand_total: 735,
    bill_id: 0,
    bill_number: "",
    bill_status: "",
    is_paid: false,
    payment_method: null,
    paid_at: null,
  },
};

export const mockOrders: BillSummaryOrder[] = [
  {
    order_id: 1,
    order_number: "1001",
    created_at: "2026-07-10T12:30:00Z",
    items: [
      {
        menu_item_id: 1,
        item_name: "Paneer Tikka",
        image_url: "",
        quantity: 2,
        unit_price: 150,
        total_price: 300,
        order_item_id: 0,
        item_status: "",
      },
      {
        menu_item_id: 2,
        item_name: "Butter Naan",
        image_url: "",
        quantity: 2,
        unit_price: 40,
        total_price: 80,
        order_item_id: 0,
        item_status: "",
      },
    ],
    order_status: "",
  },
  {
    order_id: 2,
    order_number: "1002",
    created_at: "2026-07-10T12:45:00Z",
    items: [
      {
        menu_item_id: 3,
        item_name: "Veg Biryani",
        image_url: "",
        quantity: 1,
        unit_price: 320,
        total_price: 320,
        order_item_id: 0,
        item_status: "",
      },
    ],
    order_status: "",
  },
];

export const mockOrderItems: BillSummaryFlatItem[] = [
  {
    menu_item_id: 1,
    item_name: "Paneer Tikka",
    image_url: "",
    quantity: 2,
    unit_price: 150,
    order_id: 0,
    order_number: "",
    created_at: "",
    order_item_id: 0,
    total_price: 0,
    item_status: "",
  },
  {
    menu_item_id: 2,
    item_name: "Butter Naan",
    image_url: "",
    quantity: 2,
    unit_price: 40,
    order_id: 0,
    order_number: "",
    created_at: "",
    order_item_id: 0,
    total_price: 0,
    item_status: "",
  },
  {
    menu_item_id: 3,
    item_name: "Veg Biryani",
    image_url: "",
    quantity: 1,
    unit_price: 320,
    order_id: 0,
    order_number: "",
    created_at: "",
    order_item_id: 0,
    total_price: 0,
    item_status: "",
  },
];

export const mockCalculatedBillSummary = {
  subtotal: 700,
  cgstAmount: 17.5,
  sgstAmount: 17.5,
  taxAmount: 35,
  grandTotal: 735,
};

export const mockWaiterOrderState = {
  selectedTable: {
    table_id: 12,
    table_number: "T-12",
    status: "occupied",
    capacity: 4,
    customer_name: "John Doe",
    customer_mobile: "9876543210",
    total_order_amount: 735,
    occupied_at: null,
    created_at: "2026-07-10",
  },
  orders: mockOrders,
  tableSession: mockTableSession,
  billMetadata: mockBillMetadata,
  orderItems: [],
  loading: false,
  error: null,
};

export const mockRootState = {
  waiterOrder: mockWaiterOrderState,
  auth: {
    ownerId: 1,
    sessionId: "session-123",
    user: {
      staff_id: 10,
      role: "waiter",
      owner_id: 1,
    },
  },
};

export const mockHookHandlers = {
  handleBack: jest.fn(),
  handleFullNameChange: jest.fn(),
  handleMobileChange: jest.fn(),
  handleAddDiscount: jest.fn(),
  handleGenerateBill: jest.fn(),
};

export const mockUseBillGeneration = {
  t: (key: string) => key,
  loading: false,
  error: null,
  fullName: "John Doe",
  mobileNumber: "9876543210",
  mobileErrorText: null,
  orderNumbers: "#1001, #1002",
  orderItems: mockOrderItems,
  tableSession: mockTableSession,
  billMetadata: mockBillMetadata,
  calculatedBillSummary: mockCalculatedBillSummary,
  tableId: 12,
  isGenerateBillDisabled: false,
  ...mockHookHandlers,
};
