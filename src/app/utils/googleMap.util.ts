type Location = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity: string;
};

type ISelectOption = {
  key: string;
  label: string;
};

type ExtractedData = {
  nextPageToken: string;
  addresses: ISelectOption[];
};

export const extractNearbyAddresses = (data: {
  results: Location[];
  next_page_token: string;
}): ExtractedData => {
  const { results, next_page_token } = data;
  const addresses: ISelectOption[] = results.map((location) => {
    return {
      key: `${location.geometry.location.lat},${location.geometry.location.lng}`,
      label: location.vicinity,
    };
  });
  return {
    nextPageToken: next_page_token,
    addresses,
  };
};
