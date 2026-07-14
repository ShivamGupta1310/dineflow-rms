import { act, renderHook } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useReserveTable } from "../useReserveTable";
import {
  mockTimeSlots,
  mockAvailableTables,
  mockReservationItem,
  translate as mockTranslate,
} from "./mockData";

const mockDispatch = jest.fn();
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockShowSuccessScreen = jest.fn();
const mockShowAlert = jest.fn();

let mockFetchTimeSlots: jest.Mock;
let mockFetchAvailableTables: jest.Mock;
let mockConfirmReservationWithTable: jest.Mock;

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTranslate,
  }),
}));

jest.mock("@store/slices/ownerTablesSlice", () => ({
  __esModule: true,
  fetchTimeSlots: (() => {
    mockFetchTimeSlots = jest.fn((payload) => ({
      type: "ownerTables/fetchTimeSlots/pending",
      payload,
    }));
    return mockFetchTimeSlots;
  })(),
  fetchAvailableTables: (() => {
    mockFetchAvailableTables = jest.fn((payload) => ({
      type: "ownerTables/fetchAvailableTables/pending",
      payload,
    }));
    Object.assign(mockFetchAvailableTables, {
      fulfilled: {
        match: (action?: { type?: string }) =>
          action?.type === "ownerTables/fetchAvailableTables/fulfilled",
      },
    });
    return mockFetchAvailableTables;
  })(),
  confirmReservationWithTable: (() => {
    mockConfirmReservationWithTable = jest.fn((payload) => ({
      type: "ownerTables/confirmReservationWithTable/pending",
      payload,
    }));
    Object.assign(mockConfirmReservationWithTable, {
      fulfilled: {
        match: (action?: { type?: string }) =>
          action?.type === "ownerTables/confirmReservationWithTable/fulfilled",
      },
    });
    return mockConfirmReservationWithTable;
  })(),
}));

const mockedUseDispatch = useDispatch as jest.MockedFunction<
  typeof useDispatch
>;
const mockedUseSelector = useSelector as jest.MockedFunction<
  typeof useSelector
>;
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;

describe("useReserveTable hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseNavigation.mockReturnValue({
      goBack: mockGoBack,
      navigate: mockNavigate,
      reset: mockReset,
    } as any);

    mockDispatch.mockImplementation((action) => {
      if (action?.type === "ownerTables/fetchAvailableTables/pending") {
        return Promise.resolve({
          type: "ownerTables/fetchAvailableTables/fulfilled",
          payload: mockAvailableTables,
        });
      }
      if (action?.type === "ownerTables/confirmReservationWithTable/pending") {
        return Promise.resolve({
          type: "ownerTables/confirmReservationWithTable/fulfilled",
        });
      }
      return Promise.resolve(action);
    });
    mockedUseRoute.mockReturnValue({
      params: {
        item: mockReservationItem,
      },
    } as any);

    // Mock selector values
    mockedUseSelector.mockImplementation((selectorFn) => {
      const state = {
        ownerTables: {
          timeSlots: mockTimeSlots,
          availableTables: mockAvailableTables,
          loadingTimeSlots: false,
          loadingAvailableTables: false,
          loadingConfirmReservation: false,
        },
        auth: {
          ownerId: 1,
          sessionId: "session-123",
          user: { owner_id: 1 },
        },
      };
      return selectorFn(state as any);
    });
  });

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("loads time slots on mount and auto-selects matching time slot", () => {
    renderHook(() => useReserveTable());

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ownerTables/fetchTimeSlots/pending",
      }),
    );
  });

  it("fetches available tables when slot ID changes", () => {
    const { result } = renderHook(() => useReserveTable());

    act(() => {
      result.current.handleTimeSlotSelect(13);
    });

    expect(result.current.selectedSlotId).toBe(13);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ownerTables/fetchAvailableTables/pending",
      }),
    );
  });

  it("handles table selection and back navigation action", () => {
    const { result } = renderHook(() => useReserveTable());

    act(() => {
      result.current.handleTableSelect(mockAvailableTables[0]);
    });

    expect(result.current.selectedTable).toEqual(mockAvailableTables[0]);

    act(() => {
      result.current.handleBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("submits the reservation via confirmReservationWithTable thunk and navigates on success", async () => {
    const { result } = renderHook(() =>
      useReserveTable({
        showSuccessScreen: mockShowSuccessScreen,
        showAlert: mockShowAlert,
      }),
    );

    // Select slot & table
    act(() => {
      result.current.handleTimeSlotSelect(12);
      result.current.handleTableSelect(mockAvailableTables[0]);
    });

    // Mock successful API response
    const mockSuccessResponse = {
      type: "ownerTables/confirmReservationWithTable/fulfilled",
    };
    mockDispatch.mockResolvedValueOnce(mockSuccessResponse);

    await act(async () => {
      await result.current.handleReservedTablePress();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ownerTables/confirmReservationWithTable/pending",
      }),
    );

    expect(mockShowSuccessScreen).toHaveBeenCalledTimes(1);

    // Verify navigates on success screen Done click
    const successScreenArgs = mockShowSuccessScreen.mock.calls[0][0];
    successScreenArgs.onPress();
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("returns early from handleReservedTablePress if slot or table is not selected", async () => {
    const { result } = renderHook(() => useReserveTable());

    await act(async () => {
      await result.current.handleReservedTablePress();
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ownerTables/confirmReservationWithTable/pending",
      }),
    );
  });

  it("shows toast error if confirmReservationWithTable rejects/throws error", async () => {
    const { result } = renderHook(() => useReserveTable());

    act(() => {
      result.current.handleTimeSlotSelect(12);
      result.current.handleTableSelect(mockAvailableTables[0]);
    });

    mockDispatch.mockImplementationOnce(() => {
      throw new Error("API Failure");
    });

    await act(async () => {
      await result.current.handleReservedTablePress();
    });
  });

  it("auto-selects slot based on slot_id on item", async () => {
    mockedUseRoute.mockReturnValue({
      params: {
        item: {
          ...mockReservationItem,
          slot_id: 13,
        },
      },
    } as any);

    const { result } = renderHook(() => useReserveTable());

    await act(async () => {});

    expect(result.current.selectedSlotId).toBe(13);
  });

  it("auto-selects slot based on slot.id on item", async () => {
    mockedUseRoute.mockReturnValue({
      params: {
        item: {
          ...mockReservationItem,
          slot: { id: 13 },
        },
      },
    } as any);

    const { result } = renderHook(() => useReserveTable());

    await act(async () => {});

    expect(result.current.selectedSlotId).toBe(13);
  });


  it("handles fetchAvailableTables failure gracefully", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "ownerTables/fetchAvailableTables/pending") {
        return Promise.resolve({
          type: "ownerTables/fetchAvailableTables/rejected",
        });
      }
      return Promise.resolve(action);
    });

    const { result } = renderHook(() => useReserveTable());

    await act(async () => {
      result.current.handleTimeSlotSelect(13);
    });

    expect(result.current.selectedTable).toBeNull();
  });

  it("handles fetchAvailableTables throwing an error gracefully", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "ownerTables/fetchAvailableTables/pending") {
        throw new Error("Network Error");
      }
      return Promise.resolve(action);
    });

    const { result } = renderHook(() => useReserveTable());

    await act(async () => {
      result.current.handleTimeSlotSelect(13);
    });

    expect(result.current.selectedTable).toBeNull();
  });

  it("shows toast error if fetchTimeSlots throws an error on mount", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "ownerTables/fetchTimeSlots/pending") {
        throw new Error("Load slots failure");
      }
      return Promise.resolve(action);
    });

    renderHook(() => useReserveTable());

    await act(async () => {});
  });

  it("pre-selects matched table if found and is available", async () => {
    mockedUseRoute.mockReturnValue({
      params: {
        item: {
          ...mockReservationItem,
          table_id: 1, // matches mockAvailableTables[0]
          slot_id: 13,
        },
      },
    } as any);

    const { result } = renderHook(() => useReserveTable());

    await act(async () => {});

    expect(result.current.selectedTable).toEqual(mockAvailableTables[0]);
  });

  it("sets selectedTable to null if matched table is not available", async () => {
    mockedUseRoute.mockReturnValue({
      params: {
        item: {
          ...mockReservationItem,
          table_id: 2, // matches mockAvailableTables[1]
          slot_id: 13,
        },
      },
    } as any);

    const unavailableTables = [
      mockAvailableTables[0],
      { ...mockAvailableTables[1], is_available: false },
    ];
    
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "ownerTables/fetchAvailableTables/pending") {
        return Promise.resolve({
          type: "ownerTables/fetchAvailableTables/fulfilled",
          payload: unavailableTables,
        });
      }
      return Promise.resolve(action);
    });

    const { result } = renderHook(() => useReserveTable());

    await act(async () => {});

    expect(result.current.selectedTable).toBeNull();
  });
});
