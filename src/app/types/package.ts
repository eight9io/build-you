export interface IPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  caption: string;
  type: "videocall" | "chat";
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