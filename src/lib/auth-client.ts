// lib/auth-client.ts
// better-auth এর client — সরাসরি Express backend এর /api/auth/* এন্ডপয়েন্টে
// কল করবে, httpOnly session cookie ব্রাউজার নিজে থেকেই সামলাবে
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Express backend URL, যেমন http://localhost:5000
  fetchOptions: {
    credentials: "include", // cross-domain হলেও cookie পাঠাবে
  },
});

// component এ session/state লাগলে এই hook সরাসরি ব্যবহার করা যায়:
// const { data: session, isPending } = useSession();
export const { signIn, signUp, signOut, useSession } = authClient;