import mime from "react-native-mime-types";
import { getImageMime } from "base64-image-mime";
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

export const createFileFromUri = async (uri: string) => {
  // Fetch image from uri to get binary data
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`Failed to fetch file data: ${uri}`);

  // Convert the response body (file data/readable stream) to a Blob
  const blob = await res.blob();

  const fileExtension = mime.extension(blob.type);
  if (!fileExtension)
    throw new Error(
      `Failed to get file extension from mime type: ${blob.type}`
    );

  const fileId = getRandomId();
  return new File([blob], `${fileId}.${fileExtension}`, {
    type: blob.type, // our API expects the mime type to be in the file object
  });
};

export const getBase64FileMimeType = (base64: string) => {
  try {
    const mime = getImageMime(base64);
    if (!mime) throw new Error("Failed to get mime type from base64");
    return mime;
  } catch (error) {
    throw new Error(`Failed to get mime type from base64: ${error}`);
  }
};

export const isValidBase64 = (str: string) => {
  try {
    const mime = getImageMime(str);
    if (!mime) return false;
    return true;
  } catch (error) {
    console.error("error: ", error);
    return false;
  }
};
