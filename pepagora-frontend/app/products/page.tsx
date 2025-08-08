'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '@/components/Sidebar';
import { ca } from 'zod/locales';
import { set } from 'zod';
import { getPaginationRange } from '@/components/GetPage';

type Products = {
  _id: string;
  name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
  subcategory?: string;
};


type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function productsPage() {
  const [products, setproducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    subcategory: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    imageUrl: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Fixed limit (you can make this dynamic)

  const router = useRouter();
  const API_BASE_URL = 'http://localhost:4000';

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
      router.push('/login');
    } else {
      try {
        const decoded: TokenPayload = jwtDecode(storedToken);
        setToken(storedToken);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, [router]);

  const fetchproducts = async (accessToken: string,currentPage:number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, {
        params: { page: currentPage, limit: limit },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setproducts(data);
      console.log('Fetched products:', res.data.data.data);
      setTotalPages(res.data.data.pagination.totalPages || 1);
      // console.log('Fetched products:', res.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setproducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchproducts(token, page);
    }
  }, [token, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // For cookie (refreshToken)
      });
      // fetchproducts(token!);
       if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchproducts(token!, page);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // console.log('Products:', products?.map(product => product.subcategory?._id || 'No subcategory'));

  const startEdit = (product: Products) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      subcategory: product.subcategory || '',
      metaTitle: product.metaTitle || '',
      metaKeyword: product.metaKeyword || '',
      metaDescription: product.metaDescription || '',
      imageUrl: product.imageUrl || '',
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      name: '',
      subcategory: '',
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
      imageUrl: '',
    });
  };

  const saveEdit = async (id: string, subcategoryId: string) => {
    if (!editForm.name.trim()) {
      alert('Name is required');
      return;
    }

    try {
      const payload = {
        name: editForm.name,
        subcategory: subcategoryId,
        imageUrl: editForm.imageUrl,
        metaTitle: editForm.metaTitle,
        metaKeyword: editForm.metaKeyword,
        metaDescription: editForm.metaDescription,
      };

      console.log('Saving eddfghjgfdit:', payload);

      await axios.put(`${API_BASE_URL}/products/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true, // For cookie (refreshToken)
      });

      cancelEdit();
      fetchproducts(token!, page);
    } catch (err: any) {
      console.error('Update failed:', err?.response?.data || err.message);
      alert('Update failed. See console for details.');
    }
  };

  return (
    // <div className="p-6 max-w-6xl mx-auto">
    //   <Sidebar />
    //   <div className="flex justify-between items-center mb-6">
    //     <h1 className="ml-80 text-2xl font-bold">products</h1>
    //     <button
    //       onClick={() => router.push('/products/add')}
    //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //     >
    //       Add Products
    //     </button>
    //   </div>

    //   {loading ? (
    //     <p>Loading products...</p>
    //   ) : products.length === 0 ? (
    //     <p>No products found.</p>
    //   ) : (
    //     <div className="ml-80 overflow-x-auto">
    //       <table className="w-full border border-gray-200">
    //         <thead>
    //           <tr className="bg-gray-200 text-left">
    //             <th className="p-2">Image</th>
    //             <th className="p-2">Name</th>
    //             {/* <th className="p-2">Category</th> */}
    //             <th className="p-2">Meta Title</th>
    //             <th className="p-2">Meta Keyword</th>
    //             <th className="p-2">Meta Description</th>
    //             <th className="p-2">Actions</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {products.map((product) => (
    //             <tr key={product._id} className="border-t">
    //               <td className="p-2">
    //                 {product.imageUrl ? (
    //                   <img
    //                     src={product.imageUrl}
    //                     alt={product.name}
    //                     className="w-16 h-16 object-cover rounded"
    //                   />
    //                 ) : (
    //                   <span className="text-gray-400">No image</span>
    //                 )}
    //               </td>

    //               {editingProduct === product._id ? (
    //                 <>
    //                   <td className="p-2">
    //                     <input
    //                       type="text"
    //                       value={editForm.name}
    //                       onChange={(e) =>
    //                         setEditForm({ ...editForm, name: e.target.value })
    //                       }
    //                       className="border p-1 w-full"
    //                     />
    //                   </td>
    //                   <td className="p-2">{product.subcategory?._id || '-'}</td>
    //                   <td className="p-2">
    //                     <input
    //                       type="text"
    //                       value={editForm.metaTitle}
    //                       onChange={(e) =>
    //                         setEditForm({ ...editForm, metaTitle: e.target.value })
    //                       }
    //                       className="border p-1 w-full"
    //                     />
    //                   </td>
                     
    //                   <td className="p-2">
    //                     <input
    //                       type="text"
    //                       value={editForm.metaKeyword}
    //                       onChange={(e) =>
    //                         setEditForm({ ...editForm, metaKeyword: e.target.value })
    //                       }
    //                       className="border p-1 w-full"
    //                     />
    //                   </td>

    //                   <td className="p-2">
    //                     <input
    //                       type="text"
    //                       value={editForm.metaDescription}
    //                       onChange={(e) =>
    //                         setEditForm({
    //                           ...editForm,
    //                           metaDescription: e.target.value,
    //                         })
    //                       }
    //                       className="border p-1 w-full"
    //                     />
    //                   </td>
    //                   <td className="p-2 space-x-2">
    //                     <button
    //                       onClick={() => saveEdit(product._id)}
    //                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
    //                     >
    //                       Save
    //                     </button>
    //                     <button
    //                       onClick={cancelEdit}
    //                       className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
    //                     >
    //                       Cancel
    //                     </button>
    //                   </td>
    //                 </>
    //               ) : (
    //                 <>
    //                   <td className="p-2">{product.name}</td>
    //                   {/* <td className="p-2">{product.subcategory?._id || '-'}</td> */}
    //                   <td className="p-2">{product.metaTitle || '-'}</td>
    //                   <td className="p-2">{product.metaKeyword || '-'}</td>
    //                   <td className="p-2">{product.metaDescription || '-'}</td>
    //                   <td className="p-2 space-x-2">
    //                     <button
    //                       onClick={() => startEdit(product)}
    //                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
    //                     >
    //                       Edit
    //                     </button>
    //                     <button
    //                       onClick={() => handleDelete(product._id)}
    //                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    //                     >
    //                       Delete
    //                     </button>
    //                   </td>
    //                 </>
    //               )}
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   )}
    // </div>
    <div className="flex min-h-screen bg-gray-50">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="ml-65 flex-1 p-6 max-w-6xl mx-auto">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      <button
        onClick={() => router.push('/products/add')}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        ➕ Add Product
      </button>
    </div>

    {/* Loading / Empty State */}
    {loading ? (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    ) : products.length === 0 ? (
      <div className="text-center bg-white rounded-lg shadow p-10">
        <p className="text-gray-600 text-lg">No products found.</p>
        <button
          onClick={() => router.push('/products/add')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Your First Product
        </button>
      </div>
    ) : (
      <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Meta Title</th>
              <th className="p-3 text-left">Meta Keyword</th>
              <th className="p-3 text-left">Meta Description</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className={`border-t hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Image */}
                <td className="p-3">
                  {product.imageUrl ? (
                     <a
                      href={product.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm hover:opacity-80 transition"
                      />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>

                {/* Editable or Read-only */}
                {editingProduct === product._id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value})
                        }
                        className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.metaTitle}
                        onChange={(e) =>
                          setEditForm({ ...editForm, metaTitle: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.metaKeyword}
                        onChange={(e) =>
                          setEditForm({ ...editForm, metaKeyword: e.target.value })
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
                        onClick={() => saveEdit(product._id, product.subcategory || '')}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                      >
                        ✖ Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.metaTitle || '-'}</td>
                    <td className="p-3">{product.metaKeyword || '-'}</td>
                    <td className="p-3">{product.metaDescription || '-'}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
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
