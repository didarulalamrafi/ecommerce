import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // ✅ যোগ করুন
  trustedOrigins: [
    "https://ecommerce-2o6q.vercel.app", // ✅ যোগ করুন
    "http://localhost:3000", // লোকাল ডেভেলপমেন্টের জন্য রেখে দিন
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      number: { type: "string", required: false },
      address: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
});