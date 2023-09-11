import http from "../utils/http";

export const serviceGetFeed = async ({
  page = 1,
  take = 20,
}: {
  page: number;
  take: number;
}) => {
  return http.get("/feed", {
    params: {
      page,
      take,
    },
  });
};

export const serviceGetFeedUnregistered = async ({
  page = 1,
  take = 20,
}: {
  page: number;
  take: number;
}) => {
  return http.get("/feed/unregistered", {
    params: {
      page,
      take,
    },
  });
};
