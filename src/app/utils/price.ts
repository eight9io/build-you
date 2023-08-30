export const stringPriceToNumber = (str: string) => {
  return Number(str.replace(/[^0-9.-]+/g, ""));
};

export const numberToStringPrice = (num: number) => {
  return num.toFixed(2);
};
