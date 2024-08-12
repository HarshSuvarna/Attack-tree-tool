import axios from "axios";

export const getSearchedUsers = (params: string) => {
  return axios.get(`/user/search-user/${params}`);
};
