'use client';

import { useEffect, useState } from 'react';
// import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {

  //   const logOut = () => {

  //     localStorage.removeItem('accessToken');
  //     window.location.href = '/login';
  //   }


  return (
    <div className="ml-110">
      <Sidebar />
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl italic underline text-red-500 m-10 font-medium'>Pepagora</h1>
        <h2 className='text-2xl text-red-400 '>Product Meta Details</h2>
        <div className='w-1/3 h-1/3 m-10 border bg-amber-50'>
          <h1 className='text-center text-2xl font-semibold underline p-5'>Categories</h1>
        </div>
        <div className='w-1/3 h-1/3 m-10 border bg-amber-50'>
          <h1 className='text-center text-2xl font-semibold underline p-5'>Sub Categories</h1>
        </div>
        <div className='w-1/3 h-1/3 m-10 border bg-amber-50'>
          <h1 className='text-center text-2xl font-semibold underline p-5'>Product</h1>
        </div>
      </div>
    </div>
  );
}
