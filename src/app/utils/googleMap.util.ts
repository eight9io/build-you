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

type GeoLocation = {
  address_components: string[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
};

export type ExtractedGeoLocation = {
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

export const extractLocation = (data: {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  results: GeoLocation[];
}) => {
  // return list of locations in result
  const { results } = data;
  const addresses: ISelectOption[] = results.map((location) => {
    return {
      key: `${location.geometry.location.lat},${location.geometry.location.lng}`,
      label: location.formatted_address,
    };
  });

  return addresses;
};
