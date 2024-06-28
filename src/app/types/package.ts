export interface IPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  caption: string;
  description?: string;
  type: PACKAGE_TYPE;
  formattedPrice: string;
  check: number;
  maxPeoplePackages: number;
}

export enum PACKAGE_TYPE {
  VIDEO_CALL = "videocall",
  CHAT = "chat",
}

export interface IPackageResponse {
  avalaibleChatPackage: number;
  availableCallPackage: number;
  availableChats: number;
  availableCalls: number;
  availableCredits: number;
  packages: IPackage[];
}

export interface ICheckPoint {
  price: number;
  currency: string;
}
