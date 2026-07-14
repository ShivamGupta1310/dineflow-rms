import { StyleProp, ViewStyle } from "react-native";

export interface ScanResult {
  success: boolean;
  value: string;
  message?: string;
}

export interface BarcodeScannerProps {
  onScan?: (result: ScanResult) => void;
  onScanAgain?: () => void;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface BarcodeScannerRef {
  scanAgain: () => void;
  toggleTorch: () => void;
  getScanResult: () => ScanResult | null;
  isTorchOn: () => boolean;
}
