'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/hooks/useAuth';
import { logoutUser } from '@/lib/api'; // adjust path
import { getUserId, clearAuthData } from '@/lib/auth'; // Your localStorage utils (if used)
import { useState } from 'react';

export default function Sidebar() {
  const { userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const userId = getUserId(); // Function that retrieves userId from localStorage/token

      await logoutUser(userId ?? "");
      clearAuthData(); // Clears localStorage, tokens, etc.
      router.push('/login');
    } catch (error: any) {
      alert(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <img src="/pepagora_logo.jpeg" alt="Pepagora Logo" className="w-8 h-8" />
          <span>Pepagora</span>
        </Link>
      </div>
      <nav className="p-4 space-y-2">
        <Link href="/dashboard" className="block hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link href="/categories" className="block hover:bg-gray-700 p-2 rounded">Categories</Link>
        <Link href="/subcategories" className="block hover:bg-gray-700 p-2 rounded">Subcategories</Link>
        <Link href="/products" className="block hover:bg-gray-700 p-2 rounded">Products</Link>
        {/* ✅ Only visible for admin */}
        {userRole === 'admin' && (  
            <>
          <Link href="/AdminAccess" className="block hover:bg-gray-700 p-2 rounded">
            Add User
          </Link>  
          <Link href="/viewUser" className="block hover:bg-gray-700 p-2 rounded">
            View Users
          </Link>
        </>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          disabled={loading}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>

      </nav>
    </aside>
  );
}
