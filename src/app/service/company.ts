import http from "../utils/http";

export const serviceGetEmployeeList = (idCompany: any) =>
  http.post(`/user/employee/all/${idCompany}`);
export const serviceRemoveEmployee = (employeeId: any, companyId: any) =>
  http.post("/user/employee/remove", {
    user: employeeId,
    companyUser: companyId,
  });
export const serviceAddEmployee = (newEmployee: any, companyId: any) =>
  http.post("/user/employee/add", {
    email: newEmployee,
    companyUser: companyId,
  });

export const serviceGetAllCompany = () => http.get("user/company/all");
