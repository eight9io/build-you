import queryString from 'query-string';

export const getRandomId = () => Math.random().toString(36).slice(2, 11);

export const getUrlParam = (url: string, param: string) => { 
    const parsedQueryString = queryString.parse(url.split('?')[1]);
    return parsedQueryString[param];
}