import { Loader } from "@googlemaps/js-api-loader";
import { LocationObjectCoords } from "expo-location";

import { GOOGLE_MAP_API } from "../common/constants";
import { extractLocation } from "../utils/googleMap.util";
import { ISelectOption } from "../types/common";

const loader = new Loader({
  apiKey: GOOGLE_MAP_API.API_KEY,
  libraries: ["geocoding"],
});

export const getNearbyLocations = async (
  coords: LocationObjectCoords
): Promise<ISelectOption[]> => {
  let geoCoder: google.maps.Geocoder;
  try {
    const { Geocoder } = await loader.importLibrary("geocoding");
    geoCoder = new Geocoder();
  } catch (error) {
    console.error("Error when importing google map library: ", error);
    throw new Error("Error when importing google map library");
  }

  try {
    const response = await geoCoder.geocode({
      location: {
        lat: coords.latitude,
        lng: coords.longitude,
      },
    });
    return extractLocation(response.results);
  } catch (error) {
    console.error("error: ", error);
    throw new Error("Error when getting nearby locations");
  }
};
