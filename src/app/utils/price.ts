export const stringPriceToNumber = (str: string) => {
  return Number(str.replace(/[^0-9.-]+/g, ""));
};

export const numberToStringPrice = (num: number) => {
  return num.toFixed(2);
};

// convert 1000 (string) to 1,000
export const stringToPriceWithCommas = (str: string) => {
  if (!str) {
    return "0";
  }
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberToPriceWithCommas = (num: number) => {
  if (!num) {
    return "0";
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
