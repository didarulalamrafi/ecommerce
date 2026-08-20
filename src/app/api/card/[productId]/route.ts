import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

interface RouteParams {
  params: Promise<{ productId: string }>;
}

// PUT /api/cart/[productId] — নির্দিষ্ট আইটেমের qty আপডেট করে
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }

  const { productId } = await params;
  const { qty } = await request.json();

  if (typeof qty !== "number" || qty < 1) {
    return NextResponse.json({ error: "ভুল পরিমাণ" }, { status: 400 });
  }

  const db = await getDb();
  await db
    .collection("carts")
    .updateOne(
      { userId: session.user.id, productId },
      { $set: { qty, updatedAt: new Date() } },
    );

  return NextResponse.json({ success: true });
}

// DELETE /api/cart/[productId] — কার্ট থেকে আইটেম সরায়
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "লগইন করা নেই" }, { status: 401 });
  }

  const { productId } = await params;

  const db = await getDb();
  await db
    .collection("carts")
    .deleteOne({ userId: session.user.id, productId });

  return NextResponse.json({ success: true });
}