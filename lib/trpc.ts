import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const trpc = createTRPCReact<AppRouter>();

const AUTH_TOKEN_KEY = "auth_token";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  throw new Error("No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL");
};

export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
        async headers() {
          const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
          return token ? { authorization: `Bearer ${token}` } : {};
        },
        async fetch(url, options) {
          const response = await globalThis.fetch(url, options);
          const contentType = response.headers.get('content-type') ?? '';

          if (contentType.includes('text/html')) {
            console.error('[tRPC] Server returned HTML instead of JSON. URL:', url, 'Status:', response.status);
            throw new Error(
              response.status === 404
                ? 'API endpoint not found. The server may be starting up — please try again.'
                : `Server error (${response.status}). Please try again later.`
            );
          }

          const cloned = response.clone();
          const text = await cloned.text();

          if (!text || text.trim().length === 0) {
            console.error('[tRPC] Empty response body. URL:', url, 'Status:', response.status);
            throw new Error('Empty response from server. Please try again.');
          }

          try {
            JSON.parse(text);
          } catch {
            console.error('[tRPC] Invalid JSON response. URL:', url, 'Body:', text.substring(0, 200));
            throw new Error('Invalid response from server. Please try again.');
          }

          return response;
        },
      }),
    ],
  });
};

export const trpcClient = createTRPCClient();
