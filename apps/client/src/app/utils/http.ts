import axios from 'axios';

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error: any) => console.log(error);
export const setAuthToken = (token: string) => {
  if (token) {
    httpInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete httpInstance.defaults.headers.common['Authorization'];
  }
};

export function setupInterceptor() {
  httpInstance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      handleError(error);
      return Promise.reject(error);
    }
  );

  httpInstance.interceptors.response.use(
    function (res) {
      const data = res.data;

      if (data.statusCode === 200) {
        return data;
      } else if ([400].includes(data.statusCode)) {
        const result = data?.message || 'Something went wrong';
        return result;
      }

      return;
    },
    function (error) {
      handleError(error);
      return Promise.reject(error);
    }
  );
}

export default httpInstance;
