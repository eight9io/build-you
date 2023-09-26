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
