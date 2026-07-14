import { act, renderHook } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { useOnBoarding } from "../useOnBoarding";
import { useCameraPermission } from "@components/barcode-scanner/useCameraPermission";
import { getStaffByRole } from "@store/slices/waiterAuthSlice";
import { setItem } from "@utils/storage";
import { showToast } from "@utils/toastHelper";
import { ROUTES } from "@constants/routes";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@components/barcode-scanner/useCameraPermission", () => ({
  useCameraPermission: jest.fn(),
}));

jest.mock("@utils/authSession", () => ({
  OWNER_ROLE: "owner",
  CAPTAIN_ROLE: "captain",
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

const mockedUseDispatch = useDispatch as jest.Mock;
const mockedUseSelector = useSelector as jest.Mock;
const mockedUseNavigation = useNavigation as jest.Mock;
const mockedUseCameraPermission = useCameraPermission as jest.MockedFunction<
  typeof useCameraPermission
>;
const mockedGetStaffByRole = getStaffByRole as jest.MockedFunction<
  typeof getStaffByRole
>;
const mockedSetItem = setItem as jest.MockedFunction<typeof setItem>;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;

describe("useOnBoarding", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockReset = jest.fn();
  const mockRequestCameraPermission = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        waiterAuth: {
          loading: false,
        },
      }),
    );
    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
      reset: mockReset,
    });
    mockedUseCameraPermission.mockReturnValue({
      cameraPermissionStatus: "granted",
      requestCameraPermission: mockRequestCameraPermission,
      openAppSettings: jest.fn(),
    });
  });

  it("updates passcode when handlePasscodeChange is called", () => {
    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.handlePasscodeChange("78563214");
    });

    expect(result.current.passcode).toBe("78563214");
  });

  it("does not dispatch verify when input validation fails", async () => {
    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.inputRef.current = {
        validate: () => false,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("stores passcode when verify succeeds", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/fulfilled",
      payload: {
        success: true,
      },
    });

    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.handlePasscodeChange("78563214");
      result.current.inputRef.current = {
        validate: () => true,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockedGetStaffByRole).toHaveBeenCalledWith({
      passcode: "78563214",
      role: "Captain",
    });
    expect(mockedSetItem).toHaveBeenCalledWith("restaurant_accesscode", "78563214");
    expect(mockedShowToast).toHaveBeenCalledWith(
      "success",
      "auth.onBoarding.restaurantLinkSuccess",
    );
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: ROUTES.WAITER_LIST }],
    });
  });

  it("shows error toast when verify is rejected", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/rejected",
      payload: "Invalid passcode.",
    });

    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.handlePasscodeChange("78563214");
      result.current.inputRef.current = {
        validate: () => true,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "Invalid passcode.",
    );
  });

  it("shows fallback rejected toast when payload is not a string", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/rejected",
      payload: {
        message: "Invalid passcode.",
      },
    });

    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.handlePasscodeChange("78563214");
      result.current.inputRef.current = {
        validate: () => true,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "auth.onBoarding.verificationFailedMessage",
    );
  });

  it("does not store passcode when verify succeeds without success flag", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/fulfilled",
      payload: {
        success: false,
      },
    });

    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.handlePasscodeChange("78563214");
      result.current.inputRef.current = {
        validate: () => true,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockedSetItem).not.toHaveBeenCalled();
    expect(mockedShowToast).not.toHaveBeenCalled();
  });

  it("does nothing when verify resolves with an unexpected action", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/getStaffByRole/pending",
    });

    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.handlePasscodeChange("78563214");
      result.current.inputRef.current = {
        validate: () => true,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockedSetItem).not.toHaveBeenCalled();
    expect(mockedShowToast).not.toHaveBeenCalled();
  });

  it("shows fallback toast when verify throws", async () => {
    mockDispatch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useOnBoarding());

    act(() => {
      result.current.inputRef.current = {
        validate: () => true,
      };
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "auth.onBoarding.verificationErrorMessage",
    );
  });

  it("navigates to scanner when camera permission is granted", async () => {
    mockRequestCameraPermission.mockResolvedValueOnce(true);

    const { result } = renderHook(() => useOnBoarding());

    await act(async () => {
      await result.current.handleScanQRCode();
    });

    expect(mockRequestCameraPermission).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.WAITER_SCANNER);
  });

  it("does not navigate to scanner when camera permission is denied", async () => {
    mockRequestCameraPermission.mockResolvedValueOnce(false);

    const { result } = renderHook(() => useOnBoarding());

    await act(async () => {
      await result.current.handleScanQRCode();
    });

    expect(mockRequestCameraPermission).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not request camera permission while loading", async () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        waiterAuth: {
          loading: true,
        },
      }),
    );

    const { result } = renderHook(() => useOnBoarding());

    await act(async () => {
      await result.current.handleScanQRCode();
    });

    expect(mockRequestCameraPermission).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
