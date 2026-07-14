import { useCallback, useEffect, useState } from "react";
import { showToast } from "@utils/toastHelper";
import type { OnReadCodeData } from "react-native-camera-kit";
import { useTranslation } from "react-i18next";
import type { ScanResult } from "./barcode-scanner.props";
import { useCameraPermission } from "./useCameraPermission";

interface UseBarcodeScannerReturn {
  hasPermission: boolean;
  scanned: boolean;
  torch: "on" | "off";
  scanResult: ScanResult | null;
  handleCodeRead: (event: OnReadCodeData) => void;
  handleScanAgain: () => void;
  toggleTorch: () => void;
}

export const useBarcodeScanner = (): UseBarcodeScannerReturn => {
  const { t } = useTranslation();
  const { requestCameraPermission } = useCameraPermission();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState<"on" | "off">("off");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const syncCameraPermission = useCallback(async () => {
    const granted = await requestCameraPermission();
    setHasPermission(granted);
  }, [requestCameraPermission]);

  useEffect(() => {
    syncCameraPermission();
  }, [syncCameraPermission]);

  const handleCodeRead = useCallback(
    (event: OnReadCodeData) => {
      if (scanned) {
        return;
      }

      const { codeFormat, codeStringValue } = event.nativeEvent;

      if (codeFormat !== "qr") {
        const invalidCodeMessage = t("auth.barcodeScanner.scanQRCodeOnly");

        setScanned(true);
        setScanResult({
          success: false,
          value: codeStringValue ?? "",
          message: invalidCodeMessage,
        });
        showToast(
          "error",
          t("auth.barcodeScanner.invalidCodeTitle"),
          invalidCodeMessage,
        );
        return;
      }
      setScanResult({
        success: true,
        value: codeStringValue,
      });
      setScanned(true);
    },
    [scanned, t],
  );

  const handleScanAgain = useCallback(() => {
    setScanResult(null);
    setScanned(false);
  }, []);

  const toggleTorch = useCallback(() => {
    setTorch((prevTorch) => (prevTorch === "on" ? "off" : "on"));
  }, []);

  return {
    hasPermission,
    scanned,
    torch,
    scanResult,
    handleCodeRead,
    handleScanAgain,
    toggleTorch,
  };
};
