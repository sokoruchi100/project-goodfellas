import axios from "axios";

export const getUserId = () => {
  return axios.get("/users/id", { withCredentials: true });
};

export const getCommunities = () => {
  return axios.get("/communities");
};
