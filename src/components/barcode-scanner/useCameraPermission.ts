import { useCallback, useState } from "react";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useTranslation } from "react-i18next";

type CameraPermissionStatus =
  | "idle"
  | "granted"
  | "denied"
  | "blocked"
  | "unavailable"

export const useCameraPermission = () => {
  const { t } = useTranslation();

  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("idle");

  const openAppSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const showSettingsAlert = useCallback(() => {
    Alert.alert(
      t("auth.cameraPermission.title"),
      t("auth.cameraPermission.settingsMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("auth.cameraPermission.openSettings"),
          onPress: openAppSettings,
        },
      ],
    );
  }, [openAppSettings, t]);

  const requestAndroidCameraPermission = useCallback(async () => {
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (alreadyGranted) {
      setCameraPermissionStatus("granted");
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: t("auth.cameraPermission.title"),
        message: t("auth.cameraPermission.requestMessage"),
        buttonPositive: t("auth.cameraPermission.allow"),
        buttonNegative: t("auth.cameraPermission.deny"),
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setCameraPermissionStatus("granted");
      return true;
    }

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setCameraPermissionStatus("blocked");
      showSettingsAlert();
      return false;
    }

    setCameraPermissionStatus("denied");
    return false;
  }, [showSettingsAlert, t]);

  const requestIOSCameraPermission = useCallback(async () => {
    const currentStatus = await check(PERMISSIONS.IOS.CAMERA);

    if (currentStatus === RESULTS.GRANTED) {
      setCameraPermissionStatus("granted");
      return true;
    }

    if (currentStatus === RESULTS.BLOCKED) {
      setCameraPermissionStatus("blocked");
      showSettingsAlert();
      return false;
    }

    if (currentStatus === RESULTS.UNAVAILABLE) {
      setCameraPermissionStatus("unavailable");
      return false;
    }

    const requestStatus = await request(PERMISSIONS.IOS.CAMERA);

    if (requestStatus === RESULTS.GRANTED) {
      setCameraPermissionStatus("granted");
      return true;
    }

    if (requestStatus === RESULTS.BLOCKED) {
      setCameraPermissionStatus("blocked");
      showSettingsAlert();
      return false;
    }

    setCameraPermissionStatus("denied");
    return false;
  }, [showSettingsAlert]);

  const requestCameraPermission = useCallback(async () => {
    try {
      setCameraPermissionStatus("idle");

      if (Platform.OS === "android") {
        return await requestAndroidCameraPermission();
      }

      if (Platform.OS === "ios") {
        return await requestIOSCameraPermission();
      }

      setCameraPermissionStatus("unavailable");
      return false;
    } catch (error) {
      console.error(
        t("auth.cameraPermission.cameraPermissionError"),
        error,
      );
      setCameraPermissionStatus("denied");
      return false;
    }
  }, [requestAndroidCameraPermission, requestIOSCameraPermission, t]);

  return {
    cameraPermissionStatus,
    requestCameraPermission,
    openAppSettings,
  };
};
