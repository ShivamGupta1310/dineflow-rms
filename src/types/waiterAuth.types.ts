export interface WaiterAuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  role: PersistedAppRole | null;
}

export type WaiterRole = "Captain" | "Cook";
export type PersistedAppRole = "captain" | "owner";

export interface GetStaffByRolePayload {
  passcode: string;
  role: WaiterRole;
}

export interface GetStaffByRoleResponse {
  success: boolean;
  message?: string;
}

export interface UnlinkRestaurantPayload {
  owner_id: number;
  role: "Captain";
}

export interface UnlinkRestaurantResponse {
  role: string;
  message?: string;
  success: boolean;
  owner_id: number;
}
