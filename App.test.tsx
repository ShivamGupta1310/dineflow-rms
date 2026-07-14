import React from "react";
import { render } from "@testing-library/react-native";
import { act } from "react";

import App from "./App";

jest.useFakeTimers();

const mockHide = jest.fn(() => Promise.resolve());

jest.mock("react-native-bootsplash", () => ({
  hide: (...args: any[]) => mockHide(...args),
}));

jest.mock("@navigation/RootNavigator", () => () => null);
jest.mock("@store", () => ({
  store: {},
  persistor: {},
}));
jest.mock("redux-persist/integration/react", () => ({
  PersistGate: ({ children }: any) => children,
}));
jest.mock("@theme/ThemeProvider", () => ({
  ThemeProvider: ({ children }: any) => children,
}));
jest.mock("./src/contexts/global.provider", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));
jest.mock("react-native-toast-message", () => () => null);
jest.mock("@localization/i18n", () => ({}));
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaProvider: ({ children }: any) => <View>{children}</View> };
});

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and hides splash after timeout", async () => {
    render(<App />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
    });

    expect(mockHide).toHaveBeenCalledWith({ fade: true });
  });
});
