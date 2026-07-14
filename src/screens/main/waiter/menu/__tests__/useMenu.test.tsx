import { renderHook, act } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { showToast } from "@utils/toastHelper";
import { useMenu } from "../useMenu";
import {
  clearMenuConfigSelection,
  fetchMenuConfig,
  setSelectedCategory,
  setSelectedFilter,
} from "@store/slices/waiterMenuSlice";

import {
  mockDispatch,
  mockNavigation,
  mockRootState,
  mockTranslation,
  mockFilters,
  mockCategories,
} from "../__mocks__/mockData";
import { ROUTES } from "@constants";

jest.mock("react-redux");
const mockedUseDispatch = jest.mocked(useDispatch);
const mockedUseSelector = jest.mocked(useSelector);

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@store/slices/waiterMenuSlice", () => ({
  fetchMenuConfig: jest.fn(() => ({ type: "FETCH_MENU_CONFIG" })),
  fetchMenuItems: jest.fn(() => ({ type: "FETCH_MENU_ITEMS" })),
  clearItemsList: jest.fn(() => ({ type: "CLEAR_ITEMS_LIST" })),
  clearMenuConfigSelection: jest.fn(() => ({
    type: "CLEAR_MENU_CONFIG_SELECTION",
  })),
  setSelectedFilter: jest.fn((payload) => ({
    type: "SET_SELECTED_FILTER",
    payload,
  })),
  setSelectedCategory: jest.fn((payload) => ({
    type: "SET_SELECTED_CATEGORY",
    payload,
  })),
}));

jest.mock("@store/slices/waiterOrderSlice", () => ({
  clearOrder: jest.fn(() => ({ type: "CLEAR_ORDER" })),
  clearOrderItems: jest.fn(() => ({ type: "CLEAR_ORDER_ITEMS" })),
  addItemToCart: jest.fn((payload) => ({
    type: "ADD_ITEM",
    payload,
  })),
  removeItemFromCart: jest.fn((payload) => ({
    type: "REMOVE_ITEM",
    payload,
  })),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn((cb) => cb()),
}));

describe("useMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseDispatch.mockReturnValue(mockDispatch);
    mockedUseSelector.mockImplementation((selector) => selector(mockRootState));

    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
  });

  it("returns menu state", () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.loading).toBe(false);
    expect(result.current.filters).toEqual(mockFilters);
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.selectedFilter).toEqual(mockFilters[0]);
    expect(result.current.selectedCategory).toEqual(mockCategories[0]);
  });

  it("clears order items on mount", () => {
    renderHook(() => useMenu());

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CLEAR_ORDER_ITEMS",
      }),
    );
  });

  it("dispatches fetchMenuConfig when filters are empty", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,
        waiterMenu: {
          ...mockRootState.waiterMenu,
          filters: [],
        },
      }),
    );

    renderHook(() => useMenu());

    expect(fetchMenuConfig).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "FETCH_MENU_CONFIG",
      }),
    );
  });

  it("dispatches fetchMenuConfig when categories are empty", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,

        waiterMenu: {
          ...mockRootState.waiterMenu,
          categories: [],
        },
      }),
    );

    renderHook(() => useMenu());

    expect(fetchMenuConfig).toHaveBeenCalled();
  });

  it("does not fetch menu config when data exists", () => {
    renderHook(() => useMenu());

    expect(fetchMenuConfig).not.toHaveBeenCalled();
  });

  it("selects first filter when none is selected", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,
        waiterMenu: {
          ...mockRootState.waiterMenu,
          selectedFilter: null,
        },
      }),
    );

    renderHook(() => useMenu());

    expect(setSelectedFilter).toHaveBeenCalledWith(mockFilters[0]);
  });

  it("selects first category when none is selected", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,

        waiterMenu: {
          ...mockRootState.waiterMenu,
          selectedCategory: null,
        },
      }),
    );

    renderHook(() => useMenu());

    expect(setSelectedCategory).toHaveBeenCalledWith(mockCategories[0]);
  });

  it("calls navigation goBack", () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleBack();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("shows coming soon toast", () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleSearch();
    });

    expect(showToast).toHaveBeenCalledWith("info", "common.comingSoon");
  });

  it("changes filter to non veg", () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleOnToggleFilter(true);
    });

    expect(setSelectedFilter).toHaveBeenCalledWith(mockFilters[1]);
  });

  it("changes filter to veg", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,
        waiterMenu: {
          ...mockRootState.waiterMenu,
          selectedFilter: mockFilters[1],
        },
      }),
    );

    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleOnToggleFilter(false);
    });

    expect(setSelectedFilter).toHaveBeenCalledWith(mockFilters[0]);
  });

  it("does nothing if filter is not found", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,
        waiterMenu: {
          ...mockRootState.waiterMenu,
          filters: [],
        },
      }),
    );

    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleOnToggleFilter(true);
    });

    expect(setSelectedFilter).not.toHaveBeenCalled();
  });

  it("dispatches selected category", () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleCategorySelection(mockCategories[1]);
    });

    expect(setSelectedCategory).toHaveBeenCalledWith(mockCategories[1]);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SET_SELECTED_CATEGORY",
        payload: mockCategories[1],
      }),
    );
  });

  it("adds item to cart", () => {
    const item = mockRootState.waiterMenu.items[0];

    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleAddItem(item);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ADD_ITEM",
        payload: item,
      }),
    );
  });

  it("removes item from cart", () => {
    const item = mockRootState.waiterMenu.items[0];

    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleRemoveItem(item);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "REMOVE_ITEM",
        payload: item,
      }),
    );
  });

  it("clears order and navigates back", () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleBack();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CLEAR_ORDER",
      }),
    );

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("returns menu items with quantity", () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.menuItemsWithQuantity[0].quantity).toBe(2);
  });

  it("returns zero quantity when item is not in cart", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,
        waiterOrder: {
          orderItems: [],
        },
      }),
    );

    const { result } = renderHook(() => useMenu());

    expect(result.current.menuItemsWithQuantity[0].quantity).toBe(0);
  });

  it("calculates total added items", () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.totalAddedItems).toBe(2);
  });

  it("returns zero total items", () => {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        ...mockRootState,
        waiterOrder: {
          orderItems: [],
        },
      }),
    );

    const { result } = renderHook(() => useMenu());

    expect(result.current.totalAddedItems).toBe(0);
  });

  it("calls handleGoToOrderSummary", () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.handleGoToOrderSummary();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(ROUTES.ORDER_SUMMARY);
  });

  it("clears menu config selection on blur", () => {
    let cleanup: (() => void) | undefined;

    (useFocusEffect as jest.Mock).mockImplementation((effect) => {
      cleanup = effect();
    });

    renderHook(() => useMenu());

    act(() => {
      cleanup?.();
    });

    expect(clearMenuConfigSelection).toHaveBeenCalled();

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CLEAR_MENU_CONFIG_SELECTION",
      }),
    );
  });
});
