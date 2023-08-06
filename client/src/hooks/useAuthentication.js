import { useEffect } from "react";
import { checkAuthentication } from "../services/authService";

export const useAuthentication = (isAuthenticated, handleAuthentication) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthentication();
        handleAuthentication(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, [isAuthenticated, handleAuthentication]);
};
