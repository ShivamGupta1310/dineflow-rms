import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import RootNavigator from "@navigation/RootNavigator";
import Toast from "react-native-toast-message";
import RNBootSplash from "react-native-bootsplash";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { persistor, store } from "@store";
import { ThemeProvider } from "@theme/ThemeProvider";
import "@localization/i18n";
import GlobalProvider from "./src/contexts/global.provider";
import { toastConfig } from "@components";

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const init = async () => {
      setTimeout(async () => {
        await RNBootSplash.hide({ fade: true });
        setIsSplashVisible(false);
      }, 3000);
    };

    init();
  }, []);

  return (
    <KeyboardProvider>
      <Provider store={store}>
        <GlobalProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <SafeAreaProvider>
                <StatusBar
                  barStyle={isSplashVisible ? "light-content" : "dark-content"}
                  animated
                />
                <RootNavigator />
                <Toast config={toastConfig} />
              </SafeAreaProvider>
            </ThemeProvider>
          </PersistGate>
        </GlobalProvider>
      </Provider>
    </KeyboardProvider>
  );
}

export default App;
