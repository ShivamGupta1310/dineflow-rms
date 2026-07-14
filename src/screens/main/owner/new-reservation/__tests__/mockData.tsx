import React from "react";

import { GlobalContext } from "../../../../../contexts/global.provider";
import { ReservationStatus } from "@utils/constants";
import type { TimeSlot } from "@store/slices/ownerTablesSlice";

export const mockTranslations: Record<string, string> = {
  "auth.login.errors.mobileRequired": "Please enter your mobile number",
  "auth.login.errors.mobileInvalid": "Please enter a valid mobile number",
  "owner.newReservation.header.title": "New Reservation",
  "owner.newReservation.timeSlotTitle": "Select Time Slot",
  "owner.newReservation.guestDetail": "Guest Details",
  "owner.newReservation.fullName": "Full Name",
  "owner.newReservation.enterFullName": "Enter Full Name",
  "owner.newReservation.guestCount": "Guest Count",
  "owner.newReservation.enterGuestCount": "Enter Guest Count",
  "owner.newReservation.mobile": "Mobile",
  "owner.newReservation.enterMobileNumber": "Enter your mobile number",
  "owner.newReservation.reservationType": "Reservation Type",
  "owner.newReservation.source": "Source",
  "owner.newReservation.notes": "Notes",
  "owner.newReservation.addSpecialNotes": "Add Special Notes",
  "owner.newReservation.createReservation": "Create Reservation",
  "owner.newReservation.successTitle": "Reservation Successful!",
  "owner.newReservation.reservationCreatedSuccess":
    "{{name}}'s Reservation successfully.",
  "owner.newReservation.reservationTypes.regular": "Regular",
  "owner.newReservation.reservationTypes.birthday": "Birthday",
  "owner.newReservation.reservationTypes.anniversary": "Anniversary",
  "owner.newReservation.reservationTypes.corporate": "Corporate",
  "owner.newReservation.reservationTypes.vip": "VIP",
  "owner.newReservation.reservationTypes.event": "Event",
  "owner.newReservation.reservationTypes.group": "Group",
  "owner.newReservation.sourceTypes.walkIn": "Walk In",
  "owner.newReservation.sourceTypes.phone": "Phone",
  "owner.newReservation.sourceTypes.website": "Website",
  "owner.newReservation.sourceTypes.mobileApp": "Mobile App",
  "owner.newReservation.sourceTypes.staff": "Staff",
  "owner.newReservation.sourceTypes.zomato": "Zomato",
  "owner.newReservation.sourceTypes.swiggy": "Swiggy",
  "owner.newReservation.sourceTypes.google": "Google",
  "owner.tables.available": "Available",
  "common.done": "Done",
};

export const translate = (key: string, options?: { name?: string }) => {
  const value = mockTranslations[key] ?? key;

  if (options?.name) {
    return value.replace("{{name}}", options.name);
  }

  return value;
};

export const createGlobalWrapper =
  (isRTL = false) =>
  ({ children }: { children: React.ReactNode }) => (
    <GlobalContext.Provider
      value={
        {
          language: "en",
          isRTL,
          setLanguage: jest.fn(),
          setIsRTL: jest.fn(),
        } as any
      }
    >
      {children}
    </GlobalContext.Provider>
  );

export const mockOwnerTimeSlots: TimeSlot[] = [
  {
    slot_id: 1,
    slot_name: "08:00",
    start_time: "08:00:00",
    end_time: "08:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 2,
    slot_name: "09:00",
    start_time: "09:00:00",
    end_time: "09:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 3,
    slot_name: "10:00",
    start_time: "10:00:00",
    end_time: "10:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 4,
    slot_name: "11:00",
    start_time: "11:00:00",
    end_time: "11:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 5,
    slot_name: "12:00",
    start_time: "12:00:00",
    end_time: "12:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 6,
    slot_name: "13:00",
    start_time: "13:00:00",
    end_time: "13:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 7,
    slot_name: "14:00",
    start_time: "14:00:00",
    end_time: "14:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 8,
    slot_name: "19:00",
    start_time: "19:00:00",
    end_time: "19:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 9,
    slot_name: "20:00",
    start_time: "20:00:00",
    end_time: "20:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 10,
    slot_name: "21:00",
    start_time: "21:00:00",
    end_time: "21:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 11,
    slot_name: "22:00",
    start_time: "22:00:00",
    end_time: "22:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
  {
    slot_id: 12,
    slot_name: "23:00",
    start_time: "23:00:00",
    end_time: "23:59:59",
    max_capacity: 10,
    booked: 0,
    available: 10,
    is_available: true,
  },
];

export const mockPastTimeSlot = mockOwnerTimeSlots[0].slot_id;
export const mockFutureTimeSlot = mockOwnerTimeSlots[8].slot_id;
export const mockSelectedDate = new Date(2026, 5, 26);
export const mockNextDay = new Date(2026, 5, 27);
export const mockLastVisibleDate = new Date(2026, 6, 1);

export const mockReservationForm = {
  fullName: "  Vivyan Patel ",
  guestCount: "4",
  mobileNumber: " 9876543210 ",
  notes: "  Table near window ",
  reservationType: 8,
  source: 5,
};

export const mockSuccessPayload = {
  title: translate("owner.newReservation.successTitle"),
  subtitle: translate("owner.newReservation.reservationCreatedSuccess", {
    name: mockReservationForm.fullName.trim(),
  }),
};

export const reservationTypesExpected = [
  {
    id: 1,
    key: "standard",
    name: "Standard",
    description: "Normal table reservation",
  },
  {
    id: 2,
    key: "walk_in",
    name: "Walk In",
    description: "Customer arrives without booking",
  },
  {
    id: 3,
    key: "advance",
    name: "Advance",
    description: "Pre-booked reservation",
  },
  {
    id: 4,
    key: "group",
    name: "Group",
    description: "Large party booking",
  },
  {
    id: 5,
    key: "event",
    name: "Event",
    description: "Special occasion booking",
  },
  {
    id: 6,
    key: "vip",
    name: "VIP",
    description: "Priority customer booking",
  },
  {
    id: 7,
    key: "birthday",
    name: "Birthday",
    description: "Birthday celebration booking",
  },
  {
    id: 8,
    key: "corporate",
    name: "Corporate",
    description: "Business / corporate meeting booking",
  },
  {
    id: 9,
    key: "anniversary",
    name: "Anniversary",
    description: "Anniversary celebration booking",
  },
  {
    id: 10,
    key: "private_dining",
    name: "Private Dining",
    description: "Exclusive private dining setup",
  },
];

export const sourceTypesExpected = [
  {
    id: 1,
    key: "online",
    name: "Online",
    description: "Booked via website/app",
  },
  {
    id: 2,
    key: "phone",
    name: "Phone",
    description: "Booked via call",
  },
  {
    id: 3,
    key: "walk_in",
    name: "Walk In",
    description: "Direct walk-in customer",
  },
  {
    id: 4,
    key: "admin",
    name: "Admin Panel",
    description: "Created by restaurant staff",
  },
  {
    id: 5,
    key: "partner",
    name: "Partner",
    description: "Third-party aggregator",
  },
  {
    id: 6,
    key: "whatsapp",
    name: "WhatsApp",
    description: "Booked via WhatsApp chat",
  },
  {
    id: 7,
    key: "instagram",
    name: "Instagram",
    description: "Social media inquiry booking",
  },
  {
    id: 8,
    key: "facebook",
    name: "Facebook",
    description: "Facebook page booking",
  },
  {
    id: 9,
    key: "email",
    name: "Email",
    description: "Reservation via email request",
  },
  {
    id: 10,
    key: "kiosk",
    name: "Kiosk",
    description: "Self-service kiosk booking in restaurant",
  },
];

export const createHookState = (overrides: Record<string, unknown> = {}) => ({
  t: translate,
  isRTL: false,
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
  },
  selectedDate: null as Date | null,
  setSelectedDate: jest.fn(),
  setLastVisibleDate: jest.fn(),
  monthYear: "June 2026",
  selectedTimeSlot: null as number | null,
  setSelectedTimeSlot: jest.fn(),
  fullName: "",
  setFullName: jest.fn(),
  guestCount: "",
  setGuestCount: jest.fn(),
  mobileNumber: "",
  mobileErrorText: null as string | null,
  handleMobileChange: jest.fn(),
  reservationTypes: reservationTypesExpected,
  reservationType: 1,
  setReservationType: jest.fn(),
  sourceTypes: sourceTypesExpected,
  source: 2,
  setSource: jest.fn(),
  notes: "",
  setNotes: jest.fn(),
  COUNTRY_CODE: 91,
  timeSlots: mockOwnerTimeSlots,
  isCreateReservationDisabled: true,
  handleCreateReservation: jest.fn(),
  loading: false,
  reservationData: undefined,
  metaLoading: false,
  loadingTimeSlots: false,
  routeSlotId: undefined,
  handleDateChanged: jest.fn(),
  ...overrides,
});

export const mockReservationAlertText = {
  title: "Reservation Successful!",
  subtitle: "Vivyan Patel's Reservation successfully.",
};

export const mockReservationStatus = ReservationStatus;
