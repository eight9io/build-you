import httpInstance from "./http";
import { CrashlyticService } from "../service/crashlytic";
import { createFileFromUri } from "./image";

export const uploadNewVideo = async (video: string | undefined) => {
  try {
    if (!video) return;
    const formData = new FormData();
    const videoFile = await createFileFromUri(video);

    formData.append("file", videoFile);

    const response = await httpInstance.post("/user/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (e) {
    console.error("uploadNewVideo", e);
    CrashlyticService({
      errorType: "Upload Video Error",
      error: e,
    });
  }
};
