import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import MenuScreen from '../index';
import { useMenu } from '../useMenu';
import {
    mockUseMenuData,
    mockHandleSearch,
} from '../__mocks__/mockData';
import { MenuItemList, MenuSubCategoryList } from '@components';
import { Switch } from 'react-native';
import { MenuCategoryType } from '@appTypes';

jest.mock('../useMenu');

jest.mock('@assets', () => {
    const { View } = require('react-native');
    return {
        SVGS: {
            Backlogo: () => <View />,
            SearchIcon: () => <View />,
            CartIcon: () => <View />,
        },
    };
});

jest.mock('react-native-svg', () => ({
    SvgXml: () => null,
}));

jest.mock('@components', () => {
    const {
        View,
        Text,
        Pressable,
        TextInput,
    } = require('react-native');

    return {
        AppLoader: () => <View testID="app-loader" />,

        Header: ({ title, leftAction, rightSlot }: any) => (
            <View>
                <Text>{title}</Text>

                <Pressable
                    testID="back-button"
                    onPress={leftAction?.onPress}
                >
                    <Text>Back</Text>
                </Pressable>

                {rightSlot}
            </View>
        ),

        AppTextInput: ({
            onChangeText,
            placeholder,
        }: any) => (
            <TextInput
                testID="search-input"
                placeholder={placeholder}
                onChangeText={onChangeText}
            />
        ),

        MenuSubCategoryList: jest.fn(() => null),
        MenuItemList: jest.fn(() => null),
        RNText: ({ children, ...props }: any) => (
            <Text {...props}>{children}</Text>
        ),
        RNView: ({ children, ...props }: any) => (
            <View {...props}>{children}</View>
        ),
        AppButton: ({ title, onPress }: any) => (
            <Pressable onPress={onPress}>
                <Text>{title}</Text>
            </Pressable>
        ),
        TableSelectionSheet: () => <View testID="table-selection-sheet" />,
    };
});

jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');

    return {
        SafeAreaView: ({ children }: any) => (
            <View>{children}</View>
        ),
    };
});

describe('MenuScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useMenu as jest.Mock).mockReturnValue(mockUseMenuData);
    });

    it('renders correctly', () => {
        const { getByText } = render(<MenuScreen />);

        expect(getByText('Food Menu')).toBeTruthy();
        expect(getByText('Veg')).toBeTruthy();
        expect(getByText('2 Items')).toBeTruthy();
    });

    it('shows loader', () => {
        (useMenu as jest.Mock).mockReturnValue({
            ...mockUseMenuData,
            loading: true,
        });

        const { getByTestId } = render(<MenuScreen />);

        expect(getByTestId('app-loader')).toBeTruthy();
    });

    it('calls back handler', () => {
        const { getByTestId } = render(<MenuScreen />);

        fireEvent.press(getByTestId('back-button'));

        expect(mockUseMenuData.handleBack).toHaveBeenCalled();
    });

    it('calls search handler', () => {
        const { getByTestId } = render(<MenuScreen />);

        fireEvent.changeText(
            getByTestId('search-input'),
            'Pizza',
        );

        expect(mockHandleSearch).toHaveBeenCalledWith('Pizza');
    });

    it('calls handleOnToggleFilter when switch changes', () => {
        const { UNSAFE_getByType } = render(<MenuScreen />);

        const toggle = UNSAFE_getByType(Switch);

        fireEvent(toggle, 'valueChange', true);

        expect(mockUseMenuData.handleOnToggleFilter).toHaveBeenCalledWith(true);
    });

    it('renders switch in non veg mode', () => {
        (useMenu as jest.Mock).mockReturnValue({
            ...mockUseMenuData,
            selectedFilter: {
                key: MenuCategoryType.NON_VEG,
                name: 'Non Veg',
            },
        });

        const { getByText } = render(<MenuScreen />);

        expect(getByText('Non Veg')).toBeTruthy();
    });
    it('passes props to MenuSubCategoryList', () => {
        render(<MenuScreen />);

        expect(
            (MenuSubCategoryList as unknown as jest.Mock).mock.calls[0][0],
        ).toEqual(
            expect.objectContaining({
                data: mockUseMenuData.categories,
                selectedCategory:
                    mockUseMenuData.selectedCategory,
                onSelect:
                    mockUseMenuData.handleCategorySelection,
            }),
        );
    });

    it('passes props to MenuItemList', () => {
        render(<MenuScreen />);

        expect(
            (MenuItemList as unknown as jest.Mock).mock.calls[0][0],
        ).toEqual(
            expect.objectContaining({
                data: mockUseMenuData.menuItemsWithQuantity,
                onAdd: mockUseMenuData.handleAddItem,
                onRemove: mockUseMenuData.handleRemoveItem,
            }),
        );
    });

    it('shows empty state when no items', () => {
        (useMenu as jest.Mock).mockReturnValue({
            ...mockUseMenuData,
            items: [],
            loading: false,
        });

        const { getByText } = render(<MenuScreen />);

        expect(
            getByText('No food items available'),
        ).toBeTruthy();
    });

    it('does not show empty state when items exist', () => {
        (useMenu as jest.Mock).mockReturnValue({
            ...mockUseMenuData,
            items: [{ id: '1' }],
        });

        const { queryByText } = render(<MenuScreen />);

        expect(
            queryByText('No food items available'),
        ).toBeNull();
    });

    it('shows singular item text', () => {
        (useMenu as jest.Mock).mockReturnValue({
            ...mockUseMenuData,
            totalAddedItems: 1,
        });

        const { getByText } = render(<MenuScreen />);

        expect(getByText('1 Item')).toBeTruthy();
    });

    it('does not show floating button when no items added', () => {
        (useMenu as jest.Mock).mockReturnValue({
            ...mockUseMenuData,
            totalAddedItems: 0,
        });

        const { queryByText } = render(<MenuScreen />);

        expect(queryByText('0 Items')).toBeNull();
    });

    it('calls order summary handler', () => {
        const { getByText } = render(<MenuScreen />);

        fireEvent.press(getByText('2 Items'));

        expect(
            mockUseMenuData.handleGoToOrderSummary,
        ).toHaveBeenCalled();
    });
});