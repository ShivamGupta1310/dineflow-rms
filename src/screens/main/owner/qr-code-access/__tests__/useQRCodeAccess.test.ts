import { act, renderHook } from "@testing-library/react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";

import { useQRCodeAccess } from "../useQRCodeAccess";
import { getItem } from "@utils/storage";
import { showToast } from "@utils/toastHelper";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@react-native-clipboard/clipboard", () => ({
  setString: jest.fn(),
}));

jest.mock("@utils/storage", () => ({
  ...jest.requireActual("@utils/storage"),
  getItem: jest.fn(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

const mockedUseNavigation = useNavigation as jest.Mock;
const mockedGetItem = getItem as jest.MockedFunction<typeof getItem>;
const mockedSetString = Clipboard.setString as jest.MockedFunction<
  typeof Clipboard.setString
>;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;

describe("useQRCodeAccess", () => {
  const mockGoBack = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedUseNavigation.mockReturnValue({
      goBack: mockGoBack,
    });
    mockedGetItem.mockReturnValue("12345");
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("reads owner access code from storage", () => {
    const { result } = renderHook(() => useQRCodeAccess());

    expect(mockedGetItem).toHaveBeenCalledWith("owner_accesscode");
    expect(result.current.ownerAccessCode).toBe("12345");
  });

  it("falls back to an empty owner access code when storage is empty", () => {
    mockedGetItem.mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useQRCodeAccess());

    expect(result.current.ownerAccessCode).toBe("");
  });

  it("copies the owner access code to clipboard", async () => {
    const { result } = renderHook(() => useQRCodeAccess());

    await act(async () => {
      await result.current.handleScanQRCode();
    });

    expect(mockedSetString).toHaveBeenCalledWith("12345");
    expect(mockedShowToast).toHaveBeenCalledWith(
      "success",
      "auth.qrCodeAccess.accessCodeCopied",
    );
  });

  it("goes back when handleGoBack is called", () => {
    const { result } = renderHook(() => useQRCodeAccess());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("shows error toast when clipboard copy fails", async () => {
    mockedSetString.mockImplementationOnce(() => {
      throw new Error("Clipboard unavailable");
    });

    const { result } = renderHook(() => useQRCodeAccess());

    await act(async () => {
      await result.current.handleScanQRCode();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.qrCodeAccess.errorAccessCodeCopied",
    );
  });
});
