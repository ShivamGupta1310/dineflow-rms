import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

export const checkPermission = async (permission: Permission) => {
  const result = await check(permission);
  return result === RESULTS.GRANTED;
};

export const requestPermission = async (permission: Permission) => {
  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const AppPermissions = {
  CAMERA: Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  PHOTO_LIBRARY: Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};
