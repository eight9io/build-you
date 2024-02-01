import queryString from "query-string";
import { Platform } from "react-native";
import { AxiosResponse } from "axios";
import isEmpty from "lodash.isempty";
import dayjs from "./date.util";
import { IChallenge } from "../types/challenge";
import i18n from "../i18n/i18n";

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
      throw new Error(i18n.t("invalid_date") || "Invalid date");
    }
    const dateA = dayjs(a[key]).toDate();
    const dateB = dayjs(b[key]).toDate();
    return order === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

export const isObjectEmpty = (obj: any) => {
  return isEmpty(obj);
};

export const sortChallengeByStatusFromResponse = (res: AxiosResponse) => {
  if (!res?.data) {
    return [];
  }
  res.data = res.data.flat();
  // remove duplicate data by id
  const uniqueData = res.data.filter(
    (challenge: IChallenge, index: number, self: IChallenge[]) =>
      index === self.findIndex((t) => t.id === challenge.id)
  );
  let challengeList = uniqueData;
  const closedChallenges = challengeList
    .filter(
      (challenge: IChallenge) =>
        challenge.status === "closed" || challenge.status === "done"
    )
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(a.achievementTime).getTime() -
        new Date(b.achievementTime).getTime()
      );
    });

  const openChallenges = challengeList
    .filter(
      (challenge: IChallenge) =>
        challenge.status === "open" || challenge.status === "progress"
    )
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(a.achievementTime).getTime() -
        new Date(b.achievementTime).getTime()
      );
    });

  return [...openChallenges, ...closedChallenges];
};

export const sortChallengeByStatus = (challengeList: IChallenge[]) => {
  if (!challengeList) {
    return [];
  }
  challengeList = challengeList.flat();
  // remove duplicate data by id
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

export const roundToDecimalOrWhole = (number: number): number => {
  // Check if the number is a whole number (has no decimal part)
  if (Number.isInteger(number)) {
    return Math.floor(number); // Return the number as a whole number
  } else {
    return Math.round(number * 10) / 10; // Return the number rounded to one decimal place
  }
};

export const isMobile = () => {
  return Platform.OS === "android" || Platform.OS === "ios";
};