import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import type { ReservationDetail } from "@store/slices/reservationSlice";
import type { MenuItemWithQuantity, BillSummaryRestaurantDetails } from "@appTypes";

import { ROUTES } from "@constants/routes";
import { ReservationItem } from "@store/slices/reservationSlice";

export type OwnerTabParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.TABLES]: undefined;
  [ROUTES.CENTER_PLACEHOLDER]: undefined;
  [ROUTES.RESERVATIONS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type OwnerStackParamList = {
  [ROUTES.MAIN_TABS]: NavigatorScreenParams<OwnerTabParamList> | undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.OWNER_QR_CODE_ACCESS]: undefined;
  [ROUTES.RESERVATIONS]:
    | {
        reservationId?: number;
      }
    | undefined;
  [ROUTES.BILL_SUMMARY]: {
    tableId: number;
  };
  [ROUTES.PAYMENT_SUCCESS]: {
    paymentDetails: {
      billNumber: string | number;
      subTotal: number;
      cgstAmount: number;
      sgstAmount: number;
      cgstPercentage?: number;
      sgstPercentage?: number;
      discount: number;
      grandTotal: number;
      paidAt: string;
      tableId: string | number;
      customerName?: string | null;
      customerMobile?: string | null;
      sessionStartedAt?: string | null;
      totalGuest?: number | null;
      paymentMethod?: string | null;
      items: any[];
      restaurant_details?: BillSummaryRestaurantDetails;
    };
  };
  [ROUTES.RESERVATIONS_DETAILS]: {
    reservationId: number;
  };
  [ROUTES.NEW_RESERVATION]:
    | {
        reservationData?: ReservationDetail | null;
        slotId?: number;
      }
    | undefined;
  [ROUTES.RESERVE_TABLE]: {
    item: ReservationItem | ReservationDetail;
  };
};

export type OwnerStackNavigationProp =
  NativeStackNavigationProp<OwnerStackParamList>;

export type BillSummaryRouteProp = RouteProp<
  OwnerStackParamList,
  typeof ROUTES.BILL_SUMMARY
>;

export type WaiterTabParamList = {
  [ROUTES.WAITER_HOME_STACK]: undefined;
  [ROUTES.MENU]: undefined;
  [ROUTES.TABLES]: undefined;
  [ROUTES.ORDERS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

export type WaiterOrderConfirmedParams = {
  orderId: number;
  orderNumber: string;
  tableNumber: string | number;
  placedAt: string;
  fullName: string;
  mobileNumber: string;
  orderItems: MenuItemWithQuantity[];
};

export type WaiterStackParamList = {
  [ROUTES.MAIN_TABS]: NavigatorScreenParams<WaiterTabParamList> | undefined;
  [ROUTES.TABLE_MENU]: undefined;
  [ROUTES.ORDER_SUMMARY]: undefined;
  [ROUTES.ORDER_CONFIRMED]: WaiterOrderConfirmedParams;
};

export type WaiterStackNavigationProp =
  NativeStackNavigationProp<WaiterStackParamList>;

export type OrderConfirmedRouteProp = RouteProp<
  WaiterStackParamList,
  typeof ROUTES.ORDER_CONFIRMED
>;
