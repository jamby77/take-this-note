import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useClerkQuery(url: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const authToken = await getToken();
      const resourceUrl = `${API_URL}/${url}`;
      const res = await fetch(resourceUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        throw new Error("Network response error");
      }

      return res.json();
    },
  });
}
