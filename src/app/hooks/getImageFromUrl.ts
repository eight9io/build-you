import { useState, useEffect } from "react";
import { ImageSourcePropType } from "react-native";
import { CrashlyticService } from "../service/crashlytic";

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
        if (!url.startsWith("http")) {
          const response = await fetch(url);
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
        CrashlyticService({
          errorType: "Get Image From Url Error",
          error,
        });
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return [imageSource, loading, error];
};
