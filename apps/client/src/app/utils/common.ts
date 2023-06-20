import queryString from 'query-string';
import dayjs from './date.util';
export const getRandomId = () => Math.random().toString(36).slice(2, 11);

export const getUrlParam = (url: string, param: string) => {
  const parsedQueryString = queryString.parse(url.split('?')[1]);
  return parsedQueryString[param];
};

export const getChallengeStatusColor = (status: string | undefined) => {
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
}