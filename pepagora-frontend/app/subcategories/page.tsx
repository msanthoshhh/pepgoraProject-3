'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import { getPaginationRange } from '@/components/GetPage';
import axiosInstance from '../../lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { MdImageNotSupported } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuSave } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { set } from 'zod';

type Category = {
  _id: string;
  main_cat_name: string;
  // categoryId: string;
}

type subCategory = {
  _id: string;
  sub_cat_name: string;
  mappedParent: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  sub_cat_img_url?: string;
  mappedChildren?:string[];
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

// const products = ["abc","def","hij","klm","nop","qrs","tuv","wxyz"]
type Product = {
  _id: string;
  name: string;
}

let p:any[] = []

export default function subcategoriesPage() {
  const [subCategories, setSubCategories] = useState<subCategory[]>([]);
  const [products,setProducts]=useState<Product[]>([])
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [SubCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productView, setProductView] = useState<boolean>();
  const [subCategoryId, setSubcategoryId] = useState<string | null>('');
  const [prodLoading, setProdLoading] = useState<boolean>(false);
  

  // const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeyword, setMetaKeyword] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [SubaddCategory, setSubaddCategory] = useState(false);
  const [viewReadMore, setViewReadMore] = useState(false);
  const [goToPage, setGoToPage] = useState('');
  const [goToPageInput, setGoToPageInput] = useState('');




  const [editForm, setEditForm] = useState({
    name: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    category: ''

  });

  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Fixed limit (you can make this dynamic)

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        const decoded: TokenPayload = jwtDecode(storedToken);
        setToken(storedToken);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, []);

  const fetchProducts =async (id:string[])=>{
    p=[]
    try{ 
      for(let i=0;i<id.length;i++){
        const res = await axiosInstance.get(`/products/${id[i]}`) 
        p.push(res?res.data.data.name:'');
      }
      console.log(p);
      if(p.length>0){
        setProductView(true);
        setProdLoading(false);
      }else{
        setProductView(false);
      }
    } 
    catch(e){
      toast.error("Products unavailable");
      setProdLoading(false);
    }
  }

  // useEffect(()=>{
  //   fetchProducts("689a28e3b68f8dc743c9a4a9")

  // },[])

  // ✅ Get token from localStorage
  useEffect(() => {
    fetchSubcategories(page);
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/categories');
      console.log('Fetched catefghgfgories:', res.data.data.data);
      const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setCategories(data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/subcategories', {
        params: { page: currentPage, limit },
      });

      console.log('Fetched subcategories:', res.data.data.data);
      const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setSubCategories(data);
      setTotalPages(res.data.data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setSubCategories([]);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id: string) => {
    // if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await axiosInstance.delete(`/subcategories/${id}`);

      if (res.status === 200) {
        toast.success("Subcategory deleted successfully!");
      }

      // If last item on page was deleted, move to previous page if possible
      if (categories.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchSubcategories(page);
      }
    } catch (err) {
      toast.error(`Failed to delete subcategory ${id}`);
      console.error('Delete failed:', err);
    }
  };

  // ✅ Cancel Edit
  const cancelEdit = () => {
    setEditingSubcategory(null);
    setEditForm({
      name: '',
      metaTitle: '',
      metaDescription: '',
      metaKeyword: '',
      category: ''
    });
  };

  // ✅ Save Edit
  const saveEdit = async (id: string) => {
    try {

      const res = await axiosInstance.put(
        `/subcategories/${id}`,
        {
          sub_cat_name: editForm.name,
          metaTitle: editForm.metaTitle,
          metaDescription: editForm.metaDescription,
          metaKeyword: editForm.metaKeyword,
        }
      );

      if (res.status === 200) {
        toast.success(`subcategory ${editForm.name} updated successfully!`);
        cancelEdit();
        fetchSubcategories(page);
      }
      else {
        toast.error(`Failed to update subcategory ${editForm.name}`);
      }
    } catch (err) {
      toast.error(`Failed to update subcategory ${editForm.name}`);
      console.error('Update failed:', err);
    }
  };

  const stringLength = (str: string) => {
    return (60 <= str.length);
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // const token = localStorage.getItem('accessToken');

      const payload = { sub_cat_name: name, mappedParent: category, metaTitle, metaDescription, metaKeyword, sub_cat_img_url:imageUrl };

      console.log(payload);

      const res = await axiosInstance.post(
        '/subcategories',
        payload,

      );
      res.status == 201 ?
        toast.success("subcategory created successfully!")
        : toast.error("Failed to create subcategory");

      setSubaddCategory(false);
      fetchSubcategories(page);
    } catch (err) {
      console.error('Failed to create subcategory', err);
      toast.error('Failed to create subcategory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-60 flex min-h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-6 w-full relative">
          <h1 className="text-3xl font-bold text-gray-800">Sub Categories</h1>
          {userRole !== 'pepagora_manager' && (
            <>
              <button
                onClick={() => setSubaddCategory(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition absolute right-4"
              >
                Add Subategory
              </button>
              {SubaddCategory && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>


                  <div className="p-6 max-w-3xl mx-auto bg-amber-50 border-2 relative" >
                    <h1 className="text-2xl font-bold mb-6 text-center">Add subcategory</h1>
                    <button className='absolute top-2 right-4 text-xl hover:cursor-pointer' onClick={() => setSubaddCategory(false)}>x</button>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="subcategory Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      />
                      <div>
                        <label className="block font-medium">Main Category</label>
                        <select
                          value={category || ' '}
                          onChange={(e) => setCategory(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                          required
                        >
                          <option value="">-- Select Category --</option>
                          {categories.map((subcat) => (
                            <option key={subcat._id} value={subcat._id}>
                              {subcat.main_cat_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Meta Title"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Meta Keywords"
                        value={metaKeyword}
                        onChange={(e) => setMetaKeyword(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        placeholder="Meta Description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                      <input
                        type="text"
                        placeholder="Image URL (e.g. https://example.com/image.jpg)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          // disabled={loading}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        
                        >
                          Add subcategory
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

              )}
            </>
          )}

        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading subcategories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow p-10">
            <p className="text-gray-600 text-lg">No subcategories found.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                    <th className='p-3 text-left'>S No</th>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">categories</th>
                    <th className="p-3 text-left">subcategories</th>
                    <th className="p-3 text-left">Meta Title</th>
                    <th className="p-3 text-left">Meta Keywords</th>
                    <th className="p-3 text-left">Meta Description</th>
                    {userRole !== 'pepagora_manager' && (
                      <th className="p-3 text-center">Actions</th>)}
                      {/* <th>ProdCat</th> */}
                  </tr>
                </thead>
                <tbody>
                  {subCategories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                        <td className="p-3 overflow-x-hidden max-w-72 text-left">{index+1}</td>
                      {/* Image */}
                      <td className="p-3">
                        {((cat.sub_cat_img_url != "null") && (cat.sub_cat_img_url != undefined)) ? (
                          <a
                            href={cat.sub_cat_img_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={cat.sub_cat_img_url}
                              alt={cat.sub_cat_name}
                              className="w-14 h-14 object-cover rounded-lg shadow-sm hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          <MdImageNotSupported className="text-gray-400 w-14 h-14" />
                        )}
                      </td>
                      {/* <td>{cat}</td> */}

                      <td className="p-3 overflow-x-hidden max-w-72">{categories.map((s) => (
                        (s._id === cat.mappedParent) ? s.main_cat_name : ""
                      ))}</td>
                      {editingSubcategory === cat._id ? (
                        <>
                          <>
                            <td className="p-3 overflow-x-hidden max-w-72 text-left">{cat.metaTitle || '-'}</td>
                            <td className="p-3 overflow-x-hidden max-w-72 text-left">{cat.metaKeyword || '-'}</td>
                            <td className="p-3 overflow-x-hidden max-w-72 text-left">{cat.sub_cat_name}</td>
                            <td className="p-3 w-72 text-left h-20">{cat.metaDescription || '-'}</td>
                            {userRole !== 'pepagora_manager' && (
                              <td className="p-3 text-center flex justify-center gap-2">
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      setEditingSubcategory(cat._id);
                                      setEditForm({
                                        name: cat.sub_cat_name,
                                        metaTitle: cat.metaTitle || '',
                                        metaKeyword: cat.metaKeyword || '',
                                        metaDescription: cat.metaDescription || '',
                                        category: (() => {
                                          const match = categories.find((s) => s._id === cat.mappedParent);
                                          return match ? match.main_cat_name : "";
                                        })()
                                      });
                                      setShowEditModal(true);
                                    }}
                                    className="bg-green-500 text-white px-3 py-2 rounded-2xl hover:cursor-pointer"
                                  >
                                    <div className='flex'>
                                      <TbEdit className='mt-1 mx-1' />Edit
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSubCategoryToDelete(cat._id);
                                      setShowDeleteModal(true);
                                    }}
                                    className='bg-red-500 rounded-2xl px-3 py-2 hover:cursor-pointer text-white'

                                  >
                                    <div className='flex'>
                                      <RiDeleteBin6Line className='mt-1 mx-1' />Delete
                                    </div>
                                  </button>
                                </div>
                              </td>
                            )}

                          </>
                          {showEditModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                              <div className="bg-amber-50 rounded-lg shadow-2xl p-6 w-full max-w-2xl relative border-2">
                                <h2 className="text-xl font-bold mb-4">Edit subcategory</h2>

                                <div className="space-y-3">
                                  <div className='flex'>
                                  <label className='font-semibold p-2 w-1/3'>Category:</label>
                                  <input type='text'
                                    value={editForm.category}
                                    className="border p-2 rounded w-full"
                                    placeholder="subcategory Name"
                                  />
                                  </div>
                                  <div className='flex'>
                                  <label className='font-semibold p-2 w-1/3'>Sub Category:</label>
                                  <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="border p-2 rounded w-full"
                                    placeholder="subcategory Name"
                                  />
                                  </div>
                                  <div className='flex'>
                                  <label className='font-semibold p-2 w-1/3'>Meta Title:</label>
                                  <input
                                    type="text"
                                    value={editForm.metaTitle}
                                    onChange={(e) => setEditForm({ ...editForm, metaTitle: e.target.value })}
                                    className="border p-2 rounded w-full"
                                    placeholder="Meta Title"
                                  />
                                  </div>
                                  <div className='flex'>
                                  <label className='font-semibold p-2 w-1/3'>Meta Keyword:</label>
                                  <input
                                    type="text"
                                    value={editForm.metaKeyword}
                                    onChange={(e) => setEditForm({ ...editForm, metaKeyword: e.target.value })}
                                    className="border p-2 rounded w-full"
                                    placeholder="Meta Keyword"
                                  />
                                  </div>
                                  <div className='flex'>
                                  <label className='font-semibold p-2 w-1/3'>Meta Description:</label>
                                  <input
                                    type="text"
                                    value={editForm.metaDescription}
                                    onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                                    className="border p-2 rounded w-full"
                                    placeholder="Meta Description"
                                  />
                                  </div>

                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                  <button
                                    onClick={() => {
                                      saveEdit(editingSubcategory!);
                                      setShowEditModal(false);
                                      setEditingSubcategory(null);
                                    }}
                                    className="bg-green-600 text-white p-2 rounded flex"
                                  >
                                    <LuSave className='text-sm mt-1' /> <p className="text-sm px-2">Save</p>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowEditModal(false);
                                      cancelEdit();
                                    }}
                                    className="bg-red-500 text-white px-4 pb-2 rounded text-lg"
                                  >
                                    x <span className="text-sm">Cancel</span>
                                  </button>
                                </div>

                                {/* Close button in corner */}
                                <button
                                  className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                                  onClick={() => {
                                    setShowEditModal(false);
                                    cancelEdit();
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                            </div>
                          )}



                        </>
                      ) : (
                        <>
                          <td className="p-3 overflow-x-hidden max-w-72 text-left">{cat.sub_cat_name}</td>
                          <td className="p-3 overflow-x-hidden max-w-72 text-left">{cat.metaTitle || '-'}</td>
                          <td className="p-3 overflow-x-hidden max-w-72 text-left">{cat.metaKeyword || '-'}</td>
                          <td className={`p-3 w-72 text-left h-20`}>
                            <div className={`${viewReadMore ? 'max-h-max' : 'overflow-y-hidden max-h-14'}`}>
                              {cat.metaDescription || '-'}
                            </div>
                            {(stringLength(cat.metaDescription || '')) && (
                              <p
                                className="text-blue-500 cursor-pointer text-xs mt-1"
                                onClick={() => setViewReadMore((prev) => !prev)}
                              >
                                Read {viewReadMore ? 'less' : 'more'}...
                              </p>
                            )}
                          </td>


                          {userRole !== 'pepagora_manager' && (
                            <td className="p-3 text-center flex justify-center gap-2 max-w-72">
                              <div className='flex flex-col'>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    setEditingSubcategory(cat._id);
                                    setEditForm({
                                      name: cat.sub_cat_name,
                                      metaTitle: cat.metaTitle || '',
                                      metaKeyword: cat.metaKeyword || '',
                                      metaDescription: cat.metaDescription || '',
                                      // imageUrl: cat.sub_cat_img_url || '',
                                      category: (() => {
                                        const match = categories.find((s) => s._id === cat.mappedParent);
                                        return match ? match.main_cat_name : "";
                                      })()
                                    });
                                    setShowEditModal(true);
                                  }}
                                  className="bg-green-600 text-white p-2 rounded-2xl hover:cursor-pointer"
                                >
                                  <div className='flex'>
                                    <TbEdit className='m-1' />
                                  </div>
                                </button>
                                <button
                                  onClick={() => {
                                    setSubCategoryToDelete(cat._id);
                                    setShowDeleteModal(true);
                                    console.log("I was clicked")
                                  }}
                                  className='bg-red-500 rounded-2xl p-2 hover:cursor-pointer text-white flex'

                                >
                                  <div className='flex'>
                                    <RiDeleteBin6Line className='m-1' />
                                  </div>
                                </button>
                              <button className={`bg-blue-800 text-white rounded-2xl p-2 flex hover:${prodLoading? 'cursor-progress':'cursor-pointer'}`} onClick={()=>{
                                setSubcategoryId(cat._id)
                                setProdLoading(true)
                                p.length==0?fetchProducts(cat.mappedChildren?cat.mappedChildren:[]) : (()=>{
                                  p=[];
                                  setProductView(false);
                                })()
                              }} 
                              >
                                <FaRegEye className='m-1'/>
                              </button>
                              </div>
                              </div>
                            </td>
                          )}
                        </>
                      )}
                      {(productView && subCategoryId === cat._id) && (
                        <div className='fixed inset-0 flex items-center justify-center'>

                        <div className='bg-amber-200 border text-black p-2 max-w-2xl max-h-80 overflow-y-scroll relative'>
                          <h1 className='text-center text-xl font-semibold underline p-2'>Product Details</h1>
                         {p.map((i)=>(
                         <li>{i}</li>
                         ))}
                         <p className='text-xl absolute top-0 right-2 hover:cursor-pointer' onClick={()=>{
                          p=[];
                          setProductView(false);
                          }}>X</p>
                        </div>
                        </div>
                      )}
                      {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center border-gray-400">
                          <div className="bg-amber-50 rounded-lg shadow-sm p-6 w-full max-w-md text-center relative border-2">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              Confirm Deletion
                            </h2>
                            <p className="text-gray-600 mb-6">
                              Do you want to delete this category?
                            </p>

                            <div className="flex justify-center gap-4">
                              <button
                                onClick={async () => {
                                  if (SubCategoryToDelete) {
                                    await handleDelete(SubCategoryToDelete);
                                    setShowDeleteModal(false);
                                    setSubCategoryToDelete(null);
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 animate-pulse text-white px-4 py-2 rounded"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setShowDeleteModal(false);
                                  setSubCategoryToDelete(null);
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                              >
                                Cancel
                              </button>
                            </div>

                            {/* Close (X) button */}
                            <button
                              onClick={() => {
                                setShowDeleteModal(false);
                                setSubCategoryToDelete(null);
                              }}
                              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

         


            <div className="flex items-center justify-between flex-wrap mt-6 gap-4">
              {/* --- Pagination Buttons --- */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      fetchCategories();
                    }
                  }}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Prev
                </button>

                {getPaginationRange(page, totalPages, 1).map((p, idx) =>
                  p === '...' ? (
                    <span key={idx} className="px-3 py-1">...</span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => {
                        setPage(Number(p));
                        fetchCategories();
                      }}
                      className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-600 text-white' : ''
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    if (page < totalPages) {
                      setPage(page + 1);
                      fetchCategories();
                    }
                  }}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              {/* --- Go To Page Input --- */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page"
                  className="w-16 px-2 py-1 text-sm border rounded text-center"
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const page = Number(goToPageInput);
                      if (page >= 1 && page <= totalPages) {
                        setPage(page);
                        fetchCategories();
                        setGoToPageInput('');
                      }
                    }
                  }}
                />
                <button
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => {
                    const page = Number(goToPageInput);
                    if (page >= 1 && page <= totalPages) {
                      setPage(page);
                      fetchSubcategories(page);
                      setGoToPageInput('');
                    }
                  }}
                >
                  Go
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}