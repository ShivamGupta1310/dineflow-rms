export type DashboardUser = {
  first_name?: string;
  avatar?: string;
  owner_id?: number;
  staff_id?: number;
  created_at: string;
  employee_code: string;
  is_active: boolean;
  last_name: string;
  phone_number: string;
  role: string;
  shift_type: string;
};

export interface WaiterDashboardRequest {
  owner_id: number;
  staff_id: number;
  session_id: string;
}

export interface WaiterDashboardApiResponse {
  success: boolean;
  data?: WaiterDashboardData;
  message?: string;
}

export interface WaiterDashboardData {
  orders: {
    active: number;
    pending: number;
  };
  reservations: {
    count: number;
  };
}

export interface WaiterDashboardState {
  data: WaiterDashboardData | null;
  loading: boolean;
  error: string | null;
}
