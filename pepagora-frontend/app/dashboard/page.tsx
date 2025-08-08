'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {

  const logOut = () => {

    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }
 

  return (
    <div className="ml-110">
      <Sidebar />
      Dashboard Under Construction
      <button
        onClick={logOut}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"  
      >
        Log Out
      </button>
    </div>
  );
}
