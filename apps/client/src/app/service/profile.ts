import http from "../utils/http";

export const serviceUpdateMyProfile=(id:any,data:any)=> http.put(`/user/update/${id}`, data);
export const serviceGetListOccupation=()=> http.get('/occupation/list');