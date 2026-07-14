import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import { GlobalContext } from "../../../../../contexts/global.provider";
import { ROUTES } from "@constants";
import { ReservationStatus } from "@utils/constants";
import { showToast } from "@utils/toastHelper";
import { useReservationDetail } from "../useReservationDetail";

const mockDispatch = jest.fn();
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockFetchReservationDetails = jest.fn((reservationId: number) => ({
  type: "reservation/fetchReservationDetails",
  payload: reservationId,
}));
const mockUpdateReservationStatus = jest.fn((payload: unknown) => ({
  type: "reservation/updateReservationStatus",
  payload,
}));
const mockMarkReservationListForRefresh = jest.fn(() => ({
  type: "reservation/markReservationListForRefresh",
}));
const mockOpenDialer = jest.fn();
const mockFormatDisplayTime = jest.fn(() => "08:00 PM");
const mockFormatDisplayDate = jest.fn(() => "26 May 26, 10:01 AM");
const mockToSuperscriptOrdinal = jest.fn((value: string) => `formatted:${value}`);

let mockState: {
  auth: {
    ownerId: number | null;
    user: { owner_id?: number } | null;
  };
  reservation: {
    reservationDetail: {
      reservation_id: number;
      reservation_number: string;
      customer_name: string;
      customer_phone: string;
      reservation_date: string;
      reservation_time: string;
      total_guest: number;
      status: ReservationStatus;
      confirmation_status: string;
      reservation_type: string;
      source: string;
      notes: string | null;
      slot_id?: number;
      created_at: string;
      updated_at: string;
    } | null;
    reservationActivities: Array<{
      activity_type: string;
      activity_message: string;
      created_at: string;
    }>;
    detailLoading: boolean;
    listNeedsRefresh?: boolean;
  };
};

let mockRouteParams: { reservationId?: number } = { reservationId: 7 };

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@store/slices/reservationSlice", () => ({
  fetchReservationDetails: (...args: unknown[]) =>
    mockFetchReservationDetails(...(args as [number])),
  updateReservationStatus: (...args: unknown[]) =>
    mockUpdateReservationStatus(...args),
  markReservationListForRefresh: (...args: unknown[]) =>
    mockMarkReservationListForRefresh(...args),
}));

jest.mock("@utils", () => ({
  formatDisplayDate: (...args: unknown[]) =>
    mockFormatDisplayDate(...args),
  formatDisplayTime: (...args: unknown[]) =>
    mockFormatDisplayTime(...args),
  openDialer: (...args: unknown[]) => mockOpenDialer(...args),
  RESERVATION_TYPES: () => [
    { value: "walk_in", label: "Walk In" },
    { value: "advance", label: "Advance" },
  ],
  SOURCE_TYPES: () => [
    { value: "app", label: "App" },
    { value: "phone", label: "Phone" },
  ],
  toSuperscriptOrdinal: (...args: unknown[]) =>
    mockToSuperscriptOrdinal(...(args as [string])),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;

const wrapper =
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

describe("useReservationDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRouteParams = { reservationId: 7 };

    mockState = {
      auth: {
        ownerId: 123,
        user: { owner_id: 456 },
      },
    reservation: {
      reservationDetail: {
        reservation_id: 7,
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
        slot_id: 9,
        created_at: "2026-05-26T10:01:08.785329",
        updated_at: "2026-05-26T10:02:46.65495",
      },
        reservationActivities: [
          {
            activity_type: "reservation_created",
            activity_message: "Reservation created",
            created_at: "2026-05-26T10:01:08.785329",
          },
        ],
        detailLoading: false,
      },
    };

    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    mockedUseSelector.mockImplementation((selector: any) => selector(mockState));
    mockedUseNavigation.mockReturnValue({
      goBack: mockGoBack,
      navigate: mockNavigate,
    } as any);
    mockedUseRoute.mockReturnValue({
      params: mockRouteParams,
    } as any);
    mockDispatch.mockImplementation((action: any) => action);
  });

  it("dispatches reservation detail fetch on mount when reservation id exists", () => {
    renderHook(() => useReservationDetail(), {
      wrapper: wrapper(),
    });

    expect(mockFetchReservationDetails).toHaveBeenCalledWith(7);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/fetchReservationDetails",
      payload: 7,
    });
  });

  it("does not fetch reservation details when route params are missing", () => {
    mockRouteParams = {};
    mockedUseRoute.mockReturnValue({
      params: mockRouteParams,
    } as any);

    renderHook(() => useReservationDetail(), {
      wrapper: wrapper(),
    });

    expect(mockFetchReservationDetails).not.toHaveBeenCalled();
  });

  it("returns derived detail data, activity data, and RTL state", () => {
    const { result } = renderHook(() => useReservationDetail(), {
      wrapper: wrapper(true),
    });

    expect(result.current.isRTL).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.reservationActivities).toEqual(
      mockState.reservation.reservationActivities,
    );
    expect(result.current.reservationTime).toBe("08:00 PM");
    expect(result.current.reservationDetails).toEqual([
      {
        label: "owner.reservation.details.bookingId",
        value: "RES-1001",
      },
      {
        label: "owner.reservation.details.reservationType",
        value: "walk_in",
      },
      {
        label: "owner.reservation.details.createdOn",
        value: "formatted:26 May 26, 10:01 AM",
      },
      {
        label: "owner.reservation.details.source",
        value: "app",
      },
      {
        label: "owner.reservation.details.specialNotes",
        value: "Window seat",
      },
    ]);
  });

  it("navigates back when handleBack is called", () => {
    const { result } = renderHook(() => useReservationDetail(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.handleBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("opens the dialer with the customer phone number", async () => {
    const { result } = renderHook(() => useReservationDetail(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.handleCallGuest();
    });

    expect(mockOpenDialer).toHaveBeenCalledWith("+91 98765 43210");
  });

  it("does not open the dialer when the reservation has no phone number", async () => {
    mockState.reservation.reservationDetail = {
      ...mockState.reservation.reservationDetail!,
      customer_phone: "",
    };

    const { result } = renderHook(() => useReservationDetail(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.handleCallGuest();
    });

    expect(mockOpenDialer).not.toHaveBeenCalled();
  });

  it("navigates to edit reservation and reserve table actions", () => {
    const { result } = renderHook(() => useReservationDetail(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.handleEditReservation();
      result.current.handleReservedReservation();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NEW_RESERVATION, {
      reservationData: mockState.reservation.reservationDetail,
      slotId: 9,
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.RESERVE_TABLE, {
      item: mockState.reservation.reservationDetail,
    });
  });

  it("shows a confirm alert and updates the reservation on ok", async () => {
    const mockShowAlert = jest.fn();
    const mockShowSuccessScreen = jest.fn();

    mockDispatch.mockImplementation((action: any) => {
      if (action?.type === "reservation/updateReservationStatus") {
        return {
          unwrap: jest.fn().mockResolvedValue({
            success: true,
          }),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useReservationDetail({
          showAlert: mockShowAlert,
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: wrapper(),
      },
    );

    mockDispatch.mockClear();
    mockFetchReservationDetails.mockClear();
    mockMarkReservationListForRefresh.mockClear();

    act(() => {
      result.current.handleConfirmReservation();
    });

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.confirmReservation.title",
        subtitle:
          "owner.reservation.confirmReservation.subtitle Wade Warren common.questionMark",
        onOk: expect.any(Function),
      }),
    );

    await act(async () => {
      await mockShowAlert.mock.calls[0][0].onOk();
    });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith({
      p_reservation_id: 7,
      p_status: ReservationStatus.Confirmed,
      p_staff_id: 123,
    });
    expect(mockShowSuccessScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.confirmReservation.successTitle",
        subtitle:
          "Wade Warren owner.reservation.confirmReservation.successSubtitle",
        onPress: expect.any(Function),
      }),
    );
    expect(mockMarkReservationListForRefresh).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/markReservationListForRefresh",
    });

    await act(async () => {
      await mockShowSuccessScreen.mock.calls[0][0].onPress();
    });

    expect(mockFetchReservationDetails).toHaveBeenCalledWith(7);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/fetchReservationDetails",
      payload: 7,
    });
  });

  it("shows a cancel alert and uses the fallback owner id from auth.user", async () => {
    const mockShowAlert = jest.fn();
    const mockShowSuccessScreen = jest.fn();

    mockState.auth.ownerId = null;

    mockDispatch.mockImplementation((action: any) => {
      if (action?.type === "reservation/updateReservationStatus") {
        return {
          unwrap: jest.fn().mockResolvedValue({
            success: true,
          }),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useReservationDetail({
          showAlert: mockShowAlert,
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: wrapper(),
      },
    );

    mockDispatch.mockClear();
    mockFetchReservationDetails.mockClear();
    mockMarkReservationListForRefresh.mockClear();

    act(() => {
      result.current.handleCancelReservation();
    });

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.cancelReservation.title",
        subtitle:
          "owner.reservation.cancelReservation.subtitle Wade Warren common.questionMark",
        onOk: expect.any(Function),
      }),
    );

    await act(async () => {
      await mockShowAlert.mock.calls[0][0].onOk();
    });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith({
      p_reservation_id: 7,
      p_status: ReservationStatus.Cancelled,
      p_staff_id: 456,
    });
    expect(mockShowSuccessScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.cancelReservation.successTitle",
        subtitle: "owner.reservation.cancelReservation.successSubtitle",
        onPress: expect.any(Function),
      }),
    );
    expect(mockMarkReservationListForRefresh).toHaveBeenCalledTimes(1);

    await act(async () => {
      await mockShowSuccessScreen.mock.calls[0][0].onPress();
    });

    expect(mockFetchReservationDetails).toHaveBeenCalledWith(7);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/fetchReservationDetails",
      payload: 7,
    });
  });

  it("shows an error toast when owner id is unavailable during status update", async () => {
    const mockShowAlert = jest.fn();

    mockState.auth.ownerId = null;
    mockState.auth.user = null;

    const { result } = renderHook(
      () =>
        useReservationDetail({
          showAlert: mockShowAlert,
        }),
      {
        wrapper: wrapper(),
      },
    );

    act(() => {
      result.current.handleConfirmReservation();
    });

    await act(async () => {
      await mockShowAlert.mock.calls[0][0].onOk();
    });

    expect(mockUpdateReservationStatus).not.toHaveBeenCalled();
    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "common.unknownError",
    );
  });

  it("shows an error toast when updating reservation fails", async () => {
    const mockShowAlert = jest.fn();

    mockDispatch.mockImplementation((action: any) => {
      if (action?.type === "reservation/updateReservationStatus") {
        return {
          unwrap: jest.fn().mockRejectedValue(new Error("Request failed")),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useReservationDetail({
          showAlert: mockShowAlert,
        }),
      {
        wrapper: wrapper(),
      },
    );

    act(() => {
      result.current.handleConfirmReservation();
    });

    await act(async () => {
      await mockShowAlert.mock.calls[0][0].onOk();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "common.unknownError",
    );
  });
});
