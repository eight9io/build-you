import axios from 'axios';

const httpInstance = axios.create({
  timeout: 60000,
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error: any) => console.log(error);

export const setAuthToken = (token: string | null) => {
  if (token) {
    httpInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete httpInstance.defaults.headers.common['Authorization'];
  }
};

// export function setupInterceptor() {
//   httpInstance.interceptors.request.use(
//     function (config) {
//       return config;
//     },
//     function (error) {
//       handleError(error);
//       return Promise.reject(error);
//     }
//   );

//   httpInstance.interceptors.response.use(
//     function (res) {
//       if (res.status === 201) {
//         return res.data;
//       } else if ([400].includes(res.status)) {
//         const result = res.data;
//         console.log(11111, result);
//         handleError(result);
//         return result;
//       }

//       return;
//     },
//     function (error) {
//       handleError(error);
//       return Promise.reject(error);
//     }
//   );
// }

export default httpInstance;
