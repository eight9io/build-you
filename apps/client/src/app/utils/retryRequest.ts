const NUMBER_OF_RETRIES = 3;
const RETRY_DELAY = 1000;

export const retryRequest = (
  fn: Promise<any>,
  retriesLeft = NUMBER_OF_RETRIES,
  interval = RETRY_DELAY
) => {
  return new Promise((_, reject) => {
    fn.catch((error: any) => {
      setTimeout(() => {
        if (retriesLeft === 1) {
          // reject('maximum retries exceeded');
          reject(error);
          return;
        }
        retryRequest(fn, retriesLeft - 1, interval).then(_, reject);
      }, interval);
    });
  });
};
