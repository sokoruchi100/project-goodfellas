import axios from "axios";

export const checkAuthentication = () => {
  return axios.get("/api/ensure-auth", { withCredentials: true });
};
