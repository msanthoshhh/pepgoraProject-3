'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

type Subcategory = {
  _id: string;
  name: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function AddProductPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    subcategory: '', // 🔁 Changed from categoryId to subcategory
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    imageUrl: '',
  });

  const router = useRouter();
  const API_BASE_URL = 'http://localhost:4000';

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
      router.push('/login');
    } else {
      try {
        const decoded: TokenPayload = jwtDecode(storedToken);
        console.log('Decoded Role:', decoded.role);
        setToken(storedToken);
        fetchsubcategories(storedToken);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, [router]);

  const fetchsubcategories = async (accessToken: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subcategories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = Array.isArray(res.data.data.data)
        ? res.data.data.data
        : [];
        console.log('Fetched subcategories:', res.data.data.data);
      setSubcategories(data);
      // console.log('Fetched subcategories:', res);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.subcategory) {
      alert('Subcategory name and parent category are required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/products`,
        {
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Product added successfully');
      router.push('/products');
    } catch (err: any) {
      console.error('Error creating product:', err?.response?.data || err.message);
      alert('Failed to create product');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Parent Category</label>
          <select
            value={form.subcategory}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          >
            <option value="">-- Select Category --</option>
            {subcategories.map((subcat) => (
              <option key={subcat._id} value={subcat._id}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Meta Title</label>
          <input
            type="text"
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
       

        <div>
          <label className="block font-medium">Meta Keywords</label>
          <input
            type="text"
            value={form.metaKeyword}
            onChange={(e) => setForm({ ...form, metaKeyword: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Meta Description</label>
          <textarea
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
