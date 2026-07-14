import React from "react";
import { GlobalContext } from "../../../../../contexts/global.provider";

export const mockTranslations: Record<string, string> = {
  "owner.reservation.reservedTable.title": "Reserve Table",
  "owner.reservation.reservedTable.availableTimeSlots": "Available Time Slots",
  "owner.reservation.reservedTable.availableTable": "Available Table",
  "owner.reservation.reservedTable.successTitle": "Reserved Table",
  "owner.reservation.reservedTable.successSubtitle": "{{name}}'s table has been reserved successfully.",
  "owner.reservation.reservedTable.cancel": "Cancel",
  "owner.reservation.reservedTable.reservedTableBtn": "Reserved Table",
  "owner.reservation.reservedTable.tablesCount": "{{count}} Tables",
  "owner.reservation.reservedTable.tablesCount_one": "1 Table",
};

export const translate = (key: string, options?: { name?: string; count?: number }) => {
  let value = mockTranslations[key] ?? key;
  if (options?.name) {
    value = value.replace("{{name}}", options.name);
  }
  if (options?.count !== undefined) {
    value = value.replace("{{count}}", String(options.count));
  }
  return value;
};

export const createGlobalWrapper =
  (isRTL = false) =>
  ({ children }: { children: React.ReactNode }) => (
    <GlobalContext.Provider
      value={
        {
          language: isRTL ? "ar" : "en",
          isRTL,
          setLanguage: jest.fn(),
          setIsRTL: jest.fn(),
        } as any
      }
    >
      {children}
    </GlobalContext.Provider>
  );

export const mockTimeSlots = [
  {
    slot_id: 12,
    slot_name: "11:00",
    start_time: "11:00:00",
    end_time: "11:59:59",
    max_capacity: 5,
    booked: 0,
    available: 5,
    is_available: true,
  },
  {
    slot_id: 13,
    slot_name: "12:00",
    start_time: "12:00:00",
    end_time: "12:59:59",
    max_capacity: 5,
    booked: 0,
    available: 5,
    is_available: true,
  },
];

export const mockAvailableTables = [
  {
    table_id: 1,
    table_number: "T1",
    table_capacity: 4,
    is_available: true,
  },
  {
    table_id: 2,
    table_number: "T2",
    table_capacity: 6,
    is_available: true,
  },
];

export const mockReservationItem = {
  id: 1,
  customer_name: "Ankit",
  reservation_date: "2026-07-04",
  reservation_time: "11:30 AM",
  total_guest: 4,
  mobile: "9998654565",
};

export const createHookState = (overrides = {}) => ({
  t: translate,
  item: mockReservationItem,
  timeSlots: mockTimeSlots,
  selectedSlotId: 12,
  availableTables: mockAvailableTables,
  selectedTable: mockAvailableTables[0],
  loadingTimeSlots: false,
  loadingTables: false,
  isSubmitting: false,
  handleTimeSlotSelect: jest.fn(),
  handleTableSelect: jest.fn(),
  handleBack: jest.fn(),
  handleReservedTablePress: jest.fn(),
  ...overrides,
});
