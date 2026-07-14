export interface BillSummaryRequestPayload {
  p_owner_id: number;
  p_table_id: number;
}

export interface BillSummaryBillDetails {
  bill_id: number;
  bill_number: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  grand_total: number;
  bill_status: string;
  is_paid: boolean;
  payment_method: string | null;
  paid_at: string | null;
  generated_by: BillGeneratedby;
}

export interface BillGeneratedby {
  employee_code: string;
  name: string;
  phone_number: string;
  profile_url: string;
  role: string;
  staff_id: number;
}

export interface BillSummaryOrderItem {
  order_item_id: number;
  menu_item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_status: string;
  image_url: string;
}

export interface BillSummaryOrder {
  order_id: number;
  order_number: string;
  order_status: string;
  created_at: string;
  items: BillSummaryOrderItem[];
}

export interface BillSummaryRestaurantDetails {
  restaurant_name: string;
  full_address: string;
  gstin: string;
  fssai: string;
  email: string;
  phone: string;
}

export interface BillSummaryResponse {
  success: boolean;
  table_id: number;
  table_session_id: number;
  customer_name: string;
  customer_mobile: string;
  session_started_at: string;
  session_date: string;
  total_guest: string;
  cgst_percentage: number;
  sgst_percentage: number;
  restaurant_details: BillSummaryRestaurantDetails;
  bill_details: BillSummaryBillDetails;
  orders: BillSummaryOrder[];
  message?: string;
}

export interface BillSummaryFlatItem extends BillSummaryOrderItem {
  order_id: number;
  order_number: string;
  created_at: string;
}

export interface OrderItem {
  quantity: number;
  unit_price: number;
}

export interface Order {
  items: OrderItem[];
}

export interface BillSummary {
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  taxAmount: number;
  grandTotal: number;
}
