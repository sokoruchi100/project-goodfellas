import axios from "axios";

export const getUserId = () => {
  return axios.get("/api/user-id", { withCredentials: true });
};

export const getCommunities = () => {
  return axios.get("/api/communities");
};
