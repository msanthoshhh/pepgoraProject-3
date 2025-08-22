'use client';

import { useEffect, useState } from 'react';
// import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { boolean } from 'zod';
import axiosInstance from '../../lib/axiosInstance';

type Category = {
  _id: string;
  main_cat_name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
  metaChildren?:string[];
};
type Subategory = {
  _id: string;
  sub_cat_name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  sub_cat_img_url?: string;
  mappedParent:string;
  metaChildren?:string[];
};
type Product = {
  _id: string;
  name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
  mappedParent:string;
};

type Dprops = {
  name : string;
}

export default function Dashboard() {

  const [Loading,setLoading]=useState<boolean>(false)
  const [categories,setCategories]=useState<Category[]>([])
  const [subcategories,setSubcategories]=useState<Subategory[]>([])
  const [products,setProducts]=useState<Product[]>([])

  //   const logOut = () => {

  //     localStorage.removeItem('accessToken');
  //     window.location.href = '/login';
  //   }
  const name = localStorage.getItem('userName');

useEffect(()=>{
},[name])

const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/categories', {
       
      });  
      const data1 = Array.isArray(res.data.data.data) ? res.data.data.data : [];  
      // console.log(data1)
      setCategories(data1);
    } catch (err) {
      // console.error('Error fetching categories:', err);
      setCategories([]);
    
    } finally {
      setLoading(false);
    }
    try {
      const res = await axiosInstance.get('/subcategories', {
       
      });  
      const data2 = Array.isArray(res.data.data.data) ? res.data.data.data : [];  
      // console.log(data2)
      setSubcategories(data2);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setSubcategories([]);
    
    } finally {
      setLoading(false);
    }
    try {
      const res = await axiosInstance.get('/products', {
       
      });  
      const data3 = Array.isArray(res.data.data.data) ? res.data.data.data : [];  
      // console.log(data3)
      setProducts(data3);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setProducts([]);
    
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetch()
  },[])
  const categoriesCount = categories.length;
  const subCategoriesCount = subcategories.length;
  const productsCount = products.length;
  return (
    <>
      <Sidebar />
      <div className='bg-[url(/Dashboard_Bg1.png)] min-h-screen bg-cover'>
      <div className='flex flex-col items-center justify-center relative ml-40 min-h-screen'>
        <img src="/pepagora-logo-red.png" alt="Pepagora Logo" className='absolute top-0 right-72'/>
        <div className='w-1/3 h-1/3 m-10 rounded-tl-2xl rounded-br-2xl backdrop-blur-lg'>
          <h1 className='text-center text-2xl font-semibold underline px-5 pt-5 text-white'>Available Categories</h1>
          <p className='text-2xl text-center p-4 text-white'>{categoriesCount}</p>
        </div>
        <div className='flex w-full justify-center items-center'>
        <div className='w-1/3 h-1/3 m-10 rounded-tl-2xl rounded-br-2xl backdrop-blur-lg'>
          <h1 className='text-center text-2xl font-semibold underline px-5 pt-5 text-white'>Available Sub Categories</h1>
          <p className='text-2xl text-center p-4 text-white'>{subCategoriesCount}</p>
        </div>
        <div className='w-1/3 h-1/3 m-10 rounded-tl-2xl rounded-br-2xl backdrop-blur-lg'>
          <h1 className='text-center text-2xl font-semibold underline px-5 pt-5 text-white'>Available Products</h1>
          <p className='text-2xl text-center p-4 text-white'>{productsCount}</p>
        </div>
        </div>
      </div>
      <p className='absolute right-5 top-4 text-2xl text-white font-semibold rounded-2xl p-2 bg-red-500 animate-bounce'>Welcome {name}!</p>
    </div>
  </>
  );
}
