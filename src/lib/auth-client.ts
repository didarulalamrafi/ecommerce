import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

// Better Auth এর User type
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
  number?: string;
  address?: string;
  bio?: string;
  role?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Session type
export type Session = {
  user: AuthUser;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
  };
};

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  plugins: [usernameClient()],
});

export const { signIn, signUp, signOut } = authClient;

// Properly typed useSession hook
export const useSession = () => {
  const session = authClient.useSession();
  return {
    data: session.data as Session | null,
    isPending: session.isPending,
    error: session.error,
  };
};