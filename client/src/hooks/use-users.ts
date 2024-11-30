import { API_URL } from "@/config";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const url = API_URL + "/users";

interface UsersResponse {
  users: { username: string }[];
  total: number;
}

export const useUsers = () => {
  const { getToken } = useAuth();
  const fetchUsers = async (): Promise<UsersResponse> => {
    const response = await axios.get<UsersResponse>(url, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });   
    return response.data;
  };

  return useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
