import { ISelectOption } from "../types/common";

export const extractNearbyAddresses = (data: any) => {
  const { results, next_page_token } = data;
  const addresses: ISelectOption[] = results.map(
    (location: any) => {
      return {
        key: `${location.geometry.location.lat},${location.geometry.location.lng}`,
        label: location.vicinity,
      };
    }
  );
  return {
    nextPageToken: next_page_token,
    addresses,
  };
};
