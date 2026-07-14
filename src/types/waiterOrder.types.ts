import { WaiterTable } from "@store/slices/waiterTablesSlice";
import { MenuItemWithQuantity } from "./waiterMenu.types";
import { BillSummaryBillDetails, BillSummaryOrder } from "./billSummary.types";

export interface WaiterOrderState {
  selectedTable: WaiterTable | null;

  orderItems: MenuItemWithQuantity[];
  tableSession: TableSession | null;
  billMetadata: BillMetadata | null;
  loading: boolean;
  error: string | null;
  orders: BillSummaryOrder[];
}

export interface TableSession {
  tableSessionId: number;
  customerName: string;
  customerMobile: string;
  notes: string;
  updatedCustomerName?: boolean;
  updatedCustomerMobileNumber?: boolean;
}

export interface BillMetadata {
  totalGuest: string;
  sessionDate: string;
  sessionStartedAt: string;
  cgstPercentage: number;
  sgstPercentage: number;
  billDetails: BillSummaryBillDetails | null;
}

export interface CreateWaiterOrderItemPayload {
  menu_item_id: number;
  quantity: number;
}

export interface CreateWaiterOrderPayload {
  p_owner_id: number;
  p_created_by: number;
  p_session_id: string;
  p_table_id: number;
  p_customer_name: string;
  p_customer_mobile: string;
  p_notes: string;
  p_items: CreateWaiterOrderItemPayload[];
}

export interface CreateWaiterOrderResponse {
  success: boolean;
  message: string;
  order_id: number;
  subtotal: number;
  order_number: string;
  total_amount: number;
  is_new_session: boolean;
  table_session_id: number;
}

export interface GenerateBillPayload {
  p_owner_id: number;
  p_table_session_id: number;
  p_generated_by: number;
  p_generated_by_role: string;
  p_discount_amount: number;
  p_tax_percentage: number;
  p_customer_name: string;
  p_mobile_number: string;
}

export interface GenerateBillResponse {
  success: boolean;
  message: string;
  bill_id: number;
  bill_number: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  grand_total: number;
}

export interface UpdateOrderStatusPayload {
  p_owner_id: number;
  p_session_id: string;
  p_order_id: number;
  p_staff_id: number;
  p_order_status: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message?: string;
}
