import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import OTPInput from '../OTPInput';

const mockUseBlurOnFulfill = jest.fn();

jest.mock('react-native-confirmation-code-field', () => {
  const {
    View,
    Text,
    TextInput,
  } = require('react-native');

  return {
    Cursor: () => (
      <Text testID="cursor">|</Text>
    ),

    useBlurOnFulfill: (...args: any[]) =>
      mockUseBlurOnFulfill(...args),

    CodeField: ({
      value,
      onChangeText,
      cellCount,
      renderCell,
    }: any) => (
      <View>
        <TextInput
          testID="code-field"
          value={value}
          onChangeText={onChangeText}
        />

        <Text testID="cell-count">
          {cellCount}
        </Text>

        {Array.from({ length: cellCount }).map(
          (_, index) => (
            <View key={index}>
              {renderCell({
                index,
                symbol:
                  index < value.length
                    ? value[index]
                    : '',
                isFocused:
                  index === value.length,
              })}
            </View>
          ),
        )}
      </View>
    ),
  };
});

jest.mock('@components/rn-view/rn-view.component', () => {
  const { View } = require('react-native');

  return {
    RNView: ({ children, ...props }: any) => (
      <View {...props}>{children}</View>
    ),
  };
});

jest.mock('@components/rn-text/rn-text.component', () => {
  const { Text } = require('react-native');

  return {
    RNText: ({ children, ...props }: any) => (
      <Text {...props}>{children}</Text>
    ),
  };
});

describe('OTPInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBlurOnFulfill.mockReturnValue(null);
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <OTPInput
        value=""
        onChangeText={jest.fn()}
      />,
    );

    expect(
      getByTestId('code-field'),
    ).toBeTruthy();
  });

  it('uses default length of 6', () => {
    const { getByTestId } = render(
      <OTPInput
        value=""
        onChangeText={jest.fn()}
      />,
    );

    expect(
      getByTestId('cell-count').props.children,
    ).toBe(6);
  });

  it('uses custom length', () => {
    const { getByTestId } = render(
      <OTPInput
        value=""
        length={4}
        onChangeText={jest.fn()}
      />,
    );

    expect(
      getByTestId('cell-count').props.children,
    ).toBe(4);
  });

  it('calls onChangeText when value changes', () => {
    const mockOnChange = jest.fn();

    const { getByTestId } = render(
      <OTPInput
        value=""
        onChangeText={mockOnChange}
      />,
    );

    fireEvent.changeText(
      getByTestId('code-field'),
      '123456',
    );

    expect(mockOnChange).toHaveBeenCalledWith(
      '123456',
    );
  });

  it('calls useBlurOnFulfill with correct params', () => {
    render(
      <OTPInput
        value="123"
        length={6}
        onChangeText={jest.fn()}
      />,
    );

    expect(
      mockUseBlurOnFulfill,
    ).toHaveBeenCalledWith({
      value: '123',
      cellCount: 6,
    });
  });

  it('renders entered value when secureEntry is false', () => {
    const { getByText } = render(
      <OTPInput
        value="1"
        secureEntry={false}
        onChangeText={jest.fn()}
      />,
    );

    expect(
      getByText('1'),
    ).toBeTruthy();
  });

  it('renders masked value when secureEntry is true', () => {
    const { getByText } = render(
      <OTPInput
        value="1"
        secureEntry
        onChangeText={jest.fn()}
      />,
    );

    expect(
      getByText('•'),
    ).toBeTruthy();
  });

  it('renders cursor for focused empty cell', () => {
    const { getByTestId } = render(
      <OTPInput
        value=""
        onChangeText={jest.fn()}
      />,
    );

    expect(
      getByTestId('cursor'),
    ).toBeTruthy();
  });
});
