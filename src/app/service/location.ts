import httpInstance from "../utils/http";
import { GOOGLE_MAP_API } from "../common/constants";
import { extractNearbyAddresses } from "../utils/googleMap.util";
import { ISelectOption } from "../types/common";
import axios from "axios";
import { CrashlyticService } from "./crashlytic";

export const getNearbyLocations = async (
  coords: string,
  nextPageToken?: string
): Promise<{
  nextPageToken?: string;
  addresses: ISelectOption[];
}> => {
  const params = new URLSearchParams();
  if (!GOOGLE_MAP_API.API_KEY) {
    throw new Error("Google Map API key is not defined");
  }
  params.append("key", GOOGLE_MAP_API.API_KEY || "");
  if (nextPageToken) {
    // A token that can be used to return up to 20 additional results. A next_page_token will not be returned if there are no additional results to display.
    params.append("pagetoken", nextPageToken);
  } else {
    // The latitude/longitude around which to retrieve place information. Format: latitude,longitude
    params.append("location", coords);
    // Radius in meters, showing results within this distance from the specified location.
    params.append("radius", GOOGLE_MAP_API.DEFAULT_RADIUS.toString());
  }
  try {
    const response = await axios.get(
      GOOGLE_MAP_API.NEARBY_SEARCH_ENDPOINT + "?" + params.toString(),
      {
        baseURL: GOOGLE_MAP_API.BASE_URL,
        headers: {
          "X-Ios-Bundle-Identifier": "it.buildyou.buildyou",
          "X-Android-Package": "com.buildyou.buildyou",
          "X-Android-Cert": process.env.EXPO_ANDROID_CERT,
        },
      }
    );
    return extractNearbyAddresses(response.data);
  } catch (error) {
    console.error("error: ", error);
    CrashlyticService({
      errorType: "Get Nearby Locations Error",
      error: error,
    });
  }
};
