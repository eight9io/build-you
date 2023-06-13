import { AxiosResponse } from 'axios';
import httpInstance from '../utils/http';
import { retryRequest } from '../utils/retryRequest';
import { ICreateProgress, ICreateProgressComment, ICreateProgressLike, IProgressComment, IProgressLike } from '../types/progress';
import { getImageExtension } from '../utils/uploadUserImage';
import { IUploadMediaWithId } from '../types/media';

export const createProgress = (data: ICreateProgress) => {
  return httpInstance.post('/challenge/progress/create', data);
};

export const deleteProgress = (id: string) => {
  return httpInstance.delete(`/challenge/progress/delete/${id}`);
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

export const getProgressLikes = (
  id: string
): Promise<AxiosResponse<IProgressLike[]>> => {
  return httpInstance.get(`/challenge/progress/like/${id}`);
};

export const getProgressComments = (
  id: string
): Promise<AxiosResponse<IProgressComment[]>> => {
  return httpInstance.get(`/challenge/progress/comment/${id}`);
};

export const createProgressLike = (data: ICreateProgressLike) => {
  return httpInstance.post('/challenge/progress/like/create', data);
}

export const createProgressComment = (data: ICreateProgressComment) => {
  return httpInstance.post('/challenge/progress/comment/create', data);
}