import { MongoClient, Db } from "mongodb";

// NOTE: dev মোডে Next.js hot-reload এ বারবার নতুন connection খোলা এড়াতে
// global object এ client cache করা হচ্ছে (Next.js/MongoDB এর official পরামর্শ)

const uri = process.env.MONGODB_URI as string;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}