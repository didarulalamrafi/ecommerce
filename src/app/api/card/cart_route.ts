import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

// GET /api/cart — লগইন করা ইউজারের সব কার্ট আইটেম রিটার্ন করে
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }

  const db = await getDb();
  const items = await db
    .collection("carts")
    .find({ userId: session.user.id })
    .toArray();

  const cart = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    qty: item.qty,
  }));

  return NextResponse.json(cart);
}

// POST /api/cart — নতুন আইটেম যোগ করে; আগে থেকে থাকলে qty বাড়িয়ে দেয়
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, name, price, image, qty } = body;

  if (!productId || !name || typeof price !== "number") {
    return NextResponse.json(
      { error: "প্রয়োজনীয় তথ্য অনুপস্থিত" },
      { status: 400 },
    );
  }

  const db = await getDb();
  const collection = db.collection("carts");

  const existing = await collection.findOne({
    userId: session.user.id,
    productId,
  });

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $inc: { qty: qty ?? 1 },
        $set: { updatedAt: new Date() },
      },
    );
  } else {
    await collection.insertOne({
      userId: session.user.id,
      productId,
      name,
      price,
      image: image ?? null,
      qty: qty ?? 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}