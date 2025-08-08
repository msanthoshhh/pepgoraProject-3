'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '@/components/Sidebar';
import { getPaginationRange } from '@/components/GetPage';


type Category = {
  _id: string;
  name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    name: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    imageUrl: '',
  });

  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Fixed limit (you can make this dynamic)

  const router = useRouter();
  const API_BASE_URL = 'http://localhost:4000';

  // ✅ Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
      router.push('/login');
    } else {
      try {
        const decoded: TokenPayload = jwtDecode(storedToken);
        console.log('Decoded Role:', decoded.role);
        setToken(storedToken);
        setUserRole(decoded.role);

      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, [router]);

  // ✅ Fetch categories with pagination
  const fetchCategories = async (accessToken: string, currentPage: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`, {
        params: { page: currentPage, limit },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setCategories(data);
      console.log('Fetched categories:', res.data.data.pagination.totalPages);
      setTotalPages(res.data.data.pagination.totalPages || 1);
      // console.log('Fetched categories:', data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories(token, page);
    }
  }, [token, page]);

  // ✅ Delete Category
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If last item on page was deleted, move to previous page if possible
      if (categories.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchCategories(token!, page);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // ✅ Start Edit Mode
  const startEdit = (cat: Category) => {
    setEditingCategory(cat._id);
    setEditForm({
      name: cat.name,
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || '',
      metaKeyword: cat.metaKeyword || '',
      imageUrl: cat.imageUrl || '',
    });
  };

  // ✅ Cancel Edit
  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({
      name: '',
      metaTitle: '',
      metaDescription: '',
      metaKeyword: '',
      imageUrl: '',
    });
  };

  // ✅ Save Edit
  const saveEdit = async (id: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/categories/${id}`,
        {
          name: editForm.name,
          metaTitle: editForm.metaTitle,
          metaDescription: editForm.metaDescription,
          metaKeyword: editForm.metaKeyword,
          imageUrl: editForm.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cancelEdit();
      fetchCategories(token!, page);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="ml-60 flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          {/* <button
            onClick={() => router.push('/categories/add')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            ➕ Add Category
          </button> */}
          {userRole !== 'pepagora_manager' && (
  <button
    onClick={() => router.push('/categories/add')}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
  >
     Add Category
  </button>
)}

        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow p-10">
            <p className="text-gray-600 text-lg">No categories found.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Categories</th>
                    <th className="p-3 text-left">Meta Title</th>
                    <th className="p-3 text-left">Meta Keywords</th>
                    <th className="p-3 text-left">Meta Description</th>
                     {userRole !== 'pepagora_manager' && (
                    <th className="p-3 text-center">Actions</th> )}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className={`border-t hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      {/* Image */}
                      <td className="p-3">
                        {cat.imageUrl ? (
                          <a
                            href={cat.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-14 h-14 object-cover rounded-lg shadow-sm hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}
                      </td>

                      {editingCategory === cat._id ? (
                        <>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editForm.metaTitle}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  metaTitle: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editForm.metaKeyword}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  metaKeyword: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editForm.metaDescription}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  metaDescription: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3 text-center space-x-2">
                            <button
                              onClick={() => saveEdit(cat._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">{cat.name}</td>
                          <td className="p-3">{cat.metaTitle || '-'}</td>
                          <td className="p-3">{cat.metaKeyword || '-'}</td>
                          <td className="p-3">{cat.metaDescription || '-'}</td>
                          {/* <td className="p-3 text-center flex justify-center gap-2"> */}
                            {/* <button
                              onClick={() => startEdit(cat)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                            >
                              ✏ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                            >
                              🗑 Delete
                            </button> */}
                          {/* </td> */}
                          <td className="p-3 text-center flex justify-center gap-2">
  {userRole !== 'pepagora_manager' && (
    <>
      <button
        onClick={() => startEdit(cat)}
        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
      >
         Edit
      </button>
      <button
        onClick={() => handleDelete(cat._id)}
        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        Delete
      </button>
    </>
  )}
</td>

                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              {/* <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button> */}
              {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    {/* Prev Button */}
    <button
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
    >
      &laquo; Prev
    </button>

    {/* Page Numbers */}
    {getPaginationRange(page, totalPages).map((p, idx) =>
      p === '...' ? (
        <span key={idx} className="px-3 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => setPage(p as number)}
          className={`px-3 py-1 rounded ${
            p === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {p}
        </button>
      )
    )}

    {/* Next Button */}
    <button
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
    >
      Next &raquo;
    </button>
  </div>
)}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
