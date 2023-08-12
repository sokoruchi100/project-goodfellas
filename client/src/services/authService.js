import axios from "axios";

export const checkAuthentication = () => {
  return axios.get("/auth/ensure", { withCredentials: true });
};
