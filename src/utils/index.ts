import NetInfo from "@react-native-community/netinfo";
import {
  BillSummary,
  BillSummaryFlatItem,
  BillSummaryOrder,
  Order,
} from "@appTypes";
import moment from "moment";
import {
  Common_Values,
  TableGridItemStatus,
  Locales,
  Date_Format,
  TableOrderStatus,
} from "./constants";
import { colors } from "@theme/colors";
import { Linking } from "react-native";
import { showToast } from "./toastHelper";
import i18next, { t } from "i18next";
import { isIOS } from "@theme/theme";

/**
 * Check current internet connection status
 */
export const isInternetConnected = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();

    return state.isConnected === true && state.isInternetReachable !== false;
  } catch (error) {
    console.error("Network check failed:", error);

    return false;
  }
};

export const formatDate = (
  date: Date | string,
  format: string = Date_Format.DD_MMM_YYYY,
  isUTC: boolean = true,
) => {
  if (!date) return Common_Values.EMPTY_PLACEHOLDER;
  return isUTC
    ? moment.utc(date).local().format(format)
    : moment(date).format(format);
};

export const formatSessionDateTime = (
  dateString?: string,
): { date: string; time: string } => {
  if (!dateString) {
    return {
      date: Common_Values.EMPTY_PLACEHOLDER,
      time: Common_Values.EMPTY_PLACEHOLDER,
    };
  }

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString(Locales.EN_GB, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString(Locales.EN_US, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

export const toCurrency = (value: number | string): string =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const calculateBillSummary = (
  orders: Order[],
  cgstPercentage: number | string,
  sgstPercentage: number | string,
): BillSummary => {
  const subtotal = orders.reduce(
    (orderTotal, order) =>
      orderTotal +
      order.items.reduce(
        (itemTotal, item) =>
          itemTotal + Number(item.unit_price ?? 0) * Number(item.quantity ?? 0),
        0,
      ),
    0,
  );

  const cgstAmount = subtotal * (Number(cgstPercentage) / 100);

  const sgstAmount = subtotal * (Number(sgstPercentage) / 100);

  const taxAmount = cgstAmount + sgstAmount;

  const grandTotal = subtotal + taxAmount;

  return {
    subtotal,
    cgstAmount,
    sgstAmount,
    taxAmount,
    grandTotal,
  };
};

export const formatIndianNumber = (
  value: number | string | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const cleanValue = String(value).replace(/[^0-9.-]/g, "");

  const numberValue = Number(cleanValue);

  if (Number.isNaN(numberValue)) {
    return "0";
  }

  return numberValue.toLocaleString(Locales.EN_IN);
};

export const formatDisplayDateSuffix = (date: Date | string) => {
  const parsedDate = moment.utc(date).local();

  if (!parsedDate.isValid()) {
    return {
      day: "",
      suffix: "",
      monthYear: "",
      time: "",
    };
  }

  return {
    day: parsedDate.format("D"),
    suffix: parsedDate.format("Do").replace(parsedDate.format("D"), ""),
    monthYear: parsedDate.format("MMMM YY"),
    time: parsedDate.format(),
  };
};

export const formatDisplayTime = (
  time?: string | null,
  timeFormat = Date_Format.TIME_12_HOUR,
  isUTC: boolean = true,
) => {
  if (!time) {
    return "";
  }

  const parsedTime = isUTC
    ? moment.utc(time, Date_Format.HH_mm_ss).local()
    : moment(time, Date_Format.HH_mm_ss);

  if (!parsedTime.isValid()) {
    return "";
  }

  return `${parsedTime.format(timeFormat)}`;
};

export const statusTheme: Record<
  TableGridItemStatus,
  {
    backgroundColor: string;
  }
> = {
  [TableGridItemStatus.AVAILABLE]: {
    backgroundColor: colors.statusAvailableBG,
  },
  [TableGridItemStatus.OCCUPIED]: {
    backgroundColor: colors.statusOccupiedBG,
  },
  [TableGridItemStatus.RESERVED]: {
    backgroundColor: colors.statusReservedBG,
  },
  [TableGridItemStatus.READY_TO_PAY]: {
    backgroundColor: colors.statusReadyToPayBG,
  },
};

export const openDialer = async (phoneNumber: string) => {
  const trimmedPhoneNumber = phoneNumber.trim();
  const getMessage = (key: string) => t(key) || key;

  if (!trimmedPhoneNumber) {
    return;
  }

  const phoneUrl = isIOS
    ? `telprompt:${trimmedPhoneNumber}`
    : `tel:${trimmedPhoneNumber}`;

  try {
    const supported = await Linking.canOpenURL(phoneUrl);

    if (!supported && isIOS) {
      showToast(
        "info",
        getMessage("owner.reservation.callingNotSupportedOnDevice"),
      );
      return;
    }

    await Linking.openURL(phoneUrl);
  } catch (error) {
    console.error("Failed to open dialer", error);
    showToast("error", getMessage("owner.reservation.unableToOpenDialer"));
  }
};
export interface TimeSlotItem {
  id: string;
  time: string;
  status: TableGridItemStatus;
  available: number;
  booked: number;
  max_capacity: number;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export const toSuperscriptOrdinal = (date: string) => {
  if (!date) {
    return "";
  }
  return date
    .replace(/1st/g, "1ˢᵗ")
    .replace(/2nd/g, "2ⁿᵈ")
    .replace(/3rd/g, "3ʳᵈ")
    .replace(/(\d+)st/g, "$1ˢᵗ")
    .replace(/(\d+)nd/g, "$1ⁿᵈ")
    .replace(/(\d+)rd/g, "$1ʳᵈ")
    .replace(/(\d+)th/g, "$1ᵗʰ");
};

export const formatDisplayDate = (
  date?: string | null,
  dateFormat = "Do MMM YY",
  time?: string | null,
  timeFormat?: string | null,
  isUTC = true,
) => {
  if (!date) return "";

  const dateTime = time ? `${date} ${time}` : date;

  const parsedDate = isUTC ? moment.utc(dateTime).local() : moment(dateTime);

  if (!parsedDate.isValid()) return "";

  const formattedDate = parsedDate.format(dateFormat);

  return timeFormat
    ? `${formattedDate}, ${parsedDate.format(timeFormat)}`
    : formattedDate;
};

type TranslateFn = (key: string) => string;

export const RESERVATION_TYPES = (translate: TranslateFn): DropdownOption[] => [
  {
    label: translate("owner.newReservation.reservationTypes.regular"),
    value: "regular",
  },
  {
    label: translate("owner.newReservation.reservationTypes.birthday"),
    value: "birthday",
  },
  {
    label: translate("owner.newReservation.reservationTypes.anniversary"),
    value: "anniversary",
  },
  {
    label: translate("owner.newReservation.reservationTypes.corporate"),
    value: "corporate",
  },
  {
    label: translate("owner.newReservation.reservationTypes.vip"),
    value: "vip",
  },
  {
    label: translate("owner.newReservation.reservationTypes.event"),
    value: "event",
  },
  {
    label: translate("owner.newReservation.reservationTypes.group"),
    value: "group",
  },
];

export const SOURCE_TYPES = (translate: TranslateFn): DropdownOption[] => [
  {
    label: translate("owner.newReservation.sourceTypes.walkIn"),
    value: "walk_in",
  },
  {
    label: translate("owner.newReservation.sourceTypes.phone"),
    value: "phone",
  },
  {
    label: translate("owner.newReservation.sourceTypes.website"),
    value: "website",
  },
  {
    label: translate("owner.newReservation.sourceTypes.mobileApp"),
    value: "mobile_app",
  },
  {
    label: translate("owner.newReservation.sourceTypes.staff"),
    value: "staff",
  },
  {
    label: translate("owner.newReservation.sourceTypes.zomato"),
    value: "zomato",
  },
  {
    label: translate("owner.newReservation.sourceTypes.swiggy"),
    value: "swiggy",
  },
  {
    label: translate("owner.newReservation.sourceTypes.google"),
    value: "google",
  },
];

export const getSortedWaiterActiveTables = <
  T extends {
    status: string;
  },
>(
  tables: T[] = [],
) => {
  const statusPriority: Record<string, number> = {
    [TableGridItemStatus.READY_TO_PAY]: 0,
    [TableGridItemStatus.OCCUPIED]: 1,
    [TableGridItemStatus.AVAILABLE]: 2,
  };

  return [...tables].sort((left, right) => {
    const leftStatus = left.status.toLowerCase();
    const rightStatus = right.status.toLowerCase();
    const leftPriority = statusPriority[leftStatus] ?? 3;
    const rightPriority = statusPriority[rightStatus] ?? 3;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return 0;
  });
};

export const formatNumber = (value: string | number) => {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const capitalizeWords = (text: string): string => {
  if (!text?.trim()) {
    return "";
  }

  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const toTitleCase = (value?: string): string => {
  if (!value) return Common_Values.EMPTY_PLACEHOLDER;

  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const groupBillSummaryItems = (
  orders: BillSummaryOrder[],
): BillSummaryFlatItem[] => {
  if (!orders.length) {
    return [];
  }

  const flatItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      order_id: order.order_id,
      order_number: order.order_number,
      created_at: order.created_at,
    })),
  );

  const grouped = flatItems.reduce<Record<number, BillSummaryFlatItem>>(
    (acc, item) => {
      const existing = acc[item.menu_item_id];

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc[item.menu_item_id] = { ...item };
      }

      return acc;
    },
    {},
  );

  return Object.values(grouped);
};

const normalizeStatus = (status?: string | null) =>
  status?.toLowerCase?.() ?? "";

export const markOrderItemsServed = (
  orders: BillSummaryOrder[],
  orderId: number,
): BillSummaryOrder[] =>
  orders.map((order) => {
    if (order.order_id !== orderId) {
      return order;
    }

    return {
      ...order,
      order_status: TableOrderStatus.SERVED,
      items: order.items.map((item) =>
        normalizeStatus(item.item_status) === TableOrderStatus.READY
          ? {
              ...item,
              item_status: TableOrderStatus.SERVED,
            }
          : item,
      ),
    };
  });

export interface GraphItem {
  label: string | number;
  date: string;
  amount: number;
}

export const formatTooltipDate = (date: Date | string): string => {
  const m = moment(date);
  const isArabic = i18next.language === "ar";

  if (isArabic) {
    const monthsAr = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يونيو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const daysAr = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const day = m.date();
    const month = monthsAr[m.month()];
    const dayName = daysAr[m.day()];
    return `${day} ${month} ${dayName}`;
  } else {
    const day = m.format("D");
    const suffix = m.format("Do").replace(day, "");
    const month = m.format("MMMM");
    const dayName = m.format("dddd");
    return `${day}${suffix} ${month} ${dayName}`;
  }
};

export const prepareWeeklyGraphData = (
  graphData: GraphItem[] = [],
  baseDate?: string,
): GraphItem[] => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const baseItem = graphData.find((item) => item.date);
  const baseMoment = baseItem
    ? moment(baseItem.date)
    : baseDate
    ? moment(baseDate)
    : moment();

  const startOfWeek = baseMoment.clone().startOf("isoWeek");

  return daysOfWeek.map((dayLabel, index) => {
    const dayMoment = startOfWeek.clone().add(index, "days");

    const apiItem = graphData.find((item) => {
      if (
        typeof item.label === "string" &&
        item.label.toLowerCase() === dayLabel.toLowerCase()
      ) {
        return true;
      }
      return moment(item.date).isSame(dayMoment, "day");
    });

    return {
      label: dayLabel,
      date: dayMoment.toISOString(),
      amount: apiItem ? apiItem.amount : 0,
    };
  });
};

export const computeChartLayout = (
  data: { amount: number }[],
  width: number,
  height: number,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  isRTL: boolean = false,
) => {
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  let niceMax = maxAmount;
  if (maxAmount <= 100) {
    niceMax = Math.ceil(maxAmount / 10) * 10;
  } else if (maxAmount <= 1000) {
    niceMax = Math.ceil(maxAmount / 100) * 100;
  } else if (maxAmount <= 10000) {
    niceMax = Math.ceil(maxAmount / 2000) * 2000;
  } else {
    niceMax = Math.ceil(maxAmount / 5000) * 5000;
  }

  if (niceMax === 0) niceMax = 1000;

  const points = data.map((item, index) => {
    const relativeIndex = isRTL ? data.length - 1 - index : index;
    const x = paddingLeft + (relativeIndex / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (item.amount / niceMax) * chartHeight;
    return { x, y };
  });

  return {
    points,
    niceMax,
    chartWidth,
    chartHeight,
  };
};

export const getBezierPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];

    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;

    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  return path;
};

export const getClosedBezierPath = (
  points: { x: number; y: number }[],
  chartBottomY: number,
): string => {
  if (points.length === 0) return "";

  const linePath = getBezierPath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${linePath} L ${lastPoint.x} ${chartBottomY} L ${firstPoint.x} ${chartBottomY} Z`;
};

export const formatYAxisLabel = (value: number): string => {
  if (value === 0) return "0";
  if (value >= 1000) {
    const kValue = value / 1000;
    return `${kValue}k`;
  }
  return String(value);
};
