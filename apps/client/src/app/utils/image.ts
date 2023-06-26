const extractPrefix = (url: string) => {
  const match = url.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : '';
};

export const getSeperateImageUrls = (url: string | null) => {
  if (!url || url === null) return '';
  const urls = url.split(';');
  const prefix = extractPrefix(urls[0]);
  const imageUrls = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    if (url.startsWith('/')) {
      imageUrls.push(prefix + url);
    } else {
      imageUrls.push(url);
    }
  }
  return imageUrls.filter((url) => url !== '');
};
