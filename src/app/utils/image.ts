import mime from "react-native-mime-types";
import { IUploadMediaWithId } from "../types/media";
import { getRandomId } from "./common";
// const extractPrefix = (url: string) => {
//   console.log("url", url);
//   if (!url || url === null) return "";
//   try {
//     const urlObj = new URL(url);
//     return urlObj.origin;
//   } catch (error) {
//     console.log("error", error);
//     return "";
//   }
// };
// error: url.origin is not implemented

// TODO use https://developer.mozilla.org/en-US/docs/Web/API/URL
const extractPrefix = (url: string) => {
  const match = url.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : "";
};

export const getSeperateImageUrls = (url: string | null) => {
  if (!url || url === null) return "";
  const urls = url.split(";");
  const prefix = extractPrefix(urls[0]);
  const imageUrls = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    if (url.startsWith("/")) {
      imageUrls.push(prefix + url);
    } else {
      imageUrls.push(url);
    }
  }
  return imageUrls.filter((url) => url !== "");
};

export const getImageExtension = (uri: string) => {
  const uriSplit = uri.split(".");
  return uriSplit[uriSplit.length - 1];
};

export const createImageFileFromUri = async (uri: string) => {
  // Fetch image from uri to get binary data
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`Failed to fetch image: ${uri}`);

  // Convert the response body (image data/readable stream) to a Blob
  const blob = await res.blob();

  const imageExtension = mime.extension(blob.type);
  if (!imageExtension)
    throw new Error(
      `Failed to get image extension from mime type: ${blob.type}`
    );

  const imageId = getRandomId();
  return new File([blob], `${imageId}.${imageExtension}`, {
    type: blob.type, // our API expects the mime type to be in the file object
  });
};
