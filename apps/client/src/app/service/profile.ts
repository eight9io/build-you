import http from "../utils/http";

export const serviceUpdateMyProfile=(id:any,data:any)=> http.put(`/user/update/${id}`, data);
export const serviceGetListOccupation=()=> http.get('/occupation/list');
export const serviceDeleteAccount=(id:any)=> http.put(`/user/delete/${id}`);
export const serviceUpdateAvatar=(formData:any)=> http.post('/user/avatar',formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
export const serviceUpdateCover=(formData:any)=> http.post('/user/cover',formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  export const serviceGetListFollowing=(idUser:any)=> http.get(`/user/following/all/${idUser}`);
  export const serviceGetListFollower=(id:any)=> http.get(`/user/followers/all/${id}`);
  export const serviceUnfollow=(idUser:any)=> http.post('/user/unfollow',{
    "following": idUser
  });
  
  export const serviceFollow=(idUser:any)=> http.post('/user/follow',{
    "following": idUser
  });

  // ==== COMPANY  ====== 

  export const serviceGetEmployeeList=(idCompany:any)=> http.post(`/user/employee/all/${idCompany}`);
  export const serviceRemoveEmployee=(newEmployee:any)=> http.post('/user/employee/remove',newEmployee);
  export const serviceAddEmployee=(newEmployee:any)=> http.post('/user/employee/add',newEmployee);
  