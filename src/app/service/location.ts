import httpInstance from "../utils/http";
import { GOOGLE_MAP_API } from "../common/constants";
import { ExtractedGeoLocation, extractLocation } from "../utils/googleMap.util";
import { ISelectOption } from "../types/common";
import axios from "axios";
import { CrashlyticService } from "./crashlytic";

export const getNearbyLocations = async (
  coords: string
): Promise<ISelectOption[]> => {
  const params = new URLSearchParams();
  if (!GOOGLE_MAP_API.API_KEY) {
    throw new Error("Google Map API key is not defined");
  }
  params.append("key", GOOGLE_MAP_API.API_KEY || "");

  try {
    const response = await axios.get(
      GOOGLE_MAP_API.NEARBY_SEARCH_ENDPOINT +
        "?" +
        `latlng=${coords}&key=${GOOGLE_MAP_API.API_KEY}`,
      {
        baseURL: GOOGLE_MAP_API.BASE_URL,
        headers: {
          "X-Ios-Bundle-Identifier": "it.buildyou.buildyou",
          "X-Android-Package": "com.buildyou.buildyou",
          "X-Android-Cert": process.env.EXPO_ANDROID_CERT,
        },
      }
    );
    return extractLocation(response.data);
  } catch (error) {
    console.error("error: ", error);
    CrashlyticService({
      errorType: "Get Nearby Locations Error",
      error: error,
    });
  }
};
