import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL;

export function useClerkQuery(url: string) {
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

export function useClerkMutation(
  url: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  onSuccess?: () => void,
  onError?: () => void,
) {
  const { getToken } = useAuth();
  // Access the client
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const authToken = await getToken();
      const resourceUrl = `${API_URL}/${url}`;
      const res = await fetch(resourceUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Network response error");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and re-fetch
      queryClient.invalidateQueries({ queryKey: [url] });
      onSuccess && onSuccess();
    },
    onError: () => {
      onError && onError();
    },
  });
}
