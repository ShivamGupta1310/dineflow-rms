import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ROUTES } from "@constants";

import { useNewReservation } from "../useNewReservation";
import {
  createGlobalWrapper,
  mockFutureTimeSlot,
  mockNextDay,
  mockOwnerTimeSlots,
  mockPastTimeSlot,
  mockReservationForm,
  mockSelectedDate,
  mockSuccessPayload,
  translate as mockTranslate,
} from "./mockData";

const mockDispatch = jest.fn();
const mockGoBack = jest.fn();
const mockNavigationDispatch = jest.fn();
const mockReset = jest.fn();
const mockShowSuccessScreen = jest.fn();
let mockCreateReservation: jest.Mock;
const mockFetchReservationMeta = jest.fn(() => ({
  type: "reservation/fetchReservationMeta/pending",
}));
const mockClearTimeSlots = jest.fn(() => ({
  type: "ownerTables/clearTimeSlots",
}));
const mockFetchTimeSlots = jest.fn((payload: unknown) => ({
  type: "ownerTables/fetchTimeSlots/pending",
  payload,
}));
const mockShowToast = jest.fn();
const mockMarkReservationListForRefresh = jest.fn(() => ({
  type: "reservation/markReservationListForRefresh",
}));
const mockUseRouteParams: {
  reservationData?: Record<string, unknown>;
  slotId?: number;
} = {
  reservationData: undefined,
  slotId: undefined,
};

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  CommonActions: {
    navigate: jest.fn((config) => ({
      type: "NAVIGATE",
      payload: config,
    })),
  },
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockTranslate,
  }),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: (...args: unknown[]) => mockShowToast(...args),
}));

jest.mock("@store/slices/reservationSlice", () => ({
  __esModule: true,
  createReservation: (() => {
    mockCreateReservation = jest.fn((payload: unknown) => ({
      type: "reservation/createReservation/pending",
      payload,
    }));

    Object.assign(mockCreateReservation, {
      fulfilled: {
        match: (action: { type?: string }) =>
          action.type === "reservation/createReservation/fulfilled",
      },
    });

    return mockCreateReservation;
  })(),
  fetchReservationMeta: (...args: unknown[]) => mockFetchReservationMeta(...args),
  markReservationListForRefresh: (...args: unknown[]) =>
    mockMarkReservationListForRefresh(...args),
}));

jest.mock("@store/slices/ownerTablesSlice", () => ({
  clearTimeSlots: (...args: unknown[]) => mockClearTimeSlots(...args),
  fetchTimeSlots: (...args: unknown[]) => mockFetchTimeSlots(...args),
}));

const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;

describe("useNewReservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 5, 26, 10, 30, 0));
    mockUseRouteParams.reservationData = undefined;
    mockUseRouteParams.slotId = undefined;

    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    mockedUseNavigation.mockReturnValue({
      goBack: mockGoBack,
      getState: () => ({
        index: 1,
        routes: [{ name: "Reservations" }, { name: "NewReservation" }],
      }),
      dispatch: mockNavigationDispatch,
      reset: mockReset,
      navigate: jest.fn(),
    } as any);
    mockedUseRoute.mockReturnValue({
      params: mockUseRouteParams,
    } as any);
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({
        auth: {
          ownerId: 42,
          sessionId: "session-123",
          user: { owner_id: 42 },
        },
        ownerTables: {
          timeSlots: mockOwnerTimeSlots,
          loadingTimeSlots: false,
        },
        reservation: {
          createLoading: false,
          metaLoading: false,
          reservationMeta: {
            reservationTypes: [],
            reservationSources: [],
          },
        },
      }),
    );
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "reservation/createReservation/pending") {
        return {
          type: "reservation/createReservation/fulfilled",
          payload: {
            ...mockSuccessPayload,
            data: [{ id: 21 }],
          },
        };
      }

      if (action?.type === "ownerTables/fetchTimeSlots/pending") {
        return {
          ...action,
          unwrap: jest.fn().mockResolvedValue(undefined),
        };
      }

      return action;
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("derives the initial state and month label", () => {
    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(true),
      },
    );

    expect(result.current.isRTL).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.monthYear).toBe("June 2026");
    expect(result.current.selectedDate).toEqual(new Date(2026, 5, 26, 10, 30, 0));
    expect(result.current.COUNTRY_CODE).toBe(91);
    expect(result.current.timeSlots).toEqual(mockOwnerTimeSlots);
    expect(result.current.isCreateReservationDisabled).toBe(true);
  });

  it("fetches reservation meta on mount and loads time slots for today's default date", async () => {
    renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    expect(mockFetchReservationMeta).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/fetchReservationMeta/pending",
    });
    expect(mockClearTimeSlots).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ownerTables/clearTimeSlots",
    });

    await waitFor(() => {
      expect(mockFetchTimeSlots).toHaveBeenCalledWith({
        p_owner_id: 42,
        p_session_id: "session-123",
        p_date: "2026-06-26",
      });
    });
  });

  it("falls back to auth.user.owner_id and defaults reservation metadata in create mode", async () => {
    const createModeState = {
      auth: {
        ownerId: null,
        sessionId: "session-123",
        user: { owner_id: 84 },
      },
      ownerTables: {
        timeSlots: mockOwnerTimeSlots,
        loadingTimeSlots: false,
      },
      reservation: {
        createLoading: false,
        metaLoading: false,
        reservationMeta: {
          reservationTypes: [{ id: 3, name: "Advance" }],
          reservationSources: [{ id: 4, name: "Admin Panel" }],
        },
      },
    };
    mockedUseSelector.mockImplementation((selector: any) => selector(createModeState));

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    expect(result.current.selectedDate).toEqual(new Date(2026, 5, 26, 10, 30, 0));
    expect(result.current.reservationType).toBe(3);
    expect(result.current.source).toBe(4);

    await waitFor(() => {
      expect(mockFetchTimeSlots).toHaveBeenCalledWith({
        p_owner_id: 84,
        p_session_id: "session-123",
        p_date: "2026-06-26",
      });
    });
  });

  it("prefills form state from reservation data in edit mode", () => {
    const editReservationData = {
      reservation_id: 77,
      reservation_number: "RES-0077",
      customer_name: "Rahul Shah",
      customer_phone: "9876543210",
      reservation_date: "2026-06-28",
      reservation_time: "20:00:00",
      total_guest: 6,
      status: "confirmed",
      confirmation_status: "confirmed",
      reservation_type: "corporate",
      source: "partner",
      notes: "Birthday setup",
      created_at: "2026-06-28T10:00:00",
      updated_at: "2026-06-28T11:00:00",
      reservation_type_id: 8,
      reservation_source_id: 5,
    };
    const editModeState = {
      auth: {
        ownerId: 42,
        sessionId: "session-123",
        user: { owner_id: 42 },
      },
      ownerTables: {
        timeSlots: mockOwnerTimeSlots,
        loadingTimeSlots: false,
      },
      reservation: {
        createLoading: false,
        metaLoading: false,
        reservationMeta: {
          reservationTypes: [
            { id: 8, name: "Corporate" },
            { id: 1, name: "Standard" },
          ],
          reservationSources: [
            { id: 5, name: "Partner" },
            { id: 1, name: "Online" },
          ],
        },
      },
    };

    mockedUseRoute.mockReturnValue({
      params: {
        reservationData: editReservationData,
        slotId: 9,
      },
    } as any);
    mockedUseSelector.mockImplementation((selector: any) => selector(editModeState));

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    expect(result.current.selectedDate).toEqual(new Date(2026, 5, 28));
    expect(result.current.fullName).toBe("Rahul Shah");
    expect(result.current.guestCount).toBe("6");
    expect(result.current.mobileNumber).toBe("9876543210");
    expect(result.current.reservationType).toBe(8);
    expect(result.current.source).toBe(5);
    expect(result.current.notes).toBe("Birthday setup");
    expect(result.current.selectedTimeSlot).toBe(9);
  });

  it("loads time slots only once on mount in edit mode", async () => {
    const editModeState = {
      auth: {
        ownerId: 42,
        sessionId: "session-123",
        user: { owner_id: 42 },
      },
      ownerTables: {
        timeSlots: mockOwnerTimeSlots,
        loadingTimeSlots: false,
      },
      reservation: {
        createLoading: false,
        metaLoading: false,
        reservationMeta: {
          reservationTypes: [{ id: 8, name: "Corporate" }],
          reservationSources: [{ id: 5, name: "Partner" }],
        },
      },
    };

    mockedUseRoute.mockReturnValue({
      params: {
        reservationData: {
          reservation_id: 77,
          reservation_date: "2026-06-28",
          customer_name: "Rahul Shah",
          customer_phone: "9876543210",
          total_guest: 6,
          notes: "Birthday setup",
          reservation_type_id: 8,
          reservation_source_id: 5,
        },
        slotId: 9,
      },
    } as any);
    mockedUseSelector.mockImplementation((selector: any) => selector(editModeState));

    renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    await waitFor(() => {
      expect(mockFetchTimeSlots).toHaveBeenCalledWith({
        p_owner_id: 42,
        p_session_id: "session-123",
        p_date: "2026-06-28",
      });
    });

    expect(mockFetchTimeSlots).toHaveBeenCalledTimes(1);
  });

  it("clears the selected time slot when the reservation date changes", () => {
    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.setSelectedTimeSlot(mockPastTimeSlot);
      result.current.handleDateChanged(mockSelectedDate);
    });

    expect(result.current.selectedDate).toEqual(mockSelectedDate);
    expect(result.current.selectedTimeSlot).toBeNull();
  });

  it("preserves the route slot when the selected date matches the reservation date", () => {
    const editModeState = {
      auth: {
        ownerId: 42,
        sessionId: "session-123",
        user: { owner_id: 42 },
      },
      ownerTables: {
        timeSlots: mockOwnerTimeSlots,
        loadingTimeSlots: false,
      },
      reservation: {
        createLoading: false,
        metaLoading: false,
        reservationMeta: {
          reservationTypes: [{ id: 8, name: "Corporate" }],
          reservationSources: [{ id: 5, name: "Partner" }],
        },
      },
    };

    mockedUseRoute.mockReturnValue({
      params: {
        reservationData: {
          reservation_id: 77,
          reservation_date: "2026-06-28",
          customer_name: "Rahul Shah",
          customer_phone: "9876543210",
          total_guest: 6,
          notes: "Birthday setup",
          reservation_type_id: 8,
          reservation_source_id: 5,
        },
        slotId: 9,
      },
    } as any);
    mockedUseSelector.mockImplementation((selector: any) => selector(editModeState));

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.setSelectedTimeSlot(null);
      result.current.handleDateChanged(new Date(2026, 5, 28));
    });

    expect(result.current.selectedTimeSlot).toBe(9);
  });

  it("shows a toast when loading time slots fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    mockDispatch.mockImplementation((action) => {
      if (action?.type === "ownerTables/fetchTimeSlots/pending") {
        return {
          ...action,
          unwrap: jest.fn().mockRejectedValue(new Error("boom")),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.handleDateChanged(mockSelectedDate);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "error",
        "owner.newReservation.error.timeSlotError",
      );
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "time slot error",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("restricts non-numeric characters from the mobile input", () => {
    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.handleMobileChange("98a7-65b4c3");
    });

    expect(result.current.mobileNumber).toBe("9876543");
  });

  it("clears the mobile validation error when the input changes again", async () => {
    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.setSelectedDate(mockNextDay);
      result.current.setSelectedTimeSlot(mockFutureTimeSlot);
      result.current.setFullName(mockReservationForm.fullName);
      result.current.setGuestCount(mockReservationForm.guestCount);
      result.current.handleMobileChange("123");
      result.current.setReservationType(mockReservationForm.reservationType);
      result.current.setSource(mockReservationForm.source);
    });

    await act(async () => {
      await result.current.handleCreateReservation();
    });

    expect(result.current.mobileErrorText).toBe(
      "Please enter a valid mobile number",
    );

    act(() => {
      result.current.handleMobileChange("9876543210");
    });

    expect(result.current.mobileErrorText).toBeNull();
    expect(result.current.mobileNumber).toBe("9876543210");
  });

  it("shows validation error for invalid mobile number", async () => {
    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.setSelectedDate(mockNextDay);
      result.current.setSelectedTimeSlot(mockFutureTimeSlot);
      result.current.setFullName(mockReservationForm.fullName);
      result.current.setGuestCount(mockReservationForm.guestCount);
      result.current.handleMobileChange("123");
      result.current.setReservationType(mockReservationForm.reservationType);
      result.current.setSource(mockReservationForm.source);
      result.current.setNotes(mockReservationForm.notes);
    });

    await act(async () => {
      await result.current.handleCreateReservation();
    });

    expect(result.current.mobileErrorText).toBe(
      "Please enter a valid mobile number",
    );
    expect(mockCreateReservation).not.toHaveBeenCalled();
    expect(mockMarkReservationListForRefresh).not.toHaveBeenCalled();
    expect(mockShowSuccessScreen).not.toHaveBeenCalled();
  });

  it("submits a reservation and opens the success screen", async () => {
    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.setSelectedDate(mockNextDay);
      result.current.setSelectedTimeSlot(mockFutureTimeSlot);
      result.current.setFullName(mockReservationForm.fullName);
      result.current.setGuestCount(mockReservationForm.guestCount);
      result.current.handleMobileChange(mockReservationForm.mobileNumber);
      result.current.setReservationType(mockReservationForm.reservationType);
      result.current.setSource(mockReservationForm.source);
      result.current.setNotes(mockReservationForm.notes);
    });

    await act(async () => {
      await result.current.handleCreateReservation();
    });

    expect(mockCreateReservation).toHaveBeenCalledWith({
      customerName: "Vivyan Patel",
      customerPhone: "9876543210",
      reservationDate: mockNextDay,
      reservationTime: mockFutureTimeSlot,
      totalGuest: 4,
      notes: "Table near window",
      reservationTypeId: 8,
      reservationSourceId: 5,
      reservationId: undefined,
    });
    expect(mockShowSuccessScreen).toHaveBeenCalledWith(
      expect.objectContaining(mockSuccessPayload),
    );
    expect(mockMarkReservationListForRefresh).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/markReservationListForRefresh",
    });

    const successProps = mockShowSuccessScreen.mock.calls[0][0];
    act(() => {
      successProps.onPress();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("uses the existing reservation id on success when editing", async () => {
    const editModeState = {
      auth: {
        ownerId: 42,
        sessionId: "session-123",
        user: { owner_id: 42 },
      },
      ownerTables: {
        timeSlots: mockOwnerTimeSlots,
        loadingTimeSlots: false,
      },
      reservation: {
        createLoading: false,
        metaLoading: false,
        reservationMeta: {
          reservationTypes: [{ id: 8, name: "Corporate" }],
          reservationSources: [{ id: 5, name: "Partner" }],
        },
      },
    };
    mockedUseRoute.mockReturnValue({
      params: {
        reservationData: {
          reservation_id: 42,
          reservation_time: "20:00:00",
          reservation_date: "2026-06-28",
          total_guest: 4,
          customer_name: "Existing Guest",
          customer_phone: "9999999999",
          notes: "Existing note",
          reservation_type_id: 8,
          reservation_source_id: 5,
        },
        slotId: 9,
      },
    } as any);
    mockedUseSelector.mockImplementation((selector: any) => selector(editModeState));
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "reservation/createReservation/pending") {
        return {
          type: "reservation/createReservation/fulfilled",
          payload: {
            ...mockSuccessPayload,
            data: null,
          },
        };
      }

      if (action?.type === "ownerTables/fetchTimeSlots/pending") {
        return {
          ...action,
          unwrap: jest.fn().mockResolvedValue(undefined),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    await act(async () => {
      await result.current.handleCreateReservation();
    });

    const successProps = mockShowSuccessScreen.mock.calls[0][0];
    act(() => {
      successProps.onPress();
    });

    expect(mockReset).toHaveBeenCalledWith({
      index: 1,
      routes: [
        {
          name: ROUTES.MAIN_TABS,
          params: {
            screen: ROUTES.RESERVATIONS,
          },
        },
        {
          name: ROUTES.RESERVATIONS_DETAILS,
          params: {
            reservationId: 42,
          },
        },
      ],
    });
  });

  it("does not show the success screen when createReservation is not fulfilled", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "reservation/createReservation/pending") {
        return {
          type: "reservation/createReservation/rejected",
        };
      }

      if (action?.type === "ownerTables/fetchTimeSlots/pending") {
        return {
          ...action,
          unwrap: jest.fn().mockResolvedValue(undefined),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    act(() => {
      result.current.setSelectedDate(mockNextDay);
      result.current.setSelectedTimeSlot(mockFutureTimeSlot);
      result.current.setFullName(mockReservationForm.fullName);
      result.current.setGuestCount(mockReservationForm.guestCount);
      result.current.handleMobileChange(mockReservationForm.mobileNumber);
      result.current.setReservationType(mockReservationForm.reservationType);
      result.current.setSource(mockReservationForm.source);
      result.current.setNotes(mockReservationForm.notes);
    });

    await act(async () => {
      await result.current.handleCreateReservation();
    });

    expect(mockCreateReservation).toHaveBeenCalledTimes(1);
    expect(mockMarkReservationListForRefresh).not.toHaveBeenCalled();
    expect(mockShowSuccessScreen).not.toHaveBeenCalled();
  });

  it("does not submit when the form is disabled or loading", async () => {
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({
        auth: {
          ownerId: 42,
          sessionId: "session-123",
          user: { owner_id: 42 },
        },
        ownerTables: {
          timeSlots: mockOwnerTimeSlots,
          loadingTimeSlots: false,
        },
        reservation: {
          createLoading: true,
          metaLoading: false,
          reservationMeta: {
            reservationTypes: [],
            reservationSources: [],
          },
        },
      }),
    );

    const { result } = renderHook(
      () =>
        useNewReservation({
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: createGlobalWrapper(),
      },
    );

    await act(async () => {
      await result.current.handleCreateReservation();
    });

    expect(mockCreateReservation).not.toHaveBeenCalled();
    expect(mockMarkReservationListForRefresh).not.toHaveBeenCalled();
    expect(mockShowSuccessScreen).not.toHaveBeenCalled();
  });
});
