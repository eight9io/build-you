import http from '../utils/http';

export const serviceAddEmployee = (data: {
  user: string;
  companyMobile: string;
}) => {
  return http.post('/user/employee/add', data);
};

export const serviceDeleteEmployee = (data: {
  user: string;
  companyMobile: string;
}) => {
  return http.post('/user/employee/delete', data);
};

export const serviceGetAllEmployee = (companyId: string) => {
  return http.get(`/user/employee/all/${companyId}`);
};
