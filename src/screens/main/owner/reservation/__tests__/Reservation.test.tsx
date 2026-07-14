import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GlobalProvider from "../../../../../contexts/global.provider";
import ReservationScreen from "../index";
import { ReservationStatus } from "@utils/constants";
import { useReservation } from "../useReservation";
import { ReservationItem } from "@store/slices/reservationSlice";

const mockSetSearchText = jest.fn();
const mockHandleSelectedStatus = jest.fn();
const mockOpenDialer = jest.fn();
const mockOnRefresh = jest.fn();
const mockHandleReservationDetails = jest.fn();
const mockHandleNewReservation = jest.fn();
const mockUseReservation = useReservation as jest.MockedFunction<
  typeof useReservation
>;

jest.mock("../useReservation", () => ({
  useReservation: jest.fn(),
}));

jest.mock("@utils", () => {
  const actualUtils = jest.requireActual("@utils");

  return {
    ...actualUtils,
    formatDisplayDateSuffix: jest.fn(() => ({
      day: "26",
      suffix: "th",
      monthYear: "May 26",
      time: "",
    })),
    formatDisplayTime: jest.fn(() => "08:00 pm"),
    openDialer: (...args: unknown[]) => mockOpenDialer(...args),
  };
});

jest.mock("../../../../../hoc/withCustomAlert", () => {
  return {
    __esModule: true,
    default:
      (Component: React.ComponentType<any>) =>
      (props: Record<string, unknown>) =>
        <Component {...props} showAlert={jest.fn()} hideAlert={jest.fn()} />,
  };
});

jest.mock("../../../../../hoc/withSuccessScreen", () => {
  return {
    __esModule: true,
    default:
      (Component: React.ComponentType<any>) =>
      (props: Record<string, unknown>) =>
        (
          <Component
            {...props}
            showSuccessScreen={jest.fn()}
            hideSuccessScreen={jest.fn()}
          />
        ),
  };
});

jest.mock("react-i18next", () => ({
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "owner.reservation.header.title": "Reservation",
        "owner.reservation.header.subtitle":
          "Manage all restaurant reservation",
        "owner.reservation.searchPlaceholder":
          "Search guest name, mobile number",
        "owner.reservation.noReservationAvailable": "No reservations found.",
        "owner.reservation.noReservationFoundDesc":
          "There are no reservations to display right now.",
        "owner.reservation.tabs.all": "All",
        "owner.reservation.status.pending": "Pending",
        "owner.reservation.status.needConfirmation": "Need Confirmation",
        "owner.reservation.status.confirmed": "Confirmed",
        "owner.reservation.status.reserved": "Reserved",
        "owner.reservation.status.cancelled": "Cancelled",
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      CalendarPlusIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-calendar-plus-icon" },
          "+",
        ),
      ProfileIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-profile-icon" },
          "Profile",
        ),
      DeleteIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-delete-icon" },
          "Delete",
        ),
      SearchIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-search-icon" },
          "Search",
        ),
      DineSetupLogo: () =>
        ReactModule.createElement(
          Text,
          { testID: "mock-dine-setup-logo" },
          "Logo",
        ),
    },
    ReservedIcon: () => "<svg />",
    ConfirmIcon: () => "<svg />",
    CalendarIcon: () => "<svg />",
    CallIcon: () => "<svg />",
  };
});

jest.mock("react-native-svg", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SvgXml: () => ReactModule.createElement(Text, null, "SvgXml"),
  };
});

jest.mock("@components", () => {
  const ReactModule = require("react");
  const { Pressable, Text, TextInput, View } = require("react-native");

  return {
    AppLoader: () =>
      ReactModule.createElement(Text, null, "Loading reservations"),
    AppTextInput: ({
      value,
      onChangeText,
      placeholder,
      leftAccessory,
    }: {
      value?: string;
      onChangeText?: (value: string) => void;
      placeholder?: string;
      leftAccessory?: React.ReactNode;
    }) =>
      ReactModule.createElement(
        View,
        null,
        leftAccessory,
        ReactModule.createElement(TextInput, {
          placeholder,
          value,
          onChangeText,
          testID: "reservation-search-input",
        }),
      ),
    Header: ({
      title,
      subtitle,
      rightActions,
    }: {
      title?: string;
      subtitle?: string;
      rightActions?: Array<{
        icon: React.ReactNode;
        onPress?: () => void;
        testID?: string;
      }>;
    }) =>
      ReactModule.createElement(
        View,
        null,
        title ? ReactModule.createElement(Text, null, title) : null,
        subtitle ? ReactModule.createElement(Text, null, subtitle) : null,
        rightActions?.map((action, index) =>
          ReactModule.createElement(
            Pressable,
            {
              key: action.testID ?? `header-action-${index}`,
              onPress: action.onPress,
              testID: action.testID,
            },
            action.icon,
          ),
        ),
      ),
    HorizontalStatusTabs: ({ tabs, onTabPress }: any) =>
      ReactModule.createElement(
        View,
        null,
        tabs.map((tab: any) =>
          ReactModule.createElement(
            Pressable,
            {
              key: tab.id,
              onPress: () => onTabPress(tab),
              testID: `tab-${tab.status}`,
            },
            ReactModule.createElement(Text, null, `${tab.title} (${tab.count})`),
          ),
        ),
      ),
    NoDataView: ({
      image,
      title,
      message,
    }: {
      image?: React.ReactNode;
      title?: string;
      message?: string;
    }) =>
      ReactModule.createElement(
        View,
        { testID: "no-data-view" },
        image,
        title ? ReactModule.createElement(Text, null, title) : null,
        message ? ReactModule.createElement(Text, null, message) : null,
      ),
    RNText: ({ children, ...props }: any) =>
      ReactModule.createElement(Text, props, children),
    RNView: ({ children, ...props }: any) =>
      ReactModule.createElement(View, props, children),
  };
});

const mockTabContent = [
  {
    id: "1",
    title: "All",
    status: "all",
    count: 5,
  },
  {
    id: "2",
    title: "Pending",
    status: ReservationStatus.Pending,
    count: 1,
  },
  {
    id: "3",
    title: "Confirmed",
    status: ReservationStatus.Confirmed,
    count: 1,
  },
];

const mockReservations: ReservationItem[] = [
  {
    id: 1,
    notes: null,
    created_at: "2026-05-26T10:01:08.785329",
    created_by: 17,
    updated_at: "2026-05-26T10:02:46.65495",
    customer_name: "Wade Warren",
    total_guest: 2,
    customer_phone: "+91 98765 43210",
    status: ReservationStatus.Pending,
    reservation_time: "20:00:00",
    reservation_date: "2026-05-26",
  },
  {
    id: 2,
    notes: null,
    created_at: "2026-05-26T10:03:56.038226",
    created_by: 17,
    updated_at: "2026-05-26T10:03:56.038226",
    customer_name: "Raj Patel",
    total_guest: 2,
    customer_phone: "7897897890",
    status: ReservationStatus.Confirmed,
    reservation_time: "22:00:00",
    reservation_date: "2026-05-26",
  },
  {
    id: 3,
    notes: null,
    created_at: "2026-05-26T10:03:56.038226",
    created_by: 17,
    updated_at: "2026-05-26T10:03:56.038226",
    customer_name: "Meera Singh",
    total_guest: 5,
    customer_phone: "9876501234",
    status: ReservationStatus.Reserved,
    reservation_time: "19:30:00",
    reservation_date: "2026-05-26",
  },
  {
    id: 4,
    notes: null,
    created_at: "2026-05-26T10:03:56.038226",
    created_by: 17,
    updated_at: "2026-05-26T10:03:56.038226",
    customer_name: "Sara Khan",
    total_guest: 3,
    customer_phone: "8888801234",
    status: ReservationStatus.NeedConfirmation,
    reservation_time: "18:00:00",
    reservation_date: "2026-05-26",
  },
  {
    id: 5,
    notes: null,
    created_at: "2026-05-26T10:03:56.038226",
    created_by: 17,
    updated_at: "2026-05-26T10:03:56.038226",
    customer_name: "Aman Verma",
    total_guest: 4,
    customer_phone: "7777701234",
    status: ReservationStatus.Cancelled,
    reservation_time: "21:15:00",
    reservation_date: "2026-05-26",
  },
];

const buildUseReservationReturnValue = (
  overrides: Partial<ReturnType<typeof useReservation>> = {},
): ReturnType<typeof useReservation> => ({
  isRTL: false,
  loading: false,
  searchText: "",
  tabContent: mockTabContent,
  setSearchText: mockSetSearchText,
  reservationList: mockReservations,
  selectedStatus: "all",
  handleSelectedStatus: mockHandleSelectedStatus,
  openDialer: mockOpenDialer,
  onRefresh: mockOnRefresh,
  refreshing: false,
  handleConfirmReservation: jest.fn(),
  handleCancelReservation: jest.fn(),
  handleReservedReservation: jest.fn(),
  handleReservationDetails: mockHandleReservationDetails,
  handleNewReservation: mockHandleNewReservation,
  ...overrides,
});

describe("ReservationScreen", () => {
  const renderScreen = () =>
    render(
      <GlobalProvider>
        <ReservationScreen />
      </GlobalProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReservation.mockReturnValue(buildUseReservationReturnValue());
  });

  it("renders reservation data with formatted date and time", () => {
    const { getByText, getByTestId } = renderScreen();

    expect(getByText("Reservation")).toBeTruthy();
    expect(getByText("Manage all restaurant reservation")).toBeTruthy();
    expect(getByTestId("reservation-calendar-button")).toBeTruthy();
    expect(getByText("Wade Warren")).toBeTruthy();
    expect(getByText("Pending")).toBeTruthy();
    expect(getByText("+91 98765 43210")).toBeTruthy();
    expect(getByText(" 26ᵗʰ May 26, 08:00 PM")).toBeTruthy();
    expect(getByText("All (5)")).toBeTruthy();
  });

  it("opens new reservation when the header action is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("reservation-calendar-button"));

    expect(mockHandleNewReservation).toHaveBeenCalledTimes(1);
  });

  it("calls search setter when search input changes", () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId("reservation-search-input"), "Rahul");

    expect(mockSetSearchText).toHaveBeenCalledWith("Rahul");
  });

  it("calls tab selection handler when a status tab is pressed", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId(`tab-${ReservationStatus.Pending}`));

    expect(mockHandleSelectedStatus).toHaveBeenCalledWith(
      ReservationStatus.Pending,
    );
  });

  it("renders empty state when there are no reservations", () => {
    mockUseReservation.mockReturnValue(
      buildUseReservationReturnValue({
        reservationList: [],
      }),
    );

    const { getByText } = renderScreen();

    expect(getByText("No reservations found.")).toBeTruthy();
    expect(
      getByText("There are no reservations to display right now."),
    ).toBeTruthy();
  });

  it("renders loader while reservations are loading", () => {
    mockUseReservation.mockReturnValue(
      buildUseReservationReturnValue({
        loading: true,
        reservationList: [],
      }),
    );

    const { getByText, queryByText } = renderScreen();

    expect(getByText("Loading reservations")).toBeTruthy();
    expect(queryByText("No reservations found.")).toBeNull();
  });

  it("opens reservation details with the tapped reservation id", () => {
    const { getByText } = renderScreen();

    fireEvent.press(getByText("Wade Warren"));

    expect(mockHandleReservationDetails).toHaveBeenCalledWith(1);
  });
});
