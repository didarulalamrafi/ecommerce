"use client";

import { useRouter } from "next/navigation";
import ProductForm from "../components/Productform";

export default function AddProductsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg px-5 py-10 md:px-8">
      <ProductForm
        onSaved={() => {
          router.push("/seller/dashboard/products");
        }}
      />
    </div>
  );
}
