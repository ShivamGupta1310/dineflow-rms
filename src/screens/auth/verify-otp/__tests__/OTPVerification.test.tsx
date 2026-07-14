import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import OTPVerification from '../index';
const mockDispatch = jest.fn();
const mockReset = jest.fn();
const mockGetParent = jest.fn(() => ({
  reset: mockReset,
}));
const mockNavigate = jest.fn();
const mockUseRoute = jest.fn(() => ({
  params: {
    phoneNumber: '9999999999',
    countryCode: 91,
    ownerId: 7,
    otp: '123456',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(callback =>
    callback({
      auth: {
        loading: false,
      },
    }),
  ),
}));

jest.mock('@utils/authSession', () => ({
  OWNER_ROLE: 'owner',
  CAPTAIN_ROLE: 'captain',
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    getParent: mockGetParent,
    navigate: mockNavigate,
  }),
  useRoute: () => mockUseRoute(),
}));

jest.mock('@assets', () => ({
  SVGS: {
    DineSetupLogo: () => null,
    DishIcon: () => null,
  },
}));

jest.mock('@components/AppLayout', () => {
  const { View } = require('react-native');

  return ({ children }: any) => (
    <View testID="app-layout">{children}</View>
  );
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

jest.mock('../../../../components/OTPInput', () => {
  const { TextInput } = require('react-native');

  return ({ value, onChangeText }: any) => (
    <TextInput
      testID="otp-input"
      value={value}
      onChangeText={onChangeText}
    />
  );
});

jest.mock('@components/common/AppButton', () => {
  const { TouchableOpacity, Text } = require('react-native');

  return ({
    title,
    onPress,
    disabled,
    testID,
  }: any) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('@components/common/ActionCard', () => {
  const { TouchableOpacity, Text } = require('react-native');

  return ({
    title,
    onPress,
    testID,
  }: any) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

describe('OTPVerification Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetParent.mockReturnValue({
      reset: mockReset,
    });
    mockDispatch.mockResolvedValue({
      type: 'auth/verifyOwnerOtp/fulfilled',
      payload: {
        success: true,
        message: 'OTP verified successfully.',
      },
    });
  });

  it('renders screen correctly', () => {
    const { getByText } = render(<OTPVerification />);

    expect(
      getByText('auth.verifyOtp.title'),
    ).toBeTruthy();

    expect(
      getByText(/auth\.verifyOtp\.subtitle/i),
    ).toBeTruthy();

    expect(
      getByText('auth.verifyOtp.enterOtpLabel'),
    ).toBeTruthy();

    expect(
      getByText('auth.verifyOtp.verifyButton'),
    ).toBeTruthy();

    expect(
      getByText('auth.login.waiterLogin'),
    ).toBeTruthy();
  });

  it('renders OTP input', () => {
    const { getByTestId } = render(<OTPVerification />);

    expect(getByTestId('otp-input')).toBeTruthy();
  });

  it('renders continue button', () => {
    const { getByTestId } = render(<OTPVerification />);

    expect(
      getByTestId('owner-login-continue'),
    ).toBeTruthy();
  });

  it('renders waiter login action card', () => {
    const { getByTestId } = render(<OTPVerification />);

    expect(
      getByTestId('owner-waiter-login-button'),
    ).toBeTruthy();
  });

  it('updates OTP value when user enters OTP', () => {
    const { getByTestId } = render(<OTPVerification />);

    expect(
      getByTestId('otp-input').props.value,
    ).toBe('123456');

    fireEvent.changeText(
      getByTestId('otp-input'),
      '654321',
    );

    expect(
      getByTestId('otp-input').props.value,
    ).toBe('654321');
  });

  it('calls verify api when continue button is pressed', async () => {
    const { getByTestId } = render(<OTPVerification />);

    fireEvent.changeText(
      getByTestId('otp-input'),
      '123456',
    );

    fireEvent.press(
      getByTestId('owner-login-continue'),
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch.mock.calls[0][0]).toEqual(expect.any(Function));
    });
  });

  it('presses waiter login action card', () => {
    const { getByTestId } = render(<OTPVerification />);

    fireEvent.press(
      getByTestId('owner-waiter-login-button'),
    );

    expect(mockNavigate).toHaveBeenCalledWith('WaiterOnboarding');
  });
});
