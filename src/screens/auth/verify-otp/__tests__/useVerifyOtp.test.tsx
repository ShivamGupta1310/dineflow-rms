import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import useVerifyOtp from "../useVerifyOtp";
import { setOwnerId, verifyOwnerOtp } from "@store/slices/authSlice";
import { GlobalContext } from "../../../../contexts/global.provider";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockReset = jest.fn();
const mockGetParent = jest.fn(() => ({
  reset: mockReset,
}));
const mockUseRoute = jest.fn(() => ({
  params: {},
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    getParent: mockGetParent,
    navigate: mockNavigate,
  }),
  useRoute: () => mockUseRoute(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: (...args: unknown[]) => mockShowToast(...args),
}));

jest.mock("@localization/i18n", () => ({
  t: (key: string) => key,
}));

jest.mock("@store/slices/authSlice", () => {
  const actual = jest.requireActual("@store/slices/authSlice");
  const mockThunk = Object.assign(jest.fn(), {
    fulfilled: {
      match: (result: any) => result?.type === "auth/verifyOwnerOtp/fulfilled",
    },
    rejected: {
      match: (result: any) => result?.type === "auth/verifyOwnerOtp/rejected",
    },
  });
  return {
    ...actual,
    verifyOwnerOtp: mockThunk,
  };
});

describe("useVerifyOtp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetParent.mockReturnValue({
      reset: mockReset,
    });
    mockUseRoute.mockReturnValue({
      params: {
        ownerId: 1,
      },
    });

    mockDispatch.mockResolvedValue({
      type: "auth/verifyOwnerOtp/fulfilled",
      payload: {
        success: true,
        message: "OTP verified successfully.",
      },
    });

    (verifyOwnerOtp as unknown as jest.Mock).mockReturnValue({
      type: "auth/verifyOwnerOtp",
      payload: {
        owner_id: 1,
        otp: "123456",
        device_id: "android_123456",
        device_name: "Samsung S24",
        device_type: "Android",
        app_version: "1.0.0",
      },
    });
  });

  it("starts with invalid otp and not loading", () => {
    const { result } = renderHook(() => useVerifyOtp());

    expect(result.current.isOtpValid).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.otp).toBe("");
  });

  it("reads rtl from global context", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GlobalContext.Provider
        value={
          {
            isRTL: true,
            setIsRTL: jest.fn(),
            language: "ar" as any,
            setLanguage: jest.fn(),
          } as any
        }
      >
        {children}
      </GlobalContext.Provider>
    );

    const { result } = renderHook(() => useVerifyOtp(), { wrapper });

    expect(result.current.isRTL).toBe(true);
  });

  it("does not dispatch when otp is invalid", async () => {
    const { result } = renderHook(() => useVerifyOtp());

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it("dispatches verifyOwnerOtp and shows success toast", async () => {
    const { result } = renderHook(() => useVerifyOtp());

    act(() => {
      result.current.setOtp("123456");
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "auth/verifyOwnerOtp" }),
      );
      expect(mockDispatch).toHaveBeenCalledWith(setOwnerId(1));
      expect(mockShowToast).toHaveBeenCalledWith(
        "success",
        "OTP verified successfully.",
      );
    });
  });

  it("uses the owner id passed from navigation params", async () => {
    mockUseRoute.mockReturnValueOnce({
      params: {
        ownerId: 42,
        phoneNumber: "9999999999",
        countryCode: 91,
        otp: "123456",
      },
    });

    const { result } = renderHook(() => useVerifyOtp());

    act(() => {
      result.current.setOtp("123456");
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(verifyOwnerOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        owner_id: 42,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(setOwnerId(42));
  });

  it("shows fallback error toast when thunk is rejected", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "auth/verifyOwnerOtp/rejected",
      payload: "Invalid OTP",
    });

    const { result } = renderHook(() => useVerifyOtp());

    act(() => {
      result.current.setOtp("123456");
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockShowToast).toHaveBeenCalledWith("error", "Invalid OTP");
  });

  it("navigates to waiter onboarding when waiter login is requested", () => {
    const { result } = renderHook(() => useVerifyOtp());

    act(() => {
      result.current.handleWaiterOnboarding();
    });

    expect(mockNavigate).toHaveBeenCalledWith("WaiterOnboarding");
  });
});
