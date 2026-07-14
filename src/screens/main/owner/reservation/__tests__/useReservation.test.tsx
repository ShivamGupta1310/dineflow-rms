import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { ROUTES } from "@constants";
import { GlobalContext } from "../../../../../contexts/global.provider";
import { ReservationStatus } from "@utils/constants";
import { showToast } from "@utils/toastHelper";
import { useReservation } from "../useReservation";

const mockDispatch = jest.fn();
const mockFetchReservations = jest.fn(() => ({
  type: "reservation/fetchReservations",
}));
const mockUpdateReservationStatus = jest.fn((payload: unknown) => ({
  type: "reservation/updateReservationStatus",
  payload,
}));
const mockNavigate = jest.fn();

let mockState: {
  auth: {
    ownerId: number | null;
    user: { owner_id?: number } | null;
  };
  reservation: {
    reservations: Array<{
      id: number;
      customer_name: string;
      customer_phone: string;
      total_guest: number;
      status: ReservationStatus;
      reservation_time: string;
      reservation_date: string;
    }>;
    loading: boolean;
    listNeedsRefresh: boolean;
  };
};
let focusEffectCallback: (() => void) | undefined;

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn(),
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
  fetchReservations: (...args: unknown[]) => mockFetchReservations(...args),
  updateReservationStatus: (...args: unknown[]) =>
    mockUpdateReservationStatus(...args),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<
  typeof useFocusEffect
>;
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockedCanOpenURL = jest.spyOn(Linking, "canOpenURL");
const mockedOpenURL = jest.spyOn(Linking, "openURL");

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

describe("useReservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    focusEffectCallback = undefined;

    mockState = {
      auth: {
        ownerId: 123,
        user: { owner_id: 123 },
      },
      reservation: {
        reservations: [
          {
            id: 1,
            customer_name: "Wade Warren",
            customer_phone: "+91 98765 43210",
            total_guest: 2,
            status: ReservationStatus.Pending,
            reservation_time: "20:00:00",
            reservation_date: "2026-05-26",
          },
          {
            id: 2,
            customer_name: "Raj Patel",
            customer_phone: "7897897890",
            total_guest: 4,
            status: ReservationStatus.Confirmed,
            reservation_time: "22:00:00",
            reservation_date: "2026-05-26",
          },
          {
            id: 3,
            customer_name: "Sara Khan",
            customer_phone: "8888801234",
            total_guest: 3,
            status: ReservationStatus.NeedConfirmation,
            reservation_time: "18:00:00",
            reservation_date: "2026-05-26",
          },
          {
            id: 4,
            customer_name: "Aman Verma",
            customer_phone: "7777701234",
            total_guest: 5,
            status: ReservationStatus.Cancelled,
            reservation_time: "21:15:00",
            reservation_date: "2026-05-26",
          },
        ],
        loading: false,
        listNeedsRefresh: false,
      },
    };

    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    mockedUseSelector.mockImplementation((selector: any) => selector(mockState));
    mockedUseFocusEffect.mockImplementation((callback: () => void) => {
      focusEffectCallback = callback;
    });
    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
    } as any);
    mockDispatch.mockImplementation((action) => action);
    mockedCanOpenURL.mockResolvedValue(true as never);
    mockedOpenURL.mockResolvedValue(true as never);
  });

  it("dispatches the reservation fetch action when the screen gains focus", () => {
    renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      focusEffectCallback?.();
    });

    expect(mockFetchReservations).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "reservation/fetchReservations",
    });
  });

  it("does not refetch on focus when returning without reservation updates", () => {
    renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      focusEffectCallback?.();
      focusEffectCallback?.();
    });

    expect(mockFetchReservations).toHaveBeenCalledTimes(1);
  });

  it("refetches on focus when reservation details marked the list as stale", () => {
    const { rerender } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      focusEffectCallback?.();
    });

    mockState.reservation.listNeedsRefresh = true;
    rerender({});

    act(() => {
      focusEffectCallback?.();
    });

    expect(mockFetchReservations).toHaveBeenCalledTimes(2);
  });

  it("returns loading state, rtl flag, and derived tab counts", () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(true),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isRTL).toBe(true);
    expect(result.current.selectedStatus).toBe("all");
    expect(result.current.tabContent).toEqual([
      expect.objectContaining({
        id: "1",
        title: "owner.reservation.tabs.all",
        status: "all",
        count: 4,
      }),
      expect.objectContaining({
        status: ReservationStatus.Pending,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.NeedConfirmation,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Confirmed,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Reserved,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.Cancelled,
        count: 1,
      }),
    ]);
  });

  it("filters reservations by guest name and phone search text", () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.setSearchText("  raj ");
    });

    expect(result.current.searchText).toBe("  raj ");
    expect(result.current.reservationList).toEqual([
      expect.objectContaining({
        customer_name: "Raj Patel",
      }),
    ]);
    expect(result.current.tabContent).toEqual([
      expect.objectContaining({
        status: "all",
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Pending,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.NeedConfirmation,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.Confirmed,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Reserved,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.Cancelled,
        count: 0,
      }),
    ]);

    act(() => {
      result.current.setSearchText("88888");
    });

    expect(result.current.reservationList).toEqual([
      expect.objectContaining({
        customer_name: "Sara Khan",
      }),
    ]);
    expect(result.current.tabContent).toEqual([
      expect.objectContaining({
        status: "all",
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Pending,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.NeedConfirmation,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Confirmed,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.Reserved,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.Cancelled,
        count: 0,
      }),
    ]);
  });

  it("filters reservations by selected status", () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.handleSelectedStatus(ReservationStatus.Pending);
    });

    expect(result.current.selectedStatus).toBe(ReservationStatus.Pending);
    expect(result.current.reservationList).toEqual([
      expect.objectContaining({
        status: ReservationStatus.Pending,
      }),
    ]);
    expect(result.current.tabContent).toEqual([
      expect.objectContaining({
        status: "all",
        count: 4,
      }),
      expect.objectContaining({
        status: ReservationStatus.Pending,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.NeedConfirmation,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Confirmed,
        count: 1,
      }),
      expect.objectContaining({
        status: ReservationStatus.Reserved,
        count: 0,
      }),
      expect.objectContaining({
        status: ReservationStatus.Cancelled,
        count: 1,
      }),
    ]);
  });

  it("fetches reservations when the selected status tab changes", () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.handleSelectedStatus(ReservationStatus.Pending);
    });

  });

  it("refreshes the reservation list and resets the refreshing state", async () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.onRefresh();
    });

    expect(result.current.refreshing).toBe(false);
  });

  it("navigates to reservation details with the selected reservation id", () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.handleReservationDetails(3);
    });

    expect(mockNavigate).toHaveBeenCalledWith("ReservationsDetails", {
      reservationId: 3,
    });
  });

  it("navigates to new reservation from the list screen", () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    act(() => {
      result.current.handleNewReservation();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NEW_RESERVATION);
  });

  it("opens the dialer with a trimmed phone number", async () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.openDialer(" 9876543210 ");
    });

    expect(mockedOpenURL).toHaveBeenCalledWith(
      expect.stringMatching(/^tel(prompt)?:9876543210$/),
    );
  });

  it("shows an error toast when calling is not supported on the device", async () => {
    mockedCanOpenURL.mockResolvedValueOnce(false as never);

    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.openDialer("9876543210");
    });

    expect(mockedOpenURL).not.toHaveBeenCalled();
    expect(mockedShowToast).toHaveBeenCalledWith(
      "info",
      "owner.reservation.callingNotSupportedOnDevice",
    );
  });

  it("does not open the dialer when the phone number is blank", async () => {
    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.openDialer("   ");
    });

    expect(mockedOpenURL).not.toHaveBeenCalled();
  });

  it("logs an error when opening the dialer fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockedOpenURL.mockRejectedValueOnce(new Error("Dialer failed"));

    const { result } = renderHook(() => useReservation(), {
      wrapper: wrapper(),
    });

    await act(async () => {
      await result.current.openDialer("9876543210");
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to open dialer",
      expect.any(Error),
    );
    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.reservation.unableToOpenDialer",
    );

    consoleErrorSpy.mockRestore();
  });

  it("calls update reservation on confirm ok and shows success on API success", async () => {
    const mockShowAlert = jest.fn();
    const mockShowSuccessScreen = jest.fn();

    mockDispatch.mockImplementation((action: any) => {
      if (action?.type === "reservation/updateReservationStatus") {
        return {
          unwrap: jest.fn().mockResolvedValue({
            success: true,
            message: "Reservation updated successfully",
          }),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useReservation({
          showAlert: mockShowAlert,
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: wrapper(),
      },
    );

    act(() => {
      result.current.handleConfirmReservation(mockState.reservation.reservations[0]);
    });

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.confirmReservation.title",
        onOk: expect.any(Function),
      }),
    );

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith({
      p_reservation_id: 1,
      p_status: ReservationStatus.Confirmed,
      p_staff_id: 123,
    });
    expect(mockShowSuccessScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.confirmReservation.successTitle",
        subtitle:
          "Wade Warren owner.reservation.confirmReservation.successSubtitle",
      }),
    );
  });

  it("does not show success when reservation update fails", async () => {
    const mockShowAlert = jest.fn();
    const mockShowSuccessScreen = jest.fn();

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
        useReservation({
          showAlert: mockShowAlert,
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: wrapper(),
      },
    );

    act(() => {
      result.current.handleConfirmReservation(mockState.reservation.reservations[0]);
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith({
      p_reservation_id: 1,
      p_status: ReservationStatus.Confirmed,
      p_staff_id: 123,
    });
    expect(mockShowSuccessScreen).not.toHaveBeenCalled();
  });

  it("calls update reservation on cancel ok and shows cancel success on API success", async () => {
    const mockShowAlert = jest.fn();
    const mockShowSuccessScreen = jest.fn();

    mockDispatch.mockImplementation((action: any) => {
      if (action?.type === "reservation/updateReservationStatus") {
        return {
          unwrap: jest.fn().mockResolvedValue({
            success: true,
            message: "Reservation updated successfully",
          }),
        };
      }

      return action;
    });

    const { result } = renderHook(
      () =>
        useReservation({
          showAlert: mockShowAlert,
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: wrapper(),
      },
    );

    act(() => {
      result.current.handleCancelReservation(mockState.reservation.reservations[0]);
    });

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "owner.reservation.cancelReservation.title",
        onOk: expect.any(Function),
      }),
    );

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith({
      p_reservation_id: 1,
      p_status: ReservationStatus.Cancelled,
      p_staff_id: 123,
    });
    expect(mockShowSuccessScreen).toHaveBeenCalledWith({
      title: "owner.reservation.cancelReservation.successTitle",
      subtitle: "owner.reservation.cancelReservation.successSubtitle",
    });
  });

  it("does not show cancel success when reservation update fails", async () => {
    const mockShowAlert = jest.fn();
    const mockShowSuccessScreen = jest.fn();

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
        useReservation({
          showAlert: mockShowAlert,
          showSuccessScreen: mockShowSuccessScreen,
        }),
      {
        wrapper: wrapper(),
      },
    );

    act(() => {
      result.current.handleCancelReservation(mockState.reservation.reservations[0]);
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk();
    });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith({
      p_reservation_id: 1,
      p_status: ReservationStatus.Cancelled,
      p_staff_id: 123,
    });
    expect(mockShowSuccessScreen).not.toHaveBeenCalled();
  });
});
