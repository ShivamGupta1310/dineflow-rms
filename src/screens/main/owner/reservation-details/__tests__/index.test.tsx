import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import ReservationDetailScreen from "../index";
import { useReservationDetail } from "../useReservationDetail";
import { ReservationStatus } from "@utils/constants";

const mockHandleBack = jest.fn();
const mockHandleCallGuest = jest.fn();
const mockHandleEditReservation = jest.fn();
const mockHandleConfirmReservation = jest.fn();
const mockHandleCancelReservation = jest.fn();
const mockHandleReservedReservation = jest.fn();

jest.mock("../useReservationDetail", () => ({
  useReservationDetail: jest.fn(),
}));

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

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => {
    const { View } = require("react-native");

    return <View>{children}</View>;
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-svg", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SvgXml: () => ReactModule.createElement(Text, null, "SvgXml"),
  };
});

jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    CalendarIcon: "<svg />",
    ConfirmIcon: "<svg />",
    ReservedIcon: "<svg />",
    CallIcon: () => "<svg />",
    SVGS: {
      Backlogo: () =>
        ReactModule.createElement(Text, { testID: "back-logo" }, "Back"),
      ClockIcon: () =>
        ReactModule.createElement(Text, { testID: "clock-icon" }, "Clock"),
      ProfileIcon: () =>
        ReactModule.createElement(
          Text,
          { testID: "profile-icon" },
          "Profile",
        ),
      UserIcon: () =>
        ReactModule.createElement(Text, { testID: "user-icon" }, "User"),
      DeleteIcon: () =>
        ReactModule.createElement(Text, { testID: "delete-icon" }, "Delete"),
    },
  };
});

jest.mock("@components", () => ({
  AppButton: ({ title, onPress, disabled }: any) => {
    const { Pressable, Text } = require("react-native");
    return (
      <Pressable
        testID={title}
        onPress={disabled ? undefined : onPress}
        accessibilityState={{ disabled: Boolean(disabled) }}
      >
        <Text>{title}</Text>
      </Pressable>
    );
  },
  AppLoader: () => {
    const { Text } = require("react-native");
    return <Text>Loading reservation details</Text>;
  },
  Header: ({ title, leftAction, rightActions }: any) => {
    const { Pressable, Text, View } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        {leftAction ? (
          <Pressable
            testID="reservation-detail-header-back"
            onPress={leftAction.onPress}
          >
            {leftAction.icon}
          </Pressable>
        ) : null}
        {rightActions?.map((action: any, index: number) => (
          <View key={action.testID ?? `header-action-${index}`}>
            {action.icon}
          </View>
        ))}
      </View>
    );
  },
  IconButton: ({ icon, onPress, testID }: any) => {
    const { Pressable } = require("react-native");
    return (
      <Pressable testID={testID} onPress={onPress}>
        {icon}
      </Pressable>
    );
  },
  RNText: ({ children }: any) => {
    const { Text } = require("react-native");
    return <Text>{children}</Text>;
  },
  RNView: ({ children }: any) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
  ActivityTimeline: ({ activities }: any) => {
    const ReactModule = require("react");
    const { Text, View } = require("react-native");
    return ReactModule.createElement(
      View,
      null,
      activities.map((activity: any, index: number) =>
        ReactModule.createElement(
          Text,
          { key: `${activity.activity_type}-${index}` },
          activity.activity_message,
        ),
      ),
    );
  },
}));

jest.mock("@utils", () => {
  const actualUtils = jest.requireActual("@utils");

  return {
    ...actualUtils,
    formatDate: jest.fn(() => "26/05/26"),
  };
});

const mockedUseReservationDetail = useReservationDetail as jest.MockedFunction<
  typeof useReservationDetail
>;

const translations: Record<string, string> = {
  "owner.reservation.details.title": "Reservation Details",
  "owner.reservation.details.summaryTitle": "Reservation Summary",
  "owner.reservation.details.activityTimeline": "Activity Timeline",
  "owner.reservation.details.editReservation": "Edit Reservation",
  "owner.reservation.details.callGuest": "Call Guest",
  "owner.reservation.status.pending": "Pending",
  "owner.reservation.status.confirmed": "Confirmed",
  "owner.reservation.status.cancelled": "Cancelled",
};

const baseReservation = {
  reservation_id: 1,
  reservation_number: "RES-1001",
  customer_name: "Wade Warren",
  customer_phone: "+91 98765 43210",
  reservation_date: "2026-05-26",
  reservation_time: "20:00:00",
  total_guest: 2,
  status: ReservationStatus.Pending,
  confirmation_status: "pending",
  reservation_type: "walk_in",
  source: "app",
  notes: "Window seat",
  created_at: "2026-05-26T10:01:08.785329",
  updated_at: "2026-05-26T10:02:46.65495",
};

const buildHookReturnValue = (
  overrides: Partial<ReturnType<typeof useReservationDetail>> = {},
): ReturnType<typeof useReservationDetail> => ({
  t: (key: string) => translations[key] ?? key,
  isRTL: false,
  loading: false,
  statusUpdateLoading: false,
  reservation: baseReservation,
  reservationActivities: [
    {
      activity_type: "reservation_created",
      activity_message: "Reservation created",
      created_at: "2026-05-26T10:01:08.785329",
    },
  ],
  reservationTime: "08:00 PM",
  reservationDetails: [
    { label: "Booking ID", value: "RES-1001" },
    { label: "Reservation Type", value: "Walk In" },
    { label: "Source", value: "App" },
  ],
  EMPTY_PLACEHOLDER: "--",
  handleBack: mockHandleBack,
  handleCallGuest: mockHandleCallGuest,
  handleEditReservation: mockHandleEditReservation,
  handleConfirmReservation: mockHandleConfirmReservation,
  handleCancelReservation: mockHandleCancelReservation,
  handleReservedReservation: mockHandleReservedReservation,
  ...overrides,
});

describe("ReservationDetailScreen", () => {
  const renderScreen = () => render(<ReservationDetailScreen />);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseReservationDetail.mockReturnValue(buildHookReturnValue());
  });

  it("renders reservation details, timeline, and pending actions", () => {
    const { getByText, getByTestId } = renderScreen();

    expect(getByText("Reservation Details")).toBeTruthy();
    expect(getByText("Wade Warren")).toBeTruthy();
    expect(getByText("Pending")).toBeTruthy();
    expect(getByText("+91 98765 43210")).toBeTruthy();
    expect(getByText("26/05/26")).toBeTruthy();
    expect(getByText("08:00 PM")).toBeTruthy();
    expect(getByText("Reservation Summary")).toBeTruthy();
    expect(getByText("Booking ID")).toBeTruthy();
    expect(getByText("RES-1001")).toBeTruthy();
    expect(getByText("Activity Timeline")).toBeTruthy();
    expect(getByText("Reservation created")).toBeTruthy();
    expect(getByText("Edit Reservation")).toBeTruthy();
    expect(getByText("Call Guest")).toBeTruthy();
    expect(getByTestId("reservation-detail-header-back")).toBeTruthy();
    expect(getByTestId("reservation-detail-cancel-button")).toBeTruthy();
    expect(getByTestId("reservation-detail-confirm-button")).toBeTruthy();
  });

  it("calls the screen handlers from header and footer actions", () => {
    const { getByTestId, getByText } = renderScreen();

    fireEvent.press(getByTestId("reservation-detail-header-back"));
    fireEvent.press(getByTestId("reservation-detail-cancel-button"));
    fireEvent.press(getByTestId("reservation-detail-confirm-button"));
    fireEvent.press(getByText("Edit Reservation"));
    fireEvent.press(getByText("Call Guest"));

    expect(mockHandleBack).toHaveBeenCalledTimes(1);
    expect(mockHandleCancelReservation).toHaveBeenCalledTimes(1);
    expect(mockHandleConfirmReservation).toHaveBeenCalledTimes(1);
    expect(mockHandleEditReservation).toHaveBeenCalledTimes(1);
    expect(mockHandleCallGuest).toHaveBeenCalledTimes(1);
  });

  it("shows the reserved action for confirmed reservations", () => {
    mockedUseReservationDetail.mockReturnValue(
      buildHookReturnValue({
        reservation: {
          ...baseReservation,
          status: ReservationStatus.Confirmed,
        },
      }),
    );

    const { getByTestId, queryByTestId } = renderScreen();

    expect(getByTestId("reservation-detail-reserved-button")).toBeTruthy();
    expect(queryByTestId("reservation-detail-cancel-button")).toBeNull();
    expect(queryByTestId("reservation-detail-confirm-button")).toBeNull();
  });

  it("hides the footer for cancelled reservations", () => {
    mockedUseReservationDetail.mockReturnValue(
      buildHookReturnValue({
        reservation: {
          ...baseReservation,
          status: ReservationStatus.Cancelled,
        },
      }),
    );

    const { queryByText } = renderScreen();

    expect(queryByText("Edit Reservation")).toBeNull();
    expect(queryByText("Call Guest")).toBeNull();
  });

  it("shows the loader when reservation details are loading", () => {
    mockedUseReservationDetail.mockReturnValue(
      buildHookReturnValue({
        loading: true,
      }),
    );

    const { getByText } = renderScreen();

    expect(getByText("Loading reservation details")).toBeTruthy();
  });
});
