import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL;

export function useClerkQuery<Result>(url: string) {
  const { getToken, userId } = useAuth();

  return useQuery<Result>({
    queryKey: [url, userId],
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
  onSuccess?: (data?: unknown, variables?: unknown) => void,
  onError?: (error: Error, variables: unknown) => void,
  refreshKeys?: string[],
) {
  const { getToken, userId } = useAuth();
  // Access the client
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...(refreshKeys || []), userId],
    mutationFn: async (req: {
      url: string;
      method: "POST" | "PUT" | "DELETE";
      // eslint-disable-next-line
      data?: Record<string, any>;
    }) => {
      const { url, method = "POST", data } = req;
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
    onSuccess: (data, variables) => {
      // Invalidate and re-fetch
      queryClient.invalidateQueries({
        queryKey: [...(refreshKeys || []), userId],
      });
      onSuccess && onSuccess(data, variables);
    },
    onError: (error, variables) => {
      onError && onError(error, variables);
    },
  });
}
