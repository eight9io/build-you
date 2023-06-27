import { AxiosResponse } from 'axios';
import httpInstance from '../utils/http';
import { retryRequest } from '../utils/retryRequest';
import {
  ICreateProgress,
  ICreateProgressComment,
  ICreateProgressLike,
  IProgressComment,
  IProgressLike,
  IUpdateProgress,
} from '../types/progress';
import { getImageExtension } from '../utils/uploadUserImage';
import { IUploadMediaWithId } from '../types/media';
import { Platform } from 'react-native';

export const createProgress = (data: ICreateProgress) => {
  return httpInstance.post('/challenge/progress/create', data);
};

export const deleteProgress = (id: string) => {
  return httpInstance.delete(`/challenge/progress/delete/${id}`);
};

export const updateProgressImage = async (
  progressId: string,
  image: IUploadMediaWithId[]
) => {
  const imageForm = new FormData();
  image.map((image) => {
    const extension = getImageExtension(image.uri);
    const uri =
      Platform.OS === 'android' ? image : image?.uri.replace('file://', '');
    const imageItemToUpload = {
      uri: uri,
      name: `${image.id}.${extension}`,
      type: `image/${extension}`,
    };
    imageForm.append('files', imageItemToUpload as any);
  });

  const uploadingImage = await httpInstance.post(
    `/challenge/progress/image/${progressId}`,
    imageForm,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return uploadingImage;
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
  return httpInstance.post(
    `/challenge/progress/video/${progressId}`,
    videoData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const getProgressById = (id: string) => {
  return httpInstance.get(`/challenge/progress/${id}`);
};

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

export const createProgressLike = (progressId?: string) => {
  if (!progressId) {
    return Promise.reject('progressId is required');
  }
  return httpInstance.post('/challenge/progress/like/create', {
    progress: progressId,
  });
};

export const deleteProgressLike = (progressId?: string) => {
  if (!progressId) {
    return Promise.reject('progressId is required');
  }
  return httpInstance.delete(`/challenge/progress/like/delete/${progressId}`);
};

export const createProgressComment = (data: ICreateProgressComment) => {
  return httpInstance.post('/challenge/progress/comment/create', data);
};

export const updateProgress = (id: string, data: IUpdateProgress) => {
  return httpInstance.put(`/challenge/progress/update/${id}`, data);
};

export const deleteProgressComment = (id: string) => {
  return httpInstance.delete(`/challenge/progress/comment/delete/${id}`);
};
