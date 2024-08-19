import axios from "axios";

export const getSearchedUsers = (params: string) => {
  return axios.get(`/user/search-user/${params}`);
};

export const getUserInfo = (id: string) => {
  return axios.get(`/user/${id}`);
};

export const updateUser = (id: string, params: any) => {
  return axios.put(`/user/${id}`, params);
};
