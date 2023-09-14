export interface IPackage {
  id: string;
  name: string;
  price: number;
  caption: string;
  type: "videocall" | "chat";
}

export interface IPackageResponse {
  availableCalls: string;
  availableChats: string;
  availableCredits: string;
  availablePremiumPackage: string;
  avalaibleBasicPackage: string;
  packages: IPackage[];
}
