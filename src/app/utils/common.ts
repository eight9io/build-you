import queryString from "query-string";
import dayjs from "./date.util";
import { IChallenge } from "../types/challenge";
export const getRandomId = () => Math.random().toString(36).slice(2, 11);

export const getUrlParam = (url: string, param: string) => {
  const parsedQueryString = queryString.parse(url.split("?")[1]);
  return parsedQueryString[param];
};

export const getChallengeStatusColor = (
  status: string | undefined,
  mainStatus?: string | undefined
) => {
  if (!status) return "#C5C8D2";
  if (status === "progress") return "#C5C8D2";
  if (status === "done" && mainStatus == "open") return "#FF7B1C";
  if (status === "done") return "#20D231";
  return status !== "open" ? "#20D231" : "#C5C8D2";
};

export const sortArrayByCreatedAt = (
  array: any[],
  key: string,
  order: string
) => {
  return array.sort((a, b) => {
    if (!dayjs(a[key]).isValid() || !dayjs(b[key]).isValid()) {
      throw new Error("Invalid date");
    }
    const dateA = dayjs(a[key]).toDate();
    const dateB = dayjs(b[key]).toDate();
    return order === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

// TODO use lodash isEmpty
export const isObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

// TODO add typescript
export const sortChallengeByStatusFromResponse = (res: any) => {
  if (!res?.data) {
    return [];
  }
  res.data = res.data.flat();
  // remove duplicate data by id
  const uniqueData = res.data.filter(
    (challenge: IChallenge, index: number, self: IChallenge[]) =>
      index === self.findIndex((t) => t.id === challenge.id)
  );
  res.data = uniqueData;

  const closedChallenges = res.data
    .filter(
      (challenge: IChallenge) =>
        challenge.status === "closed" || challenge.status === "done"
    )
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(b.achievementTime).getTime() -
        new Date(a.achievementTime).getTime()
      );
    });

  const openChallenges = res.data
    .filter(
      (challenge: IChallenge) =>
        challenge.status === "open" || challenge.status === "progress"
    )
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(b.achievementTime).getTime() -
        new Date(a.achievementTime).getTime()
      );
    });

  return [...openChallenges, ...closedChallenges];
};

// TODO add typescript
export const sortChallengeByStatus = (challengeList: any) => {
  if (!challengeList) {
    return [];
  }
  challengeList = challengeList.flat();
  // remove duplicate data by id
  // TODO rewrite openChallenges + closedChallenges and filter unique by only using 1 loop
  const uniqueData = challengeList.filter(
    (challenge: IChallenge, index: number, self: IChallenge[]) =>
      index === self.findIndex((t) => t.id === challenge.id)
  );
  challengeList = uniqueData;

  const closedChallenges = challengeList
    .filter(
      (challenge: IChallenge) =>
        challenge.status === "closed" || challenge.status === "done"
    )
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(b.achievementTime).getTime() -
        new Date(a.achievementTime).getTime()
      );
    });

  const openChallenges = challengeList
    .filter(
      (challenge: IChallenge) =>
        challenge.status === "open" || challenge.status === "progress"
    )
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(b.achievementTime).getTime() -
        new Date(a.achievementTime).getTime()
      );
    });

  return [...openChallenges, ...closedChallenges];
};
