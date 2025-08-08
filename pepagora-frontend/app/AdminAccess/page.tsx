'use client';

import { useAuth } from '@/components/hooks/useAuth'; // Or wherever you put it
import SignupPage from '../signup/page'; // or extract to a `components/UserForm.tsx`
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AdminAccess() {
  const { userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole !== 'admin') {
      router.push('/unauthorized'); // Or login
    }
  }, [userRole, loading, router]);

  if (loading) return <p className="text-center mt-10">Checking access...</p>;
  if (userRole !== 'admin') return null; // Prevent flicker

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Sidebar/>
      <h1 className="ml-90text-2xl font-bold mb-4">Admin - Create New User</h1>
      <SignupPage />
    </div>
  );
}
