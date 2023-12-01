import { DeviceType } from "expo-device";
import { Platform, NativeModules } from "react-native";

interface NativeConstants {
  appName: string;
  appVersion: string;
  brand: string;
  buildNumber: string;
  bundleId: string;
  deviceId: string;
  deviceType: DeviceType;
  isTablet: boolean;
  isLowRamDevice: boolean;
  isDisplayZoomed: boolean;
  model: string;
  systemName: string;
  systemVersion: string;
}

interface HiddenNativeMethods {
  getSupported32BitAbis: () => Promise<string[]>;
  getSupported32BitAbisSync: () => string[];
  getSupported64BitAbis: () => Promise<string[]>;
  getSupported64BitAbisSync: () => string[];
  getSupportedAbis: () => Promise<string[]>;
  getSupportedAbisSync: () => string[];
  getSystemManufacturer: () => Promise<string>;
  getSystemManufacturerSync: () => string;
}

interface ExposedNativeMethods {
  getAndroidId: () => Promise<string>;
  getAndroidIdSync: () => string;
  getApiLevel: () => Promise<number>;
  getApiLevelSync: () => number;
  getBaseOs: () => Promise<string>;
  getBaseOsSync: () => string;
  getBatteryLevel: () => Promise<number>;
  getBatteryLevelSync: () => number;
  getBootloader: () => Promise<string>;
  getBootloaderSync: () => string;
  getBuildId: () => Promise<string>;
  getBuildIdSync: () => string;
  getCarrier: () => Promise<string>;
  getCarrierSync: () => string;
  getCodename: () => Promise<string>;
  getCodenameSync: () => string;
  getDevice: () => Promise<string>;
  getDeviceName: () => Promise<string>;
  getDeviceNameSync: () => string;
  getDeviceSync: () => string;
  getDeviceToken: () => Promise<string>;
  getDisplay: () => Promise<string>;
  getDisplaySync: () => string;
  getFingerprint: () => Promise<string>;
  getFingerprintSync: () => string;
  getFirstInstallTime: () => Promise<number>;
  getFirstInstallTimeSync: () => number;
  getFontScale: () => Promise<number>;
  getFontScaleSync: () => number;
  getFreeDiskStorage: () => Promise<number>;
  getFreeDiskStorageOld: () => Promise<number>;
  getFreeDiskStorageSync: () => number;
  getFreeDiskStorageOldSync: () => number;
  getHardware: () => Promise<string>;
  getHardwareSync: () => string;
  getHost: () => Promise<string>;
  getHostSync: () => string;
  getHostNames: () => Promise<string[]>;
  getHostNamesSync: () => string[];
  getIncremental: () => Promise<string>;
  getIncrementalSync: () => string;
  getInstallerPackageName: () => Promise<string>;
  getInstallerPackageNameSync: () => string;
  getInstallReferrer: () => Promise<string>;
  getInstallReferrerSync: () => string;
  getInstanceId: () => Promise<string>;
  getInstanceIdSync: () => string;
  getIpAddress: () => Promise<string>;
  getIpAddressSync: () => string;
  getLastUpdateTime: () => Promise<number>;
  getLastUpdateTimeSync: () => number;
  getMacAddress: () => Promise<string>;
  getMacAddressSync: () => string;
  getMaxMemory: () => Promise<number>;
  getMaxMemorySync: () => number;
  getPhoneNumber: () => Promise<string>;
  getPhoneNumberSync: () => string;
  getPreviewSdkInt: () => Promise<number>;
  getPreviewSdkIntSync: () => number;
  getProduct: () => Promise<string>;
  getProductSync: () => string;
  getSecurityPatch: () => Promise<string>;
  getSecurityPatchSync: () => string;
  getSerialNumber: () => Promise<string>;
  getSerialNumberSync: () => string;
  getSystemAvailableFeatures: () => Promise<string[]>;
  getSystemAvailableFeaturesSync: () => string[];
  getTags: () => Promise<string>;
  getTagsSync: () => string;
  getTotalDiskCapacity: () => Promise<number>;
  getTotalDiskCapacityOld: () => Promise<number>;
  getTotalDiskCapacitySync: () => number;
  getTotalDiskCapacityOldSync: () => number;
  getTotalMemory: () => Promise<number>;
  getTotalMemorySync: () => number;
  getType: () => Promise<string>;
  getTypeSync: () => string;
  getUniqueId: () => Promise<string>;
  getUniqueIdSync: () => string;
  getUsedMemory: () => Promise<number>;
  getUsedMemorySync: () => number;
  getUserAgent: () => Promise<string>;
  getUserAgentSync: () => string;
  getBrightness: () => Promise<number>;
  getBrightnessSync: () => number;
  hasGms: () => Promise<boolean>;
  hasGmsSync: () => boolean;
  hasHms: () => Promise<boolean>;
  hasHmsSync: () => boolean;
  hasSystemFeature: (feature: string) => Promise<boolean>;
  hasSystemFeatureSync: (feature: string) => boolean;
  isAirplaneMode: () => Promise<boolean>;
  isAirplaneModeSync: () => boolean;
  isBatteryCharging: () => Promise<boolean>;
  isBatteryChargingSync: () => boolean;
  isCameraPresent: () => Promise<boolean>;
  isCameraPresentSync: () => boolean;
  isEmulator: () => Promise<boolean>;
  isEmulatorSync: () => boolean;
  isHeadphonesConnected: () => Promise<boolean>;
  isHeadphonesConnectedSync: () => boolean;
  isLocationEnabled: () => Promise<boolean>;
  isLocationEnabledSync: () => boolean;
  isPinOrFingerprintSet: () => Promise<boolean>;
  isPinOrFingerprintSetSync: () => boolean;
  isMouseConnected: () => Promise<boolean>;
  isMouseConnectedSync: () => boolean;
  isKeyboardConnected: () => Promise<boolean>;
  isKeyboardConnectedSync: () => boolean;
  isTabletMode: () => Promise<boolean>;
  syncUniqueId: () => Promise<string>;
}

export interface DeviceInfoNativeModule
  extends NativeConstants,
    HiddenNativeMethods,
    ExposedNativeMethods {}

let RNDeviceInfo: DeviceInfoNativeModule | undefined =
  NativeModules.RNDeviceInfo;

export type Getter<T> = () => T;
export type PlatformArray = (typeof Platform.OS)[];

export interface GetSupportedPlatformInfoSyncParams<T> {
  getter: Getter<T>;
  supportedPlatforms: PlatformArray;
  defaultValue: T;
  memoKey?: string;
}

type MemoType = { [key: string]: any };
// centralized memo object
let memo: MemoType = {};

function getSupportedFunction<T>(
  supportedPlatforms: PlatformArray,
  getter: Getter<T>,
  defaultGetter: Getter<T>
): Getter<T> {
  let supportedMap: any = {};
  supportedPlatforms
    .filter((key) => Platform.OS == key)
    .forEach((key) => (supportedMap[key] = getter));
  return Platform.select({
    ...supportedMap,
    default: defaultGetter,
  });
}

export function getSupportedPlatformInfoSync<T>({
  getter,
  supportedPlatforms,
  defaultValue,
  memoKey,
}: GetSupportedPlatformInfoSyncParams<T>): T {
  if (memoKey && memo[memoKey] != undefined) {
    return memo[memoKey];
  } else {
    const output = getSupportedFunction(
      supportedPlatforms,
      getter,
      () => defaultValue
    )();
    if (memoKey) {
      memo[memoKey] = output;
    }
    return output;
  }
}

export const getVersion = () =>
  getSupportedPlatformInfoSync({
    memoKey: "version",
    defaultValue: "unknown",
    supportedPlatforms: ["android", "ios", "windows"],
    getter: () => RNDeviceInfo.appVersion,
  });

export const getBuildNumber = () =>
  getSupportedPlatformInfoSync({
    memoKey: "buildNumber",
    supportedPlatforms: ["android", "ios", "windows"],
    getter: () => RNDeviceInfo.buildNumber,
    defaultValue: "unknown",
  });

export function getReadableVersion() {
  return getVersion() + "." + getBuildNumber();
}

export const getSystemVersion = () =>
  getSupportedPlatformInfoSync({
    defaultValue: "unknown",
    getter: () => RNDeviceInfo.systemVersion,
    supportedPlatforms: ["android", "ios", "windows"],
    memoKey: "systemVersion",
  });

export const getBrand = () =>
  getSupportedPlatformInfoSync({
    memoKey: "brand",
    supportedPlatforms: ["android", "ios", "windows"],
    defaultValue: "unknown",
    getter: () => RNDeviceInfo.brand,
  });

export const getModel = () =>
  getSupportedPlatformInfoSync({
    memoKey: "model",
    defaultValue: "unknown",
    supportedPlatforms: ["ios", "android", "windows"],
    getter: () => RNDeviceInfo.model,
  });
