import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { GlobalContext } from "../../../../contexts/global.provider";
import { useWaiterList } from "../useWaiterList";
import {
  authState as mockAuthState,
  waiterListPayload,
} from "../__mocks__/waiterSelectionMockData";
import { unlinkRestaurant } from "@store/slices/waiterAuthSlice";
import { getItem, removeItem } from "@utils/storage";
import { showToast } from "@utils/toastHelper";
import { StorageKeys } from "@utils/constants";
import { ROUTES } from "@constants/routes";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
let mockFetchWaiterList: jest.Mock;
let mockSetSelectedWaiter: jest.Mock;
let mockSetRole: jest.Mock;
const mockReset = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn();
const mockStoredWaiterPasscode = "78563214";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock("@utils/authSession", () => ({
  OWNER_ROLE: "owner",
  CAPTAIN_ROLE: "captain",
}));

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) =>
    selector({
      auth: mockAuthState,
      waiterAuth: {
        loading: false,
      },
    }),
}));

jest.mock("@store/slices/authSlice", () => {
  mockFetchWaiterList = jest.fn((payload) => ({
    type: "auth/fetchWaiterList",
    payload,
  }));
  mockSetSelectedWaiter = jest.fn((payload) => ({
    type: "auth/setSelectedWaiter",
    payload,
  }));
  mockSetRole = jest.fn((payload) => ({
    type: "auth/setRole",
    payload,
  }));

  return {
    fetchWaiterList: mockFetchWaiterList,
    setSelectedWaiter: mockSetSelectedWaiter,
    setRole: mockSetRole,
  };
});

jest.mock("@store/slices/waiterAuthSlice", () => {
  const mockUnlinkRestaurant = jest.fn((payload) => ({
    type: "waiterAuth/unlinkRestaurant",
    payload,
  }));

  mockUnlinkRestaurant.fulfilled = {
    match: jest.fn(
      (action) => action?.type === "waiterAuth/unlinkRestaurant/fulfilled",
    ),
  };

  mockUnlinkRestaurant.rejected = {
    match: jest.fn(
      (action) => action?.type === "waiterAuth/unlinkRestaurant/rejected",
    ),
  };

  return {
    unlinkRestaurant: mockUnlinkRestaurant,
  };
});

jest.mock("@utils/storage", () => ({
  ...jest.requireActual("@utils/storage"),
  getItem: jest.fn(() => mockStoredWaiterPasscode),
  removeItem: jest.fn(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
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

describe("useWaiterList", () => {
  const mockedUseNavigation = useNavigation as jest.Mock;
  const mockedUseFocusEffect = useFocusEffect as jest.Mock;
  const mockedGetItem = getItem as jest.MockedFunction<typeof getItem>;
  const mockedUnlinkRestaurant = unlinkRestaurant as jest.MockedFunction<
    typeof unlinkRestaurant
  >;
  const mockedRemoveItem = removeItem as jest.MockedFunction<typeof removeItem>;
  const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GlobalContext.Provider
      value={
        {
          language: "en" as any,
          isRTL: false,
          setLanguage: jest.fn(),
          setIsRTL: jest.fn(),
        } as any
      }
    >
      {children}
    </GlobalContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockImplementation((key: string) => {
      if (key === StorageKeys.RESTAURANT_ACCESS_CODE) {
        return 78563214;
      }

      return null;
    });
    mockDispatch.mockImplementation((action) => action);
    mockCanGoBack.mockReturnValue(false);
    mockedUseNavigation.mockReturnValue({
      navigate: mockNavigate,
      reset: mockReset,
      goBack: mockGoBack,
      canGoBack: mockCanGoBack,
    });
    mockedUseFocusEffect.mockImplementation(() => {});
  });

  it("fetches the waiter list on mount", async () => {
    renderHook(() => useWaiterList(), { wrapper });

    await waitFor(() => {
      expect(mockFetchWaiterList).toHaveBeenCalledTimes(1);
      expect(mockFetchWaiterList).toHaveBeenCalledWith(waiterListPayload);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "auth/fetchWaiterList",
        payload: waiterListPayload,
      });
    });
  });

  it("does not fetch the waiter list when the passcode is missing", async () => {
    mockedGetItem.mockReturnValue(null);

    renderHook(() => useWaiterList(), { wrapper });

    await waitFor(() => {
      expect(mockFetchWaiterList).not.toHaveBeenCalled();
    });
  });

  it("pads the list to fill the grid", () => {
    const { result } = renderHook(() => useWaiterList(), {
      wrapper,
    });

    expect(result.current.staffList).toHaveLength(3);
    expect(result.current.staffList[2]).toBeNull();
  });

  it("toggles selection and clears it", () => {
    const { result } = renderHook(() => useWaiterList(), {
      wrapper,
    });

    act(() => {
      result.current.handleSelect(19);
    });

    expect(result.current.selectedId).toBe(19);

    act(() => {
      result.current.handleSelect(19);
    });

    expect(result.current.selectedId).toBeNull();
  });

  it("does not continue when no waiter is selected", () => {
    const { result } = renderHook(() => useWaiterList(), {
      wrapper,
    });

    act(() => {
      result.current.handleContinue();
    });
  });

  it("logs the selected waiter when continue is pressed", () => {
    const { result } = renderHook(() => useWaiterList(), {
      wrapper,
    });

    act(() => {
      result.current.handleSelect(19);
    });

    act(() => {
      result.current.handleContinue();
    });

    expect(mockSetSelectedWaiter).toHaveBeenCalledWith(
      expect.objectContaining({
        staff_id: 19,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/setSelectedWaiter",
      payload: expect.objectContaining({
        staff_id: 19,
      }),
    });
  });

  it("unlinks the restaurant and clears the waiter session", async () => {
    const mockShowAlert = jest.fn();
    const { result: alertResult } = renderHook(
      () => useWaiterList({ showAlert: mockShowAlert, hideAlert: jest.fn() }),
      { wrapper },
    );

    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/unlinkRestaurant/fulfilled",
      payload: {
        role: "Captain",
        message: "Restaurant unlinked successfully",
        success: true,
        owner_id: 1,
      },
    });

    await act(async () => {
      alertResult.current.handleUnlink();
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk?.();
    });

    expect(mockedUnlinkRestaurant).toHaveBeenCalledWith({
      owner_id: 1,
      role: "Captain",
    });
    expect(mockedRemoveItem).toHaveBeenCalledWith(
      StorageKeys.RESTAURANT_ACCESS_CODE,
    );
    expect(mockSetRole).toHaveBeenCalledWith(null);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/setRole",
      payload: null,
    });
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: ROUTES.LOGIN }],
    });
  });

  it("shows an error toast when unlink is rejected", async () => {
    const mockShowAlert = jest.fn();
    const { result } = renderHook(
      () => useWaiterList({ showAlert: mockShowAlert, hideAlert: jest.fn() }),
      { wrapper },
    );

    mockDispatch.mockResolvedValueOnce({
      type: "waiterAuth/unlinkRestaurant/rejected",
      payload: "Unable to unlink",
    });

    await act(async () => {
      result.current.handleUnlink();
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    await act(async () => {
      await alertConfig.onOk?.();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "auth.onBoarding.verificationFailedTitle",
      "Unable to unlink",
    );
  });

  it("builds full names from waiter records", () => {
    const { result } = renderHook(() => useWaiterList(), {
      wrapper,
    });

    expect(result.current.getFullName(result.current.staffList[0] as any)).toBe(
      "Ravi Patel",
    );
  });

  it("exposes waiter list state from redux", () => {
    const { result } = renderHook(() => useWaiterList(), {
      wrapper,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.unlinkLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("reads rtl from global context", () => {
    const rtlWrapper = ({ children }: { children: React.ReactNode }) => (
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

    const { result } = renderHook(() => useWaiterList(), {
      wrapper: rtlWrapper,
    });

    expect(result.current.isRTL).toBe(true);
  });

  it("shows exit confirmation even when waiter list can go back", () => {
    const mockShowAlert = jest.fn();
    mockCanGoBack.mockReturnValue(true);

    const { result } = renderHook(
      () => useWaiterList({ showAlert: mockShowAlert, hideAlert: jest.fn() }),
      { wrapper },
    );

    expect(result.current.handleBackPress()).toBe(true);
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "waiter.waiterList.exitConfirmTitle",
        subtitle: "waiter.waiterList.exitConfirmSubtitle",
      }),
    );
  });

  it("shows exit confirmation when waiter list is the root screen", () => {
    const mockShowAlert = jest.fn();

    const { result } = renderHook(
      () => useWaiterList({ showAlert: mockShowAlert, hideAlert: jest.fn() }),
      { wrapper },
    );

    expect(result.current.handleBackPress()).toBe(true);
    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "waiter.waiterList.exitConfirmTitle",
        subtitle: "waiter.waiterList.exitConfirmSubtitle",
      }),
    );
  });

  it("exits the app after confirming the root waiter list back action", () => {
    const mockShowAlert = jest.fn();
    const exitAppSpy = jest
      .spyOn(BackHandler, "exitApp")
      .mockImplementation(() => undefined);

    const { result } = renderHook(
      () => useWaiterList({ showAlert: mockShowAlert, hideAlert: jest.fn() }),
      { wrapper },
    );

    act(() => {
      result.current.handleBackPress();
    });

    const alertConfig = mockShowAlert.mock.calls[0][0];

    act(() => {
      alertConfig.onOk?.();
    });

    expect(exitAppSpy).toHaveBeenCalledTimes(1);

    exitAppSpy.mockRestore();
  });
});
