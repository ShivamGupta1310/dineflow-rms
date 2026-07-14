import React from "react";
import { act, renderHook } from "@testing-library/react-native";

import { GlobalContext } from "../../../../contexts/global.provider";
import { useWaiterPasscode } from "../useWaiterPasscode";
import { verifyWaiterPasscode } from "@store/slices/authSlice";
import { waiterPasscodeState } from "./mockData";

const mockUseSelector = jest.fn();
const mockDispatch = jest.fn();
const mockShowToast = jest.fn();
const mockReset = jest.fn();
const mockGetParent = jest.fn(() => ({ reset: mockReset }));

jest.mock("react-redux", () => ({
  useSelector: (selector: any) => mockUseSelector(selector),
  useDispatch: () => mockDispatch,
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    getParent: mockGetParent,
  }),
}));

jest.mock("@store/slices/authSlice", () => {
  const mockThunk = Object.assign(
    jest.fn((payload) => payload),
    {
      fulfilled: {
        match: (action: any) =>
          action?.type === "auth/verifyWaiterPasscode/fulfilled",
      },
      rejected: {
        match: (action: any) =>
          action?.type === "auth/verifyWaiterPasscode/rejected",
      },
    },
  );

  return {
    verifyWaiterPasscode: mockThunk,
  };
});

jest.mock("@utils/toastHelper", () => ({
  showToast: (...args: unknown[]) => mockShowToast(...args),
}));

describe("useWaiterPasscode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockImplementation((action) => action);
    mockGetParent.mockReturnValue({ reset: mockReset });
    mockUseSelector.mockImplementation((selector: any) =>
      selector({
        auth: waiterPasscodeState,
      }),
    );
  });

  it("reads the selected waiter and owner id from redux", () => {
    const { result } = renderHook(() => useWaiterPasscode());

    expect(result.current.waiterName).toBe("Ravi Patel");
    expect(result.current.selectedWaiter?.staff_id).toBe(19);
    expect(result.current.ownerId).toBe(2);
    expect(result.current.waiterUser).toBeNull();
    expect(result.current.isPasscodeValid).toBe(false);
  });

  it("falls back when no waiter is selected", () => {
    mockUseSelector.mockImplementationOnce((selector: any) =>
      selector({
        auth: {
          ...waiterPasscodeState,
          selectedWaiter: null,
        },
      }),
    );

    const { result } = renderHook(() => useWaiterPasscode());

    expect(result.current.waiterName).toBe("");
    expect(result.current.selectedWaiter).toBeNull();
    expect(result.current.ownerId).toBe(2);
    expect(result.current.waiterUser).toBeNull();
  });

  it("reads rtl from global context", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GlobalContext.Provider
        value={
          {
            language: "ar" as any,
            isRTL: true,
            setLanguage: jest.fn(),
            setIsRTL: jest.fn(),
          } as any
        }
      >
        {children}
      </GlobalContext.Provider>
    );

    const { result } = renderHook(() => useWaiterPasscode(), { wrapper });

    expect(result.current.isRTL).toBe(true);
  });

  it("treats a 6 digit passcode as valid", () => {
    const { result } = renderHook(() => useWaiterPasscode());

    act(() => {
      result.current.setPasscode("123456");
    });

    expect(result.current.isPasscodeValid).toBe(true);
  });

  it("dispatches waiter passcode verification and stores waiter user on success", async () => {
    (verifyWaiterPasscode as unknown as jest.Mock).mockReturnValueOnce({
      type: "auth/verifyWaiterPasscode/fulfilled",
      payload: {
        success: true,
        message: "Verified",
        user: {
          staff_id: 19,
          owner_id: 2,
        },
      },
    });

    const { result } = renderHook(() => useWaiterPasscode());

    act(() => {
      result.current.setPasscode("123457");
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(verifyWaiterPasscode).toHaveBeenCalledWith(
      expect.objectContaining({
        owner_id: 2,
        staff_id: 19,
        passcode: "123457",
        role: "Captain",
      }),
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      "success",
      "waiter.waiterPasscode.loginSuccess",
      "Verified",
    );
  });

  it("shows an error toast when verification is rejected", async () => {
    (verifyWaiterPasscode as unknown as jest.Mock).mockReturnValueOnce({
      type: "auth/verifyWaiterPasscode/rejected",
      payload: "Invalid passcode",
    });

    const { result } = renderHook(() => useWaiterPasscode());

    act(() => {
      result.current.setPasscode("123457");
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      "error",
      "waiter.waiterPasscode.loginFailed",
      "Invalid passcode",
    );
  });
});
