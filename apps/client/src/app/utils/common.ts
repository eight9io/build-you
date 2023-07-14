import queryString from 'query-string';
import dayjs from './date.util';
import { IChallenge } from '../types/challenge';
export const getRandomId = () => Math.random().toString(36).slice(2, 11);

export const getUrlParam = (url: string, param: string) => {
  const parsedQueryString = queryString.parse(url.split('?')[1]);
  return parsedQueryString[param];
};

export const getChallengeStatusColor = (status: string | undefined) => {
  if (!status) return '#C5C8D2';
  if (status === 'progress') return '#C5C8D2';
  if (status === 'done') return '#20D231';
  return status !== 'open' ? '#20D231' : '#C5C8D2';
};

export const sortArrayByCreatedAt = (
  array: any[],
  key: string,
  order: string
) => {
  return array.sort((a, b) => {
    if (!dayjs(a[key]).isValid() || !dayjs(b[key]).isValid()) {
      throw new Error('Invalid date');
    }
    const dateA = dayjs(a[key]).toDate();
    const dateB = dayjs(b[key]).toDate();
    return order === 'asc'
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

export const isObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

export const sortChallengeByStatus = (res: any) => {
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
    .filter((challenge: IChallenge) => challenge.status === 'closed')
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(b.achievementTime).getTime() -
        new Date(a.achievementTime).getTime()
      );
    });

  const openChallenges = res.data
    .filter((challenge: IChallenge) => challenge.status === 'open')
    .sort((a: IChallenge, b: IChallenge) => {
      return (
        new Date(b.achievementTime).getTime() -
        new Date(a.achievementTime).getTime()
      );
    });

  return [...openChallenges, ...closedChallenges];
};
