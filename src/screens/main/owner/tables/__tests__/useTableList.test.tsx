import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { GlobalContext } from "../../../../../contexts/global.provider";
import { ROUTES } from "@constants/routes";
import { fetchOwnerTables } from "@store/slices/ownerTablesSlice";
import useTableList from "../useTableList";
import { showToast } from "@utils/toastHelper";
import { mockState } from "../__mocks__/mockData";

const mockNavigate = jest.fn();
const mockDispatch = jest.fn(() => Promise.resolve({}));
const mockFetchOwnerTables = jest.fn(() => ({
  type: "ownerTables/fetchOwnerTables",
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(() => ({
    navigate: mockNavigate,
  })),
  useFocusEffect: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@store/slices/ownerTablesSlice", () => ({
  fetchOwnerTables: jest.fn(),
}));

const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockedUseFocusEffect = useFocusEffect as jest.MockedFunction<
  typeof useFocusEffect
>;
const mockedUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;
const mockedFetchOwnerTables = fetchOwnerTables as jest.MockedFunction<
  typeof fetchOwnerTables
>;

describe("useTableList", () => {
  const wrapper =
    (isRTL = false) =>
    ({ children }: { children: React.ReactNode }) =>
      (
        <GlobalContext.Provider
          value={
            {
              language: "en",
              setLanguage: jest.fn(),
              isRTL,
              setIsRTL: jest.fn(),
            } as any
          }
        >
          {children}
        </GlobalContext.Provider>
      );

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseDispatch.mockReturnValue(mockDispatch as any);
    mockedUseSelector.mockImplementation((selector) =>
      selector(mockState as any),
    );
    let focusEffectTriggered = false;
    mockedUseFocusEffect.mockImplementation((effect) => {
      if (!focusEffectTriggered) {
        focusEffectTriggered = true;
        effect();
      }
    });
    mockedUseNavigation.mockReturnValue({ navigate: mockNavigate } as any);
    mockedFetchOwnerTables.mockImplementation(mockFetchOwnerTables as any);
  });

  it("returns the default table state and tab data", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    expect(result.current.isRTL).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedStatus).toBe("all");
    expect(result.current.refreshing).toBe(false);
    expect(result.current.tables).toHaveLength(4);
    expect(result.current.tabs).toHaveLength(5);
    expect(result.current.tabs[0]).toMatchObject({
      id: "1",
      title: "owner.tables.all",
      status: "all",
      count: 4,
    });
    expect(result.current.tabs[1]).toMatchObject({
      id: "2",
      title: "owner.tables.available",
      status: "available",
      count: 2,
      dotColor: expect.any(String),
    });
    expect(result.current.tabs[2]).toMatchObject({
      id: "3",
      title: "owner.tables.occupied",
      status: "occupied",
      count: 1,
    });
    expect(result.current.tabs[4]).toMatchObject({
      id: "5",
      title: "owner.tables.readyToPay",
      status: "ready to pay",
      count: 1,
    });
    expect(result.current.statusGuideCards).toHaveLength(4);
    expect(result.current.statusGuideCards[0]).toMatchObject({
      id: "available",
      title: "owner.tables.available",
      description: "owner.tables.availableDesc",
      testID: "status-guide-card-available",
    });
    expect(result.current.statusGuideCards[3]).toMatchObject({
      id: "ready-to-pay",
      title: "owner.tables.readyToPay",
      description: "owner.tables.readyToPayDesc",
      testID: "status-guide-card-ready-to-pay",
    });
  });

  it("falls back to non-RTL when no global context is provided", () => {
    const { result } = renderHook(() => useTableList());

    expect(result.current.isRTL).toBe(false);
  });

  it("reads RTL from context and updates selected status", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(true),
    });

    expect(result.current.isRTL).toBe(true);

    act(() => {
      result.current.setSelectedStatus("occupied");
    });

    expect(result.current.selectedStatus).toBe("occupied");
  });

  it("shows coming soon toasts for search and filter actions", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    result.current.handleSearchClick();
    result.current.handleFilterClick();

    expect(mockedShowToast).toHaveBeenCalledTimes(2);
    expect(mockedShowToast).toHaveBeenNthCalledWith(
      1,
      "info",
      "common.comingSoon",
    );
    expect(mockedShowToast).toHaveBeenNthCalledWith(
      2,
      "info",
      "common.comingSoon",
    );
  });

  it("dispatches table fetch on focus and refresh", async () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    expect(mockedFetchOwnerTables).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ownerTables/fetchOwnerTables",
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(mockedFetchOwnerTables).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ownerTables/fetchOwnerTables",
    });
  });

  it("navigates ready to pay tables to bill summary", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    result.current.handleTablePress(mockState.ownerTables.tables[3] as any);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.BILL_SUMMARY, {
      tableId: 4,
    });
  });

  it("ignores non ready to pay tables for bill summary navigation", () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    result.current.handleTablePress(mockState.ownerTables.tables[1] as any);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("toggles refreshing state while refreshing", async () => {
    const { result } = renderHook(() => useTableList(), {
      wrapper: wrapper(false),
    });

    expect(result.current.refreshing).toBe(false);

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.refreshing).toBe(false);
  });
});
