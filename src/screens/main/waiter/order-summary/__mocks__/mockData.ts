import { MenuItemWithQuantity } from "@appTypes";
import { RootState } from "@store";

export const mockHandleBack = jest.fn();
export const mockHandleConfirmedOrder = jest.fn();

export const mockSelectedTable = {
  table_number: "T1",
  capacity: 4,
};

export const mockOrderItems: MenuItemWithQuantity[] = [
  {
    id: 1,
    name: "Pizza",
    description: "Veg Pizza",
    image_url: "",
    quantity: 2,
  } as MenuItemWithQuantity,
];

export const mockMultipleOrderItems: MenuItemWithQuantity[] = [
  {
    id: 1,
    name: "Pizza",
    description: "Veg Pizza",
    image_url: "",
    quantity: 2,
  } as MenuItemWithQuantity,
  {
    id: 2,
    name: "Burger",
    description: "Veg Burger",
    image_url: "",
    quantity: 1,
  } as MenuItemWithQuantity,
];

export const mockUseOrderSummary = {
  t: (key: string) => key,
  loading: false,
  COUNTRY_CODE: "91",
  fullName: "John Doe",
  setFullName: jest.fn(),
  mobileNumber: "9876543210",
  handleMobileChange: jest.fn(),
  handleAddItem: jest.fn(),
  handleRemoveItem: jest.fn(),
  notes: "No onions",
  setNotes: jest.fn(),
  mobileErrorText: "",
  isConfirmOrderDisabled: false,
  handleBack: mockHandleBack,
  handleConfirmedOrder: mockHandleConfirmedOrder,
  selectedTable: mockSelectedTable,
  orderItems: mockOrderItems,
  tables: [],
  tableSheetVisible: false,
  setTableSheetVisible: jest.fn(),
  handleOpenTableSheet: jest.fn(),
  handleSelectTable: jest.fn(),
  tableLoading: false,
};

export const mockUseOrderSummaryLoading = {
  ...mockUseOrderSummary,
  loading: true,
};

export const mockUseOrderSummaryNoTable = {
  ...mockUseOrderSummary,
  selectedTable: null,
};

export const mockUseOrderSummaryMobileError = {
  ...mockUseOrderSummary,
  mobileErrorText: "Invalid mobile number",
};

export const mockUseOrderSummaryMultipleItems = {
  ...mockUseOrderSummary,
  orderItems: mockMultipleOrderItems,
};

export const mockHandleEditOrder = jest.fn();

export const mockNavigate = jest.fn();
export const mockGoBack = jest.fn();

export const mockWaiterOrderState = {
  loading: false,
  selectedTable: mockSelectedTable,
  tableSession: {
    customerName: "John Doe",
    customerMobile: "9876543210",
    notes: "No onions",
  },
  orderItems: mockOrderItems,
};

export const mockState = {
  waiterOrder: mockWaiterOrderState,
} as RootState;

export const mockStateLoading = {
  waiterOrder: {
    ...mockWaiterOrderState,
    loading: true,
  },
} as RootState;

export const mockStateWithoutSession = {
  waiterOrder: {
    ...mockWaiterOrderState,
    tableSession: null,
  },
} as RootState;

export const orderConfirmedRouteParams = {
  fullName: "Rahul Sharma",
  mobileNumber: "9586245284",
  orderId: 39,
  orderNumber: "ORD-1025",
  orderItems: [
    {
      id: 1,
      name: "Pizza",
      description: "Veg Pizza",
      image_url: "",
      quantity: 2,
    },
  ],
  placedAt: "2026-06-24T10:24:23.093355",
  tableNumber: "5",
};

export const orderConfirmedExtraItem = {
  id: 2,
  name: "Burger",
  description: "Veg Burger",
  image_url: "",
  quantity: 1,
};

export type TestTable = {
  table_id: number;
  table_number: string;
  capacity: number;
  status: string;
  occupied_at: string | null;
  total_order_amount: number;
  created_at: string;
  customer_name: string | null;
  customer_mobile: string | null;
};

export const createOrderSummaryTable = (
  overrides: Partial<TestTable> = {},
): TestTable => ({
  table_id: 2,
  table_number: "Table 2",
  capacity: 4,
  status: "occupied",
  occupied_at: null,
  total_order_amount: 0,
  created_at: "2026-07-07T10:00:00",
  customer_name: null,
  customer_mobile: null,
  ...overrides,
});

export const createOrderSummaryState = () => ({
  waiterOrder: {
    selectedTable: createOrderSummaryTable(),
    tableSession: {
      tableSessionId: 99,
      customerName: "Rjz Stvz",
      customerMobile: "7694378525",
      notes: "",
      updatedCustomerName: false,
      updatedCustomerMobileNumber: false,
    },
    orderItems: [
      {
        id: 194,
        name: "Paneer Tikka",
        description: "Starter",
        price: 220,
        image_url: null,
        category_id: 1,
        category_name: "Starter",
        food_type: "veg",
        available: true,
        popular: false,
        recommended: false,
        best_seller: false,
        chef_special: false,
        today_special: false,
        new_arrival: false,
        quick_bites: false,
        combo: false,
        spicy: false,
        jain: false,
        preparation_time: 15,
        quantity: 3,
      },
      {
        id: 211,
        name: "Dal Makhani",
        description: "Main course",
        price: 280,
        image_url: null,
        category_id: 2,
        category_name: "Main Course",
        food_type: "veg",
        available: true,
        popular: false,
        recommended: false,
        best_seller: false,
        chef_special: false,
        today_special: false,
        new_arrival: false,
        quick_bites: false,
        combo: false,
        spicy: false,
        jain: false,
        preparation_time: 20,
        quantity: 5,
      },
    ],
    loading: false,
  },
  waiterTables: {
    tables: [
      createOrderSummaryTable(),
      createOrderSummaryTable({ table_id: 3, table_number: "T3" }),
    ],
    loading: false,
  },
});
