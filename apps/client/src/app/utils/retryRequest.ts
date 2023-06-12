const NUMBER_OF_RETRIES = 3;
const RETRY_DELAY = 1000;

export const retryRequest = (
  fn: any,
  retriesLeft = NUMBER_OF_RETRIES,
  interval = RETRY_DELAY
) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: any) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          retryRequest(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};
