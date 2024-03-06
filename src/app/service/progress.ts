import { AxiosResponse } from "axios";
import httpInstance from "../utils/http";
import {
  ICreateProgress,
  ICreateProgressComment,
  IProgressComment,
  IProgressLike,
  IUpdateProgress,
} from "../types/progress";
import { IUploadMediaWithId } from "../types/media";
import { IProgressChallenge } from "../types/challenge";
import { createFileFromUri } from "../utils/image";

export const createProgress = (data: ICreateProgress) => {
  return httpInstance.post("/challenge/progress/create", data);
};

export const deleteProgress = (id: string) => {
  return httpInstance.delete(`/challenge/progress/delete/${id}`);
};

export const updateProgressImage = async (
  progressId: string,
  image: IUploadMediaWithId[]
) => {
  const imageForm = new FormData();

  await Promise.all(
    image.map(async (image) => {
      const imageFile = await createFileFromUri(image.uri);

      imageForm.append("files", imageFile);
    })
  );

  const uploadingImage = await httpInstance.post(
    `/challenge/progress/image/${progressId}`,
    imageForm,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return uploadingImage;
};

export const updateProgressVideo = async (
  progressId: string,
  video: IUploadMediaWithId
) => {
  const videoData = new FormData();
  const videoFile = await createFileFromUri(video.uri);
  videoData.append("file", videoFile);

  return httpInstance.post(
    `/challenge/progress/video/${progressId}`,
    videoData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getProgressById = async (
  id: string
): Promise<AxiosResponse<IProgressChallenge>> => {
  const res = await httpInstance.get(`/challenge/progress/${id}`);
  res.data = {
    ...res.data,
    owner: res.data.user,
  };
  return res;
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
    return Promise.reject("progressId is required");
  }
  return httpInstance.post("/challenge/progress/like/create", {
    progress: progressId,
  });
};

export const deleteProgressLike = (progressId?: string) => {
  if (!progressId) {
    return Promise.reject("progressId is required");
  }
  return httpInstance.delete(`/challenge/progress/like/delete/${progressId}`);
};

export const createProgressComment = (data: ICreateProgressComment) => {
  return httpInstance.post("/challenge/progress/comment/create", data);
};

export const updateProgress = (id: string, data: IUpdateProgress) => {
  return httpInstance.put(`/challenge/progress/update/${id}`, data);
};

export const deleteProgressComment = (id: string) => {
  return httpInstance.delete(`/challenge/progress/comment/delete/${id}`);
};
