import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Date_Format } from "@utils/constants";
import { formatDate } from "@utils";

import NewReservation from "../index";
import { useNewReservation } from "../useNewReservation";
import {
  createGlobalWrapper,
  createHookState,
  mockLastVisibleDate,
  mockOwnerTimeSlots,
  mockReservationForm,
  mockSelectedDate,
  reservationTypesExpected,
  sourceTypesExpected,
  translate as mockTranslate,
} from "./mockData";

const mockHandleCreateReservation = jest.fn();
const mockGoBack = jest.fn();
const mockSetSelectedDate = jest.fn();
const mockSetLastVisibleDate = jest.fn();
const mockSetSelectedTimeSlot = jest.fn();
const mockSetFullName = jest.fn();
const mockSetGuestCount = jest.fn();
const mockHandleMobileChange = jest.fn();
const mockSetReservationType = jest.fn();
const mockSetSource = jest.fn();
const mockSetNotes = jest.fn();
const mockShowSuccessScreen = jest.fn();
const mockHideSuccessScreen = jest.fn();
const mockAppDropdown = jest.fn();
const mockAppButton = jest.fn();
const mockAppLoader = jest.fn();
const mockHandleDateChanged = jest.fn();

jest.mock("../useNewReservation", () => ({
  useNewReservation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTranslate,
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context");
  return {
    ...actual,
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

jest.mock("../../../../../hoc/withSuccessScreen", () => ({
  __esModule: true,
  default:
    (Component: React.ComponentType<any>) =>
    (props: Record<string, unknown>) =>
      (
        <Component
          {...props}
          showSuccessScreen={mockShowSuccessScreen}
          hideSuccessScreen={mockHideSuccessScreen}
        />
      ),
}));

jest.mock("@components/AppDropdown", () => ({
  AppDropdown: (props: any) => {
    mockAppDropdown(props);

    const ReactModule = require("react");
    const { Pressable, Text, View } = require("react-native");

    return ReactModule.createElement(
      View,
      { testID: `dropdown-${props.label}` },
      ReactModule.createElement(Text, null, props.label),
      ReactModule.createElement(
        Text,
        { testID: `dropdown-data-${props.label}` },
        props.data
          .map((item: { label?: string; name?: string }) => item.name ?? item.label)
          .join("|"),
      ),
      ReactModule.createElement(
        Pressable,
        {
          testID: `dropdown-press-${props.label}`,
          onPress: () => props.onChange(props.data[0]),
        },
        ReactModule.createElement(Text, null, "Open"),
      ),
    );
  },
}));

jest.mock("@components/common", () => {
  const ReactModule = require("react");
  const { Pressable, Text, TextInput, View } = require("react-native");

  return {
    AppButton: ({ title, onPress, testID }: any) => {
      mockAppButton({ title, onPress, testID });

      return ReactModule.createElement(
        Pressable,
        {
          testID: testID ?? "app-button",
          onPress,
        },
        ReactModule.createElement(Text, null, title),
      );
    },
    AppTextInput: ({
      label,
      placeholder,
      value,
      onChangeText,
      leftAccessory,
      error,
    }: any) =>
      ReactModule.createElement(
        View,
        null,
        leftAccessory,
        ReactModule.createElement(Text, null, label),
        error
          ? ReactModule.createElement(
              Text,
              { testID: `error-${label}` },
              error,
            )
          : null,
        ReactModule.createElement(TextInput, {
          placeholder,
          value,
          onChangeText,
          testID: `input-${label}`,
        }),
      ),
    Header: ({ title, leftAction, rightSlot }: any) =>
      ReactModule.createElement(
        View,
        null,
        ReactModule.createElement(Text, null, title),
        ReactModule.createElement(
          Pressable,
          {
            testID: "header-back-button",
            onPress: leftAction?.onPress,
          },
          ReactModule.createElement(Text, null, "Back"),
        ),
        rightSlot,
      ),
    AppLoader: () => {
      mockAppLoader();

      return ReactModule.createElement(Text, { testID: "app-loader" }, "Loading");
    },
  };
});

jest.mock("@components/HorizontalDatePicker", () => ({
  __esModule: true,
  default: (props: any) => {
    mockHandleDateChanged(props);

    const ReactModule = require("react");
    const { Pressable, Text, View } = require("react-native");
    return ReactModule.createElement(
      View,
      { testID: "horizontal-date-picker" },
      ReactModule.createElement(
        Pressable,
        {
          testID: "date-picker-select",
          onPress: () => props.onDateSelect(mockSelectedDate),
        },
        ReactModule.createElement(Text, null, "Select date"),
      ),
      ReactModule.createElement(
        Pressable,
        {
          testID: "date-picker-last-visible",
          onPress: () => props.onLastVisibleDateChange(mockLastVisibleDate),
        },
        ReactModule.createElement(Text, null, "Last visible"),
      ),
    );
  },
}));

jest.mock("@assets", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SVGS: {
      Backlogo: () => ReactModule.createElement(Text, { testID: "back-icon" }, "Back"),
      DateTimeIcon: () =>
        ReactModule.createElement(Text, { testID: "date-time-icon" }, "Date"),
      IndiaFlag: () => ReactModule.createElement(Text, { testID: "india-flag" }, "Flag"),
    },
  };
});

const mockedUseNewReservation = useNewReservation as jest.MockedFunction<
  typeof useNewReservation
>;

describe("NewReservation screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseNewReservation.mockReturnValue(
      createHookState({
        navigation: {
          goBack: mockGoBack,
          navigate: jest.fn(),
        },
        selectedDate: null,
        selectedTimeSlot: null,
        fullName: mockReservationForm.fullName,
        guestCount: mockReservationForm.guestCount,
        mobileNumber: mockReservationForm.mobileNumber,
        reservationType: mockReservationForm.reservationType,
        source: mockReservationForm.source,
        notes: mockReservationForm.notes,
        timeSlots: mockOwnerTimeSlots,
        isCreateReservationDisabled: false,
        handleCreateReservation: mockHandleCreateReservation,
        setSelectedDate: mockSetSelectedDate,
        setLastVisibleDate: mockSetLastVisibleDate,
        setSelectedTimeSlot: mockSetSelectedTimeSlot,
        setFullName: mockSetFullName,
        setGuestCount: mockSetGuestCount,
        mobileErrorText: null,
        handleMobileChange: mockHandleMobileChange,
        setReservationType: mockSetReservationType,
        setSource: mockSetSource,
        setNotes: mockSetNotes,
        loading: false,
        handleDateChanged: mockHandleDateChanged,
      }),
    );
  });

  it("renders translated copy and passes translated dropdown data", () => {
    const { getByText, getByTestId } = render(<NewReservation />, {
      wrapper: createGlobalWrapper(),
    });

    expect(getByText("common.new New Reservation")).toBeTruthy();
    expect(getByText("Select Time Slot")).toBeTruthy();
    expect(getByText("Guest Details")).toBeTruthy();
    expect(getByText("common.create New Reservation")).toBeTruthy();

    expect(getByTestId("dropdown-data-Reservation Type").props.children).toBe(
      reservationTypesExpected.map((item) => item.name).join("|"),
    );
    expect(getByTestId("dropdown-data-Source").props.children).toBe(
      sourceTypesExpected.map((item) => item.name).join("|"),
    );

    fireEvent.press(getByTestId("header-back-button"));
    fireEvent.press(getByTestId("owner-login-continue"));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockHandleCreateReservation).toHaveBeenCalledTimes(1);
  });

  it("wires dropdown and slot interactions to the hook setters", () => {
    const { getByTestId, getAllByText } = render(<NewReservation />, {
      wrapper: createGlobalWrapper(true),
    });

    fireEvent.press(getByTestId("dropdown-press-Reservation Type"));
    fireEvent.press(getByTestId("dropdown-press-Source"));
    fireEvent.press(getAllByText("08:00")[0]);

    expect(mockSetReservationType).toHaveBeenCalledWith(1);
    expect(mockSetSource).toHaveBeenCalledWith(1);
    expect(mockSetSelectedTimeSlot).toHaveBeenCalledWith(
      mockOwnerTimeSlots[0].slot_id,
    );
  });

  it("wires the mobile field to the shared mobile validation handler", () => {
    const { getByTestId } = render(<NewReservation />, {
      wrapper: createGlobalWrapper(),
    });

    fireEvent.changeText(getByTestId("input-Mobile"), "98a7-65b4c3");

    expect(mockHandleMobileChange).toHaveBeenCalledWith("98a7-65b4c3");
  });

  it("wires the guest count and date picker callbacks to the hook setters", () => {
    const { getByTestId } = render(<NewReservation />, {
      wrapper: createGlobalWrapper(),
    });

    fireEvent.changeText(getByTestId("input-Guest Count"), "12a3");
    fireEvent.press(getByTestId("date-picker-select"));
    fireEvent.press(getByTestId("date-picker-last-visible"));

    expect(mockSetGuestCount).toHaveBeenCalledWith("123");
    expect(mockHandleDateChanged).toHaveBeenCalledWith(mockSelectedDate);
    expect(mockSetLastVisibleDate).toHaveBeenCalledWith(mockLastVisibleDate);
  });

  it("renders loader and edit-specific state", () => {
    mockedUseNewReservation.mockReturnValue(
      createHookState({
        navigation: {
          goBack: mockGoBack,
          navigate: jest.fn(),
        },
        selectedDate: mockSelectedDate,
        monthYear: "June 2026",
        reservationData: { reservation_id: 77 },
        timeSlots: [],
        metaLoading: true,
        loadingTimeSlots: false,
        routeSlotId: 5,
        handleDateChanged: mockHandleDateChanged,
      }),
    );

    const { getByTestId, getByText } = render(<NewReservation />, {
      wrapper: createGlobalWrapper(),
    });

    expect(getByTestId("app-loader")).toBeTruthy();
    expect(getByText("common.edit New Reservation")).toBeTruthy();
    expect(
      getByText(formatDate(mockSelectedDate, Date_Format.DD_MMMM_YYYY)),
    ).toBeTruthy();
    expect(
      getByText("owner.reservation.reservedTable.noSlotsAvailable"),
    ).toBeTruthy();
  });

  it("renders the route slot even when the slot is unavailable", () => {
    mockedUseNewReservation.mockReturnValue(
      createHookState({
        routeSlotId: 2,
        timeSlots: [
          {
            ...mockOwnerTimeSlots[1],
            is_available: false,
          },
        ],
        handleDateChanged: mockHandleDateChanged,
      }),
    );

    const { getByText } = render(<NewReservation />, {
      wrapper: createGlobalWrapper(),
    });

    expect(getByText("09:00")).toBeTruthy();
    expect(getByText("AM")).toBeTruthy();
  });
});
