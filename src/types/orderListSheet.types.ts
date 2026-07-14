import { TableOrderStatus } from "@utils/constants";
import { BillSummaryFlatItem, BillSummaryOrder } from "./billSummary.types";

export interface OrderListSheetProps {
  visible: boolean;
  setOrderSheetVisible: Function;
  tableNumber?: string;
  orders: BillSummaryOrder[];
  handleAddItemClick: () => void;
  handleGenerateBillClick: () => void;

}

export const SORT_STATUS_PRIORITY = [
  TableOrderStatus.READY,
  TableOrderStatus.PREPARING,
  TableOrderStatus.ORDER_PLACED,
  TableOrderStatus.SERVED,
] as const;

export type OrderListSheetItem = BillSummaryFlatItem;
