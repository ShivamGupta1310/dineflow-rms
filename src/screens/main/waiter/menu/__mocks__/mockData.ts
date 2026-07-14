import { MenuCategoryType, MenuItem } from '@appTypes';

export const mockDispatch = jest.fn();
export const mockGoBack = jest.fn();
export const mockShowToast = jest.fn();

export const mockHandleBack = jest.fn();
export const mockHandleSearch = jest.fn();
export const mockHandleFilterSelection = jest.fn();
export const mockHandleCategorySelection = jest.fn();

export const mockFilters = [
    {
        id: 1,
        key: MenuCategoryType.VEG,
        name: 'Veg',
    },
    {
        id: 2,
        key: MenuCategoryType.NON_VEG,
        name: 'Non Veg',
    },
];

export const mockCategories = [
    {
        id: 1,
        name: 'Pizza',
        img_url: 'https://i.pravatar.cc/250?u=startersstarters@pravatar.com',
    },
    {
        id: 2,
        name: 'Burger',
        img_url: 'https://i.pravatar.cc/250?u=startersstarters@pravatar.com',
    },
];

export const mockMenuItems: MenuItem[] = [
    {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Classic pizza',
        price: 250,
        image_url: '',
        category_id: 1,
        category_name: 'Pizza',
        food_type: MenuCategoryType.VEG,
        preparation_time: 15,
        available: false,
        popular: false,
        recommended: false,
        best_seller: false,
        chef_special: false,
        today_special: false,
        new_arrival: false,
        quick_bites: false,
        combo: false,
        spicy: false,
        jain: false
    },
];

export const mockWaiterMenuState = {
    loading: false,
    error: null,
    filters: mockFilters,
    categories: mockCategories,
    selectedFilter: mockFilters[0],
    selectedCategory: mockCategories[0],
    items: mockMenuItems
};

export const mockWaiterOrderState = {
    orderItems: [
        {
            ...mockMenuItems[0],
            quantity: 2,
        },
    ],

}

export const mockRootState = {
    waiterMenu: mockWaiterMenuState,
    waiterOrder: mockWaiterOrderState
};

export const mockNavigate = jest.fn();

export const mockNavigation = {
    goBack: mockGoBack,
    navigate: jest.fn()
};

export const mockTranslation = {
    t: (key: string) => key,
};

const translations: Record<string, string> = {
    'waiter.menu.foodMenu': 'Food Menu',
    'waiter.menu.searchPlaceholder': 'Search',
    'waiter.menu.noFoodItemsAvailable': 'No food items available',
    'waiter.menu.item': 'Item',
    'waiter.menu.items': 'Items',
    'common.back': 'Back',
};

export const mockUseMenuData = {
    t: (key: string) => translations[key] || key,
    loading: false,

    categories: mockCategories,
    items: [{ id: '1' }],
    menuItemsWithQuantity: [],

    totalAddedItems: 2,

    selectedFilter: {
        key: MenuCategoryType.VEG,
        name: 'Veg',
    },

    selectedCategory: mockCategories[0],

    handleBack: jest.fn(),
    handleSearch: mockHandleSearch,
    handleOnToggleFilter: jest.fn(),
    handleCategorySelection: jest.fn(),
    handleAddItem: jest.fn(),
    handleRemoveItem: jest.fn(),
    handleGoToOrderSummary: jest.fn(),
    tables: [],
    tableSheetVisible: false,
    setTableSheetVisible: jest.fn(),
    handleOpenTableSheet: jest.fn(),
    selectedTable: undefined,
    handleSelectTable: jest.fn(),
};