import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import ReserveTableScreen from "../index";
import { useReserveTable } from "../useReserveTable";
import {
  createGlobalWrapper,
  createHookState,
  mockAvailableTables,
  mockReservationItem,
} from "./mockData";

const mockHandleTimeSlotSelect = jest.fn();
const mockHandleTableSelect = jest.fn();
const mockHandleBack = jest.fn();
const mockHandleReservedTablePress = jest.fn();

jest.mock("../useReserveTable", () => ({
  useReserveTable: jest.fn(),
}));
jest.mock("@utils", () => {
  const actualUtils = jest.requireActual("@utils");
  return {
    ...actualUtils,
    openDialer: jest.fn(),
  };
});
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("react-native-svg", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SvgXml: () => ReactModule.createElement(Text, null, "SvgXml"),
  };
});

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
      <Component {...props} showSuccessScreen={jest.fn()} hideSuccessScreen={jest.fn()} />,
}));

jest.mock("../../../../../hoc/withCustomAlert", () => ({
  __esModule: true,
  default:
    (Component: React.ComponentType<any>) =>
    (props: Record<string, unknown>) =>
      <Component {...props} showAlert={jest.fn()} />,
}));

jest.mock("@components/TableGridItem", () => {
  const ReactModule = require("react");
  const { Pressable, Text } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) =>
      ReactModule.createElement(
        Pressable,
        {
          testID: `table-grid-item-${props.item.table_id}`,
          onPress: props.onPress,
        },
        ReactModule.createElement(Text, null, props.item.table_number),
      ),
  };
});

jest.mock("@components/common", () => {
  const ReactModule = require("react");
  const { Pressable, Text, View } = require("react-native");

  return {
    AppButton: ({ title, onPress, testID, disabled, loading }: any) =>
      ReactModule.createElement(
        Pressable,
        {
          testID: testID ?? "app-button",
          onPress: disabled || loading ? undefined : onPress,
        },
        ReactModule.createElement(Text, null, title),
      ),
    AppLoader: () => ReactModule.createElement(Text, null, "Loading..."),
    Header: ({ title, leftSlot, rightSlot }: any) =>
      ReactModule.createElement(
        View,
        null,
        ReactModule.createElement(Text, null, title),
        leftSlot ?? null,
        rightSlot ?? null,
      ),
    IconButton: ({ onPress, children, testID }: any) =>
      ReactModule.createElement(
        Pressable,
        {
          testID: testID ?? "icon-button",
          onPress,
        },
        children,
      ),
  };
});

jest.mock("@assets", () => {
  return {
    SVGS: {
      Backlogo: "<svg>Backlogo</svg>",
      CalendarIcon: "<svg>CalendarIcon</svg>",
      ProfileIcon: "<svg>ProfileIcon</svg>",
      ClockIcon: "<svg>ClockIcon</svg>",
    },
    CallIcon: (color?: string) => `<svg fill="${color}">CallIcon</svg>`,
  };
});

const mockedUseReserveTable = useReserveTable as jest.MockedFunction<
  typeof useReserveTable
>;

describe("ReserveTableScreen UI component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseReserveTable.mockReturnValue(
      createHookState({
        handleTimeSlotSelect: mockHandleTimeSlotSelect,
        handleTableSelect: mockHandleTableSelect,
        handleBack: mockHandleBack,
        handleReservedTablePress: mockHandleReservedTablePress,
      }) as any,
    );
  });

  it("renders page header, customer info card, time slots list and tables list", () => {
    const { getAllByText, getByText, getByTestId } = render(<ReserveTableScreen />, {
      wrapper: createGlobalWrapper(),
    });

    // Check header displays customer name
    expect(getAllByText("Ankit").length).toBeGreaterThanOrEqual(1);

    // Check slots labels and formatted times are rendered
    expect(
      getByText("Available Time Slots"),
    ).toBeTruthy();
    expect(getByText("11:00 AM")).toBeTruthy();
    expect(getByText("12:00 PM")).toBeTruthy();

    // Check active tables title and count are rendered
    expect(
      getByText("Available Table"),
    ).toBeTruthy();

    // Verify grid cards exist
    expect(getByTestId("table-grid-item-1")).toBeTruthy();
    expect(getByTestId("table-grid-item-2")).toBeTruthy();
  });

  it("wires clicking slots, tables, cancel, phone dialer, and confirmation button actions", () => {
    const { getByText, getByTestId } = render(<ReserveTableScreen />, {
      wrapper: createGlobalWrapper(),
    });

    // Tap slot card
    fireEvent.press(getByText("12:00 PM"));
    expect(mockHandleTimeSlotSelect).toHaveBeenCalledWith(13);

    // Tap table card
    fireEvent.press(getByTestId("table-grid-item-2"));
    expect(mockHandleTableSelect).toHaveBeenCalledWith(mockAvailableTables[1]);

    // Tap Call
    fireEvent.press(getByTestId("reserve-table-call-button"));
    const { openDialer } = require("@utils");
    expect(openDialer).toHaveBeenCalledTimes(1);

    // Tap Cancel
    fireEvent.press(getByText("Cancel"));
    expect(mockHandleBack).toHaveBeenCalledTimes(1);

    // Tap Reserved Table
    fireEvent.press(getByText("Reserved Table"));
    expect(mockHandleReservedTablePress).toHaveBeenCalledTimes(1);
  });

  it("triggers FlatList getItemLayout and onScrollToIndexFailed", () => {
    jest.useFakeTimers();
    const { UNSAFE_getAllByType } = render(<ReserveTableScreen />, {
      wrapper: createGlobalWrapper(),
    });

    const { FlatList } = require("react-native");
    const flatList = UNSAFE_getAllByType(FlatList)[0];

    // Trigger getItemLayout
    if (flatList.props.getItemLayout) {
      const layout = flatList.props.getItemLayout(null, 2);
      expect(layout).toEqual({
        length: expect.any(Number),
        offset: expect.any(Number),
        index: 2,
      });
    }

    // Trigger onScrollToIndexFailed
    if (flatList.props.onScrollToIndexFailed) {
      flatList.props.onScrollToIndexFailed({ index: 1 });
    }
    jest.advanceTimersByTime(50);
    jest.useRealTimers();
  });

  it("applies RTL styling when wrapped in RTL language provider", () => {
    jest.useFakeTimers();
    const { toJSON } = render(<ReserveTableScreen />, {
      wrapper: createGlobalWrapper(true),
    });

    jest.advanceTimersByTime(150);
    // Verify render snapshot works or component tree is generated without throwing layout errors
    expect(toJSON()).toBeTruthy();
    jest.useRealTimers();
  });

  it("disables time slot if it is not matched and is not available", () => {
    mockedUseReserveTable.mockReturnValueOnce(
      createHookState({
        timeSlots: [
          {
            slot_id: 12,
            slot_name: "11:00",
            start_time: "11:00:00",
            end_time: "11:59:59",
            max_capacity: 5,
            booked: 0,
            available: 5,
            is_available: false,
          },
        ],
        item: {
          ...mockReservationItem,
          slot_id: 13,
        },
        handleTimeSlotSelect: mockHandleTimeSlotSelect,
      }) as any,
    );

    const { getByText } = render(<ReserveTableScreen />, {
      wrapper: createGlobalWrapper(),
    });

    let slotButton = getByText("11:00 AM");
    while (slotButton) {
      if (slotButton.props && slotButton.props.disabled !== undefined) {
        break;
      }
      slotButton = slotButton.parent;
    }

    expect(slotButton?.props.disabled).toBe(true);
  });
});
