// lib/auth-client.ts
// better-auth এর client — সরাসরি Express backend এর /api/auth/* এন্ডপয়েন্টে
// কল করবে, httpOnly session cookie ব্রাউজার নিজে থেকেই সামলাবে
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// UPDATED: backend (config/auth.js) আর frontend আলাদা repo হওয়ায়
// TypeScript নিজে থেকে কাস্টম ফিল্ড (role, number, address, bio) এর টাইপ
// বুঝতে পারছিল না — ফলে session.user.role এ "Property does not exist on
// type 'never'" এরর আসছিল। inferAdditionalFields দিয়ে backend এর schema
// এর সাথে হুবহু মিলিয়ে বলে দেওয়া হলো, যাতে সঠিক টাইপ পাওয়া যায়।
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Express backend URL, যেমন http://localhost:5000
  fetchOptions: {
    credentials: "include", // cross-domain হলেও cookie পাঠাবে
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        number: { type: "string", required: false },
        address: { type: "string", required: false },
        bio: { type: "string", required: false },
      },
    }),
  ],
});

// component এ session/state লাগলে এই hook সরাসরি ব্যবহার করা যায়:
// const { data: session, isPending } = useSession();
// session.user.role, session.user.number ইত্যাদি এখন সঠিক টাইপ পাবে
export const { signIn, signUp, signOut, useSession } = authClient;