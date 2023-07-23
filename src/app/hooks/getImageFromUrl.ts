import { useState, useEffect } from "react";
import { ImageSourcePropType } from "react-native";
import { string } from "yup";

export const getImageFromUrl = (
  url: string | null
): [ImageSourcePropType | undefined, boolean, boolean] => {
  //only use with image from react native. no need for expo image
  if (url == null) return [undefined, false, false];
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<ImageSourcePropType>(
    {} as ImageSourcePropType
  );

  useEffect(() => {
    const fetchImage = async () => {
      try {
        let newUrl: string;
        if (!url.startsWith("http")) {
          newUrl = `https://buildyou-front.stg.startegois.com${url}`;
          const response = await fetch(newUrl);
          const imageData = await response.blob();
          setImageSource({ uri: URL.createObjectURL(imageData) });
          setLoading(false);
        } else {
          const response = await fetch(url as string);
          const imageData = await response.blob();
          setImageSource({ uri: URL.createObjectURL(imageData) });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();
  }, [url]);

  return [imageSource, loading, error];
};
