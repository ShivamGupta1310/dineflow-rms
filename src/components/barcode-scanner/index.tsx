import { IMAGES, SVGS } from "@assets";
import React, { useEffect, useImperativeHandle } from "react";
import { TouchableOpacity, View, ImageBackground } from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import {
  BarcodeScannerProps,
  BarcodeScannerRef,
} from "./barcode-scanner.props";
import styles from "./styles";
import { useBarcodeScanner } from "./useBarcodeScanner";

export const BarcodeScanner = React.forwardRef<
  BarcodeScannerRef,
  BarcodeScannerProps
>(({ onScan, onScanAgain, enabled = true, style }, ref) => {
  const {
    hasPermission,
    scanResult,
    torch,
    handleCodeRead,
    handleScanAgain,
    toggleTorch,
  } = useBarcodeScanner();

  useEffect(() => {
    if (scanResult && onScan) {
      onScan(scanResult);
    }
  }, [onScan, scanResult]);

  useImperativeHandle(ref, () => ({
    scanAgain: () => {
      handleScanAgain();
      onScanAgain?.();
    },
    toggleTorch,
    getScanResult: () => scanResult,
    isTorchOn: () => torch === "on",
  }));

  if (!enabled || !hasPermission) {
    return null;
  }

  return (
    <View style={style}>
      <ImageBackground
        source={IMAGES.cameraFrame}
        resizeMode="contain"
        style={styles.frameContainer}
      >
        <View style={styles.scannerWrapper}>
          <Camera
            style={styles.camera}
            cameraType={CameraType.Back}
            scanBarcode
            onReadCode={handleCodeRead}
            showFrame={false}
            focusMode="on"
            torchMode={torch}
          />
        </View>
      </ImageBackground>
      <View style={styles.torchWrapper}>
        <TouchableOpacity style={styles.torchContainer} onPress={toggleTorch}>
          {torch === "on" ? (
            <SVGS.FlashONlogo />
          ) : (
            <SVGS.FlashOfflogo/>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});
