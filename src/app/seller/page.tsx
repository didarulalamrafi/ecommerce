"use client";

// app/seller/dashboard/page.tsx e eita boshao
// Assumption: NEXT_PUBLIC_API_URL diye backend call korcho, Better Auth session cookie
// credentials: "include" diye automatically jabe

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface CartInfo {
  totalInCarts: number;
  cartCount: number;
}

interface Stats {
  totalProducts: number;
  totalAddedToCart: number;
  cartInfoMap: Record<string, CartInfo>;
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalAddedToCart: 0,
    cartInfoMap: {},
  });
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/seller/products`, { credentials: "include" }),
        fetch(`${API_URL}/api/seller/products/stats`, {
          credentials: "include",
        }),
      ]);

      const productsData = await productsRes.json();
      const statsData = await statsRes.json();

      if (!productsData.success) throw new Error(productsData.message);

      setProducts(productsData.products);
      setStats(statsData);
    } catch (err) {
      setError("Products load korte problem hoyeche");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/seller/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteTarget(null);
    } catch (err) {
      setError("Delete korte problem hoyeche");
    }
  };

  const handleUpdate = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const res = await fetch(`${API_URL}/api/seller/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));
      setEditingProduct(null);
    } catch (err) {
      setError("Update korte problem hoyeche");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Products Added to Cart (by users)
          </p>
          <p className="text-3xl font-bold">{stats.totalAddedToCart}</p>
        </div>
      </div>

      {/* Product list */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">In Carts</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const cartInfo: CartInfo = stats.cartInfoMap?.[product._id] || {
                cartCount: 0,
                totalInCarts: 0,
              };
              return (
                <tr key={product._id} className="border-b">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">৳{product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    {cartInfo.cartCount} user
                    {cartInfo.cartCount !== 1 ? "s" : ""} (
                    {cartInfo.totalInCarts} qty)
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(fields) => handleUpdate(editingProduct._id, fields)}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <p className="mb-4">
              Delete <strong>{deleteTarget.name}</strong>? Eita fire pawa jabe
              na.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget._id)}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSave: (fields: Partial<Product>) => void;
}

function EditModal({ product, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

        <label className="block text-sm mb-1">Name</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block text-sm mb-1">Price</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2 mb-3"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />

        <label className="block text-sm mb-1">Stock</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2 mb-4"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
