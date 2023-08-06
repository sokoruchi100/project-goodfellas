// hooks/useFetchData.js
import { useEffect, useState } from "react";
import { getUserId, getCommunities } from "../services/dataService";

export const useFetchData = () => {
  const [userId, setUserId] = useState(0);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await getUserId();
        setUserId(response.data.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    const fetchCommunities = async () => {
      try {
        const response = await getCommunities();
        setCommunities(response.data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchUserId();
    fetchCommunities();
  }, []);

  return { userId, communities };
};
