'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

type Category = {
  _id: string;
  name: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function AddSubcategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: '', // 🔁 Changed from categoryId to category
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
        fetchCategories(storedToken);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, [router]);

  const fetchCategories = async (accessToken: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = Array.isArray(res.data.data.data)
        ? res.data.data.data
        : [];
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      alert('Subcategory name and parent category are required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/subcategories`,
        {
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Subcategory added successfully');
      router.push('/subcategories');
    } catch (err: any) {
      console.error('Error creating subcategory:', err?.response?.data || err.message);
      alert('Failed to create subcategory');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Subcategory</h1>
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
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
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
