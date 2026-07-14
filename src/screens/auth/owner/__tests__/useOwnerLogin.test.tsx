import React from "react";
import {act, renderHook} from "@testing-library/react-native";

import {GlobalContext} from "../../../../contexts/global.provider";
import {useOwnerLogin} from "../useOwnerLogin";
import {getItem, removeItem, setItem} from "@utils/storage";
import { changeAppLanguage } from "@utils/language";

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockSetIsRTL = jest.fn();
let mockSendOwnerOtp: jest.Mock;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      auth: {
        loading: false,
      },
    }),
}));
jest.mock("@utils/language", () => ({
  changeAppLanguage: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@store/slices/authSlice", () => ({
  sendOwnerOtp: (() => {
    mockSendOwnerOtp = jest.fn((payload) => ({
      type: "auth/sendOwnerOtp/fulfilled",
      payload: {
        success: true,
        owner_id: 7,
        otp: "123456",
        message: "OTP sent successfully",
        ...payload,
      },
    }));

    Object.assign(mockSendOwnerOtp, {
      fulfilled: {
        match: (action: {type?: string}) =>
          action?.type === "auth/sendOwnerOtp/fulfilled",
      },
      rejected: {
        match: (action: {type?: string}) =>
          action?.type === "auth/sendOwnerOtp/rejected",
      },
    });

    return mockSendOwnerOtp;
  })(),
}));

jest.mock("@utils/storage", () => ({
  ...jest.requireActual("@utils/storage"),
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockedGetItem = getItem as jest.Mock;
const mockedSetItem = setItem as jest.Mock;
const mockedRemoveItem = removeItem as jest.Mock;

describe("useOwnerLogin", () => {
  const wrapper = ({children}: {children: React.ReactNode}) => (
    <GlobalContext.Provider
      value={{
        language: "en" as any,
        isRTL: false,
        setLanguage: jest.fn(),
        setIsRTL: mockSetIsRTL,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockReturnValue(null);
    mockDispatch.mockImplementation((action) => action);
  });

  it("starts with a blank form when no owner login is stored", () => {
    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    expect(result.current.mobileNumber).toBe("");
    expect(result.current.rememberMe).toBe(false);
  });

  it("prefills the stored mobile number from parsed storage object", () => {
    mockedGetItem.mockReturnValue({mobileNumber: "8888888888"});

    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    expect(result.current.mobileNumber).toBe("8888888888");
    expect(result.current.rememberMe).toBe(true);
  });

  it("prefills the stored mobile number from legacy JSON string storage", () => {
    mockedGetItem.mockReturnValue(JSON.stringify({mobileNumber: "7777777777"}));

    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    expect(result.current.mobileNumber).toBe("7777777777");
    expect(result.current.rememberMe).toBe(true);
  });

  it("ignores malformed stored owner login data", () => {
    mockedGetItem.mockReturnValueOnce("not-json");

    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    expect(result.current.mobileNumber).toBe("");
    expect(result.current.rememberMe).toBe(false);
  });

  it("restricts non-numeric characters from the mobile input", () => {
    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    act(() => {
      result.current.handleMobileChange("98a7-65b4c3");
    });

    expect(result.current.mobileNumber).toBe("9876543");
  });

  it("shows required validation when mobile number is empty", async () => {
    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(result.current.mobileErrorText).toBe("auth.login.errors.mobileRequired");
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid mobile number", async () => {
    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    act(() => {
      result.current.handleMobileChange("123");
    });

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(result.current.mobileErrorText).toBe("auth.login.errors.mobileInvalid");
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("submits OTP request and navigates on success", async () => {
    mockedGetItem.mockReturnValue({mobileNumber: "9999999999"});

    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(mockSendOwnerOtp).toHaveBeenCalledWith({
      phone_number: "9999999999",
      country_code: 91,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockedSetItem).toHaveBeenCalledWith(
      "owner-login",
      JSON.stringify({mobileNumber: "9999999999"}),
    );
    expect(mockNavigate).toHaveBeenCalledWith("Verification", {
      phoneNumber: "9999999999",
      countryCode: 91,
      ownerId: 7,
      otp: "123456",
    });
  });

  it("does not persist owner login when remember me is off", async () => {
    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    act(() => {
      result.current.handleMobileChange("6666666666");
    });

    await act(async () => {
      await result.current.handleContinue();
    });

    expect(mockedSetItem).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("Verification", {
      phoneNumber: "6666666666",
      countryCode: 91,
      ownerId: 7,
      otp: "123456",
    });
  });
  it("should apply language and close sheet", async () => {
    const { result } = renderHook(() => useOwnerLogin());
    act(() => {
      result.current.onLanguageChipPress();
    });

    act(() => {
      result.current.toggleLanguageSheet(true);
    });

    await act(async () => {
      await result.current.handleLanguageApply("AR");
    });

    expect(changeAppLanguage).toHaveBeenCalledWith("AR");
    expect(result.current.showLanguageSheet).toBe(false);
    expect(result.current.language).toBe("AR");
  });
  it("persists and clears remembered mobile number when toggled", () => {
    const {result} = renderHook(() => useOwnerLogin(), {wrapper});

    act(() => {
      result.current.handleMobileChange("7777777777");
    });

    act(() => {
      result.current.toggleRememberMe();
    });

    expect(mockedSetItem).toHaveBeenCalledWith(
      "owner-login",
      JSON.stringify({mobileNumber: "7777777777"}),
    );

    act(() => {
      result.current.toggleRememberMe();
    });

    expect(mockedRemoveItem).toHaveBeenCalledWith("owner-login");
  });
});
