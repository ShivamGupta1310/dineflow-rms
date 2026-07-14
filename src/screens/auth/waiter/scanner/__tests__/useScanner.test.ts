import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { useScanner } from "../useScanner";
import { ROUTES } from "@constants/routes";
import { setRole } from "@store/slices/authSlice";
import { getStaffByRole } from "@store/slices/waiterAuthSlice";
import { StorageKeys } from "@utils/constants";
import { setItem } from "@utils/storage";
import { showToast } from "@utils/toastHelper";
import { CAPTAIN_ROLE } from "@utils/authSession";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("@utils/storage", () => ({
  ...jest.requireActual("@utils/storage"),
  setItem: jest.fn(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@store/slices/waiterAuthSlice", () => {
  const mockGetStaffByRole = jest.fn((payload) => ({
    type: "waiterAuth/getStaffByRole",
    payload,
  }));

  mockGetStaffByRole.fulfilled = {
    match: jest.fn(
      (action) => action?.type === "waiterAuth/getStaffByRole/fulfilled",
    ),
  };

  mockGetStaffByRole.rejected = {
    match: jest.fn(
      (action) => action?.type === "waiterAuth/getStaffByRole/rejected",
    ),
  };

  return {
    getStaffByRole: mockGetStaffByRole,
  };
});

jest.mock("@store/slices/authSlice", () => ({
  __esModule: true,
  default: (state = {}, _action: unknown) => state,
  setRole: jest.fn((payload) => ({
    type: "auth/setRole",
    payload,
  })),
}));


const mockedUseDispatch = useDispatch as jest.Mock;
const mockedUseNavigation = useNavigation as jest.Mock;
const mockedGetStaffByRole = getStaffByRole as jest.MockedFunction<
  typeof getStaffByRole
>;
const mockedSetRole = setRole as jest.MockedFunction<typeof setRole>;
const mockedSetItem = setItem as jest.MockedFunction<typeof setItem>;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;

describe("useScanner", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockReset = jest.fn();
  let resolveDispatch: ((value: any) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    resolveDispatch = undefined;
    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
      reset: mockReset,
    });
  });

  it("updates passcode when handlePasscodeChange is called", () => {
    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.handlePasscodeChange("78563214");
    });

    expect(result.current.passcode).toBe("78563214");
  });

  it("does not dispatch button verification when input validation fails", async () => {
    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => false,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "button");
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("stores passcode when button verification succeeds", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/fulfilled",
      payload: {
        success: true,
      },
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "button");
    });

    expect(mockedGetStaffByRole).toHaveBeenCalledWith({
      passcode: "78563214",
      role: "Captain",
    });
    expect(mockedSetItem).toHaveBeenCalledWith(
      StorageKeys.RESTAURANT_ACCESS_CODE,
      "78563214",
    );
    expect(mockedSetRole).toHaveBeenCalledWith(CAPTAIN_ROLE);
    expect(mockedShowToast).toHaveBeenCalledWith(
      "success",
      "auth.onBoarding.restaurantLinkSuccess",
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/setRole",
      payload: CAPTAIN_ROLE,
    });
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: ROUTES.WAITER_LIST }],
    });
    expect(result.current.isButtonLoading).toBe(false);
  });

  it("uses button verification by default when no source is provided", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/fulfilled",
      payload: {
        success: true,
      },
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214");
    });

    expect(mockedGetStaffByRole).toHaveBeenCalledWith({
      passcode: "78563214",
      role: "Captain",
    });
    expect(mockedSetItem).toHaveBeenCalledWith(
      StorageKeys.RESTAURANT_ACCESS_CODE,
      "78563214",
    );
    expect(mockedShowToast).toHaveBeenCalledWith(
      "success",
      "auth.onBoarding.restaurantLinkSuccess",
    );
    expect(mockedSetRole).toHaveBeenCalledWith(CAPTAIN_ROLE);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/setRole",
      payload: CAPTAIN_ROLE,
    });
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: ROUTES.WAITER_LIST }],
    });
  });

  it("does not store passcode when button verification succeeds without success flag", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/fulfilled",
      payload: {
        success: false,
      },
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "button");
    });

    expect(mockedSetItem).not.toHaveBeenCalled();
    expect(mockedShowToast).not.toHaveBeenCalled();
    expect(result.current.isButtonLoading).toBe(false);
  });

  it("shows the rejected error and rescans when scan verification fails", async () => {
    const mockScanAgain = jest.fn();

    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/rejected",
      payload: "Invalid passcode.",
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.barcodeScannerRef.current = {
        scanAgain: mockScanAgain,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "scan");
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "Invalid passcode.",
    );
    expect(mockScanAgain).toHaveBeenCalledTimes(1);
    expect(result.current.isScanLoading).toBe(false);
  });

  it("shows fallback rejected error for button verification when payload is not a string", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/rejected",
      payload: {
        message: "Invalid passcode.",
      },
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "button");
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "auth.onBoarding.verificationFailedMessage",
    );
    expect(result.current.isButtonLoading).toBe(false);
  });

  it("shows a fallback error and rescans when verification throws", async () => {
    const mockScanAgain = jest.fn();

    mockDispatch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.barcodeScannerRef.current = {
        scanAgain: mockScanAgain,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "scan");
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "auth.onBoarding.verificationErrorMessage",
    );
    expect(mockScanAgain).toHaveBeenCalledTimes(1);
  });

  it("shows a fallback error for button verification when verification throws", async () => {
    mockDispatch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "button");
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "auth.onBoarding.verificationErrorMessage",
    );
    expect(result.current.isButtonLoading).toBe(false);
  });

  it("rescans immediately when handleScan receives an invalid barcode", () => {
    const mockScanAgain = jest.fn();

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.barcodeScannerRef.current = {
        scanAgain: mockScanAgain,
      } as any;
      result.current.handleScan({
        success: false,
        value: "",
      });
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockScanAgain).toHaveBeenCalledTimes(1);
  });

  it("updates passcode and verifies when handleScan receives a valid barcode", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/fulfilled",
      payload: {
        success: true,
      },
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.handleScan({
        success: true,
        value: "123456",
      });
    });

    expect(result.current.passcode).toBe("123456");

    await waitFor(() => {
      expect(mockedGetStaffByRole).toHaveBeenCalledWith({
        passcode: "123456",
        role: "Captain",
      });
    });

    expect(mockedSetItem).toHaveBeenCalledWith(
      StorageKeys.RESTAURANT_ACCESS_CODE,
      "123456",
    );
    expect(mockedSetRole).toHaveBeenCalledWith(CAPTAIN_ROLE);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/setRole",
      payload: CAPTAIN_ROLE,
    });
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: ROUTES.WAITER_LIST }],
    });
  });

  it("ignores additional scan events while scan verification is already in progress", async () => {
    mockDispatch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveDispatch = resolve;
        }),
    );

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.handleScan({
        success: true,
        value: "123456",
      });
      result.current.handleScan({
        success: true,
        value: "654321",
      });
    });

    expect(mockedGetStaffByRole).toHaveBeenCalledTimes(1);
    expect(mockedGetStaffByRole).toHaveBeenCalledWith({
      passcode: "123456",
      role: "Captain",
    });
    expect(result.current.passcode).toBe("123456");

    await act(async () => {
      resolveDispatch?.({
        type: "waiterAuth/getStaffByRole/fulfilled",
        payload: {
          success: true,
        },
      });
    });
  });

  it("ignores duplicate direct scan verification requests while a scan verify is running", async () => {
    mockDispatch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveDispatch = resolve;
        }),
    );

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.handleVerify("123456", "scan");
      result.current.handleVerify("654321", "scan");
    });

    expect(mockedGetStaffByRole).toHaveBeenCalledTimes(1);
    expect(mockedGetStaffByRole).toHaveBeenCalledWith({
      passcode: "123456",
      role: "Captain",
    });

    await act(async () => {
      resolveDispatch?.({
        type: "waiterAuth/getStaffByRole/fulfilled",
        payload: {
          success: true,
        },
      });
    });
  });

  it("does nothing when verification resolves with an unexpected action", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/pending",
    });

    const { result } = renderHook(() => useScanner());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      } as any;
    });

    await act(async () => {
      await result.current.handleVerify("78563214", "button");
    });

    expect(mockedSetItem).not.toHaveBeenCalled();
    expect(mockedShowToast).not.toHaveBeenCalled();
    expect(result.current.isButtonLoading).toBe(false);
  });
});
