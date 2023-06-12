import httpInstance from '../utils/http';
import { retryRequest } from '../utils/retryRequest';
import { ICreateProgress } from '../types/progress';
import { getImageExtension } from '../utils/uploadUserImage';
import { IUploadMediaWithId } from '../types/media';

export const createProgress = (data: ICreateProgress) => {
  return httpInstance.post('/challenge/progress/create', data);
};

export const updateProgressImage = (
  progressId: string,
  image: IUploadMediaWithId[]
) => {
  const imageData = new FormData();

  image.forEach((image) => {
    const extension = getImageExtension(image.uri);
    imageData.append('file', {
      uri: image.uri,
      name: `${image.id}.${extension}`,
      type: `image/${extension}`,
    } as any);
  });

  return retryRequest(() => {
    return httpInstance.post(
      `/challenge/progress/image/${progressId}`,
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  });
};

export const updateProgressVideo = (
  progressId: string,
  video: IUploadMediaWithId
) => {
  const videoData = new FormData();
  videoData.append('file', {
    uri: video.uri,
    name: `${video.id}.mp4`,
    type: `video/mp4`,
  } as any);
  return retryRequest(() => {
    return httpInstance.post(`/challenge/progress/video/${progressId}`, videoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });
};

export const getProgressById = (id: string) => {};
