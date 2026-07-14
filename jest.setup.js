jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn(),
}));

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(() => null),
    getNumber: jest.fn(() => null),
    getBoolean: jest.fn(() => null),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

jest.mock("react-native-config", () => ({
  API_BASE_URL: "https://dummy-api.com",
  API_KEY: "test-api-key",
  ENV: "test",
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock("redux-persist", () => {
  const actual = jest.requireActual("redux-persist");

  return {
    ...actual,
    persistReducer: jest.fn((config, reducers) => reducers),
    persistStore: jest.fn(),
  };
});

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((selector) => {
    // Return a default state shape for testing
    return undefined;
  }),
  Provider: ({ children }) => children,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

jest.mock("@services/api/apiClient", () => ({
  apiPost: jest.fn().mockResolvedValue({data: {}}),
}));

jest.mock("react-native-localize", () => {
  const actualMock = jest.requireActual("react-native-localize/mock");
  return {
    ...actualMock,
    getLocales: jest.fn(() => [
      {
        languageTag: "fr-FR",
        textDirection: "ltr",
        languageCode: "fr",
        countryCode: "FR",
      },
      {
        languageTag: "en-US",
        textDirection: "ltr",
        languageCode: "en",
        countryCode: "US",
      },
    ]),
    getCountry: jest.fn(() => "FR"),
  };
});


jest.mock("react-native-permissions", () => ({
  check: jest.fn(),
  request: jest.fn(),
  PERMISSIONS: {
    IOS: { CAMERA: "ios.camera" },
  },
  RESULTS: {
    GRANTED: "granted",
    BLOCKED: "blocked",
    UNAVAILABLE: "unavailable",
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock("i18next", () => {
  const i18nMock = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockImplementation(() => Promise.resolve()),
    t: (key) => key,
    changeLanguage: jest.fn().mockImplementation(() => Promise.resolve()),
    language: "en",
  };
  return {
    __esModule: true,
    default: i18nMock,
    ...i18nMock,
  };
});

jest.mock('react-native-camera-kit', () => ({
  Camera: 'Camera',
  CameraType: {
    Back: 'back',
    Front: 'front',
  },
}));

jest.mock("react-native-svg", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    SvgXml: () => ReactModule.createElement(Text, null, "SvgXml"),
  };
});

jest.mock("react-native-keyboard-controller", () => {
  const React = require("react");
  const { ScrollView } = require("react-native");

  return {
    KeyboardProvider: ({ children }) => children,
    KeyboardAwareScrollView: ({ children, ...props }) => (
      <ScrollView {...props}>{children}</ScrollView>
    ),
    useKeyboardHandler: jest.fn(),
    useKeyboardAnimation: jest.fn(() => ({ progress: 0, height: 0 })),
    KeyboardController: {
      setInputMode: jest.fn(),
      dismiss: jest.fn(),
    },
  };
});


