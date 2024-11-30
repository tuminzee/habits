import { API_URL } from "@/config";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const url = API_URL + "/me";

interface User {
  username: string;
}

export const useMe = () => {
  const { getToken } = useAuth();
  const fetchMe = async (): Promise<User> => {
    const response = await axios.get<User>(url, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return response.data;
  };

  return useQuery<User>({
    queryKey: ["me"],
    queryFn: fetchMe,
  });
};
