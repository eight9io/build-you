export interface IPackage {
  id: string;
  name: string;
  price: number;
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
