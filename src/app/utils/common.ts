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

  const arrangedChallenges = [];
  for (let i = 0; i < uniqueData.length; i++) {
    const challenge = uniqueData[i];
    if (challenge.status === "closed" || challenge.status === "done") {
      // compare with last challenge in array in achievementTime
      const lastChallenge = arrangedChallenges[arrangedChallenges.length - 1];
      if (lastChallenge) {
        if (
          new Date(lastChallenge.achievementTime).getTime() -
            new Date(challenge.achievementTime).getTime() >
          0
        ) {
          // add to -2 index of array
          arrangedChallenges.splice(
            arrangedChallenges.length - 2,
            0,
            challenge
          );
        } else {
          // add to end of array
          arrangedChallenges.push(challenge);
        }
      } else {
        arrangedChallenges.push(challenge);
      }
    } else if (challenge.status === "open" || challenge.status === "progress") {
      const firstChallenge = arrangedChallenges[0];
      if (firstChallenge) {
        if (
          new Date(firstChallenge.achievementTime).getTime() -
            new Date(challenge.achievementTime).getTime() <
          0
        ) {
          arrangedChallenges.unshift(challenge);
        } else {
          arrangedChallenges.splice(1, 0, challenge);
        }
      } else {
        arrangedChallenges.push(challenge);
      }
    }
  }
  return arrangedChallenges;
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

  const arrangedChallenges = [];
  for (let i = 0; i < uniqueData.length; i++) {
    const challenge = uniqueData[i];
    if (challenge.status === "closed" || challenge.status === "done") {
      // compare with last challenge in array in achievementTime
      const lastChallenge = arrangedChallenges[arrangedChallenges.length - 1];
      if (lastChallenge) {
        if (
          new Date(lastChallenge.achievementTime).getTime() -
            new Date(challenge.achievementTime).getTime() >
          0
        ) {
          // add to -2 index of array
          arrangedChallenges.splice(
            arrangedChallenges.length - 2,
            0,
            challenge
          );
        } else {
          // add to end of array
          arrangedChallenges.push(challenge);
        }
      } else {
        arrangedChallenges.push(challenge);
      }
    } else if (challenge.status === "open" || challenge.status === "progress") {
      const firstChallenge = arrangedChallenges[0];
      if (firstChallenge) {
        if (
          new Date(firstChallenge.achievementTime).getTime() -
            new Date(challenge.achievementTime).getTime() <
          0
        ) {
          arrangedChallenges.unshift(challenge);
        } else {
          arrangedChallenges.splice(1, 0, challenge);
        }
      } else {
        arrangedChallenges.push(challenge);
      }
    }
  }
  return arrangedChallenges;
};
