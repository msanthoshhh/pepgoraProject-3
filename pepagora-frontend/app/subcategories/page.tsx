'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '@/components/Sidebar';
import { ca } from 'zod/locales';
import { getPaginationRange } from '@/components/GetPage';


type Subcategory = {
  _id: string;
  name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
  category?: {
    _id: string;
    name: string;
    metaTitle?: string;
    metaDescription?: string;
    imageUrl?: string;
  };
};


type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    imageUrl: '',
  });  
  const [currentPage, setCurrentPage] = useState(1);
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
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, [router]);

  const fetchSubcategories = async (accessToken: string, currentPage: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/subcategories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: currentPage,
          limit: 1,
        },
      });
      const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setSubcategories(data);
      console.log('Fetched subcategories:', res.data.data);
      setTotalPages(res.data.data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubcategories(token,currentPage);
    }
  }, [token,currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/subcategories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // fetchSubcategories(token!);
      if (subcategories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchSubcategories(token!, currentPage);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
  console.log('Subcatedgbgrgories:', subcategories?.map(subcat => subcat.category?._id || 'No category'));
  

  const startEdit = (subcat: Subcategory) => {
    setEditingSubcategory(subcat._id);
    setEditForm({
      name: subcat.name,
      category: subcat.category?._id || '',
      metaTitle: subcat.metaTitle || '',
      metaKeyword: subcat.metaKeyword || '',
      metaDescription: subcat.metaDescription || '',
      imageUrl: subcat.imageUrl || '',
    });
  };

  const cancelEdit = () => {
    setEditingSubcategory(null);
    setEditForm({
      name: '',
      category: '',
      metaTitle: '',
      metaKeyword: '',
      metaDescription: '',
      imageUrl: '',
    });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name.trim()) {
      alert('Name is required');
      return;
    }

    try {
      const payload = {
        name: editForm.name,
        categoryId: editForm.category,
        metaTitle: editForm.metaTitle,
        metaKeyword: editForm.metaKeyword,
        metaDescription: editForm.metaDescription,
        imageUrl: editForm.imageUrl,
      };

      console.log('Saving edit:', payload);

      await axios.put(`${API_BASE_URL}/subcategories/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'

          

        },
      });

      cancelEdit();
      fetchSubcategories(token!, currentPage);
    } catch (err: any) {
      console.error('Update failed:', err?.response?.data || err.message);
      alert('Update failed. See console for details.');
    }
  };

  return (
  //   <div className="p-6 max-w-6xl mx-auto">
  //     <Sidebar />
  //     <div className="flex justify-between items-center mb-6">
  //       <h1 className="ml-80 text-2xl font-bold">Subcategories</h1>
  //       <button
  //         onClick={() => router.push('/subcategories/add')}
  //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  //       >
  //         Add Subcategory
  //       </button>
  //     </div>

  //     {loading ? (
  //       <p>Loading subcategories...</p>
  //     ) : subcategories.length === 0 ? (
  //       <p>No subcategories found.</p>
  //     ) : (
  //       <div className="ml-80 overflow-x-auto">
  //         <table className="w-full border border-gray-200">
  //           <thead>
  //             <tr className="bg-gray-200 text-left">
  //               <th className="p-2">Image</th>
  //               <th className="p-2">Name</th>
  //               {/* <th className="p-2">Category</th> */}
  //               <th className="p-2">Meta Title</th>
  //               <th className="p-2">Meta Keywords</th>
  //               <th className="p-2">Meta Description</th>
  //               <th className="p-2">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {subcategories.map((subcat) => (
  //               <tr key={subcat._id} className="border-t">
  //                 <td className="p-2">
  //                   {subcat.imageUrl ? (
  //                     <img
  //                       src={subcat.imageUrl}
  //                       alt={subcat.name}
  //                       className="w-16 h-16 object-cover rounded"
  //                     />
  //                   ) : (
  //                     <span className="text-gray-400">No image</span>
  //                   )}
  //                 </td>

  //                 {editingSubcategory === subcat._id ? (
  //                   <>
  //                     <td className="p-2">
  //                       <input
  //                         type="text"
  //                         value={editForm.name}
  //                         onChange={(e) =>
  //                           setEditForm({ ...editForm, name: e.target.value })
  //                         }
  //                         className="border p-1 w-full"
  //                       />
  //                     </td>
  //                     {/* <td className="p-2">{subcat.category?._id || '-'}</td> */}
  //                     <td className="p-2">
  //                       <input
  //                         type="text"
  //                         value={editForm.metaTitle}
  //                         onChange={(e) =>
  //                           setEditForm({ ...editForm, metaTitle: e.target.value })
  //                         }
  //                         className="border p-1 w-full"
  //                       />
  //                     </td>
  //                     <td className="p-2">
  //                       <input
  //                         type="text"
  //                         value={editForm.metaKeyword}
  //                         onChange={(e) =>
  //                           setEditForm({ ...editForm, metaKeyword: e.target.value })
  //                         }
  //                         className="border p-1 w-full"
  //                       />
  //                     </td>
  //                     <td className="p-2">
  //                       <input
  //                         type="text"
  //                         value={editForm.metaDescription}
  //                         onChange={(e) =>
  //                           setEditForm({
  //                             ...editForm,
  //                             metaDescription: e.target.value,
  //                           })
  //                         }
  //                         className="border p-1 w-full"
  //                       />
  //                     </td>
  //                     <td className="p-2 space-x-2">
  //                       <button
  //                         onClick={() => saveEdit(subcat._id)}
  //                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
  //                       >
  //                         Save
  //                       </button>
  //                       <button
  //                         onClick={cancelEdit}
  //                         className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
  //                       >
  //                         Cancel
  //                       </button>
  //                     </td>
  //                   </>
  //                 ) : (
  //                   <>
  //                     <td className="p-2">{subcat.name}</td>
  //                     {/* <td className="p-2">{subcat.category?._id || '-'}</td> */}
  //                     <td className="p-2">{subcat.metaTitle || '-'}</td>
  //                     <td className="p-2">{subcat.metaKeyword || '-'}</td>
  //                     <td className="p-2">{subcat.metaDescription || '-'}</td>
  //                     <td className="p-2 space-x-2">
  //                       <button
  //                         onClick={() => startEdit(subcat)}
  //                         className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
  //                       >
  //                         Edit
  //                       </button>
  //                       <button
  //                         onClick={() => handleDelete(subcat._id)}
  //                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  //                       >
  //                         Delete
  //                       </button>
  //                     </td>
  //                   </>
  //                 )}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     )}
  //   </div>
  <div className="ml-65 flex min-h-screen bg-gray-50">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="flex-1 p-6 max-w-6xl mx-auto">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Subcategories</h1>
      {userRole !== 'pepagora_manager' && (
      <button
        onClick={() => router.push('/subcategories/add')}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        ➕ Add Subcategory
      </button>
      )}
    </div>

    {/* Loading / Empty State */}
    {loading ? (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Loading subcategories...</p>
      </div>
    ) : subcategories.length === 0 ? (
      <div className="text-center bg-white rounded-lg shadow p-10">
        <p className="text-gray-600 text-lg">No subcategories found.</p>
        <button
          onClick={() => router.push('/subcategories/add')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Your First Subcategory
        </button>
      </div>
    ) : (
      <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Sub category</th>
              <th className="p-3 text-left">Meta Title</th>
              <th className="p-3 text-left">Meta Keywords</th>
              <th className="p-3 text-left">Meta Description</th>
              {userRole !== 'pepagora_manager' && (
              <th className="p-3 text-center">Actions</th>)}
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcat, index) => (
              <tr
                key={subcat._id}
                className={`border-t hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Image */}
                <td className="p-3">
                  {subcat.imageUrl ? (
                     <a
                      href={subcat.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={subcat.imageUrl}
                        alt={subcat.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm hover:opacity-80 transition"
                      />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>

                {/* Editable or Read-only Fields */}
                {editingSubcategory === subcat._id ? (
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
                        onClick={() => saveEdit(subcat._id)}
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
                    <td className="p-3">{subcat.name}</td>
                    <td className="p-3">{subcat.metaTitle || '-'}</td>
                    <td className="p-3">{subcat.metaKeyword || '-'}</td>
                    <td className="p-3">{subcat.metaDescription || '-'}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      {userRole !== 'pepagora_manager' && ( 
                        <>
                      <button
                        onClick={() => startEdit(subcat)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subcat._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        🗑 Delete
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
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button> */}
              {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    {/* Prev Button */}
    <button
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      &laquo; Prev
    </button>

    {/* Page Numbers */}
    {getPaginationRange(currentPage, totalPages).map((p, idx) =>
      p === '...' ? (
        <span key={idx} className="px-3 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => setCurrentPage(p as number)}
          className={`px-3 py-1 rounded ${
            p === currentPage
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
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
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
