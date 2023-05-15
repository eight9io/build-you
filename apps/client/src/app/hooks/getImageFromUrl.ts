import { useState, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';

export const getImageFromUrl = (url: string): [ImageSourcePropType | undefined, boolean, boolean] => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<ImageSourcePropType>({} as ImageSourcePropType);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(url);
        const imageData = await response.blob();
        setImageSource({ uri: URL.createObjectURL(imageData) });
        setLoading(false);
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
