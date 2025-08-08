'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeyword, setMetaKeyword] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  // Note: metaKeywords is not used in the form, but can be added if needed
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      console.log('token:', token);

      await axios.post(
        'http://localhost:4000/categories',
        { name, metaTitle, metaKeyword, metaDescription, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Add JWT token here
            'Content-Type': 'application/json',
          },
          withCredentials: true, // For cookie (refreshToken)
        }
      );

      router.push('/categories');
    } catch (err) {
      console.error('Failed to create category', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
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
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
}




// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import axiosInstance, { setAccessToken } from '../../utils/axiosInstance';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await axiosInstance.post(
//         'http://localhost:4000/auth/login',
//         { email, password },
//         { withCredentials: true }
//       );

//       const { accessToken } = res.data.data;

//       console.log('Login successful:', accessToken);

//       // ✅ Save token in localStorage
//       localStorage.setItem('accessToken', accessToken);

//       // ✅ Set token for Axios instance
//       setAccessToken(accessToken);

//       // ✅ Redirect after login
//       router.push('/dashboard');
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="bg-gray-50 dark:bg-gray-900">
//       <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//         <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//           <img className="w-8 h-8 mr-2" src="/pepagora_logo.jpeg" alt="logo" />
//           Pepagora
//         </a>
//         <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//           <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//             <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
//               Sign in to your account
//             </h1>
//             <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               <div>
//                 <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="Enter your email"
//                   className="w-full p-2 border rounded"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   placeholder="••••••••"
//                   className="w-full p-2 border rounded"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
//                   loading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>
//               <p className="text-sm text-gray-500">
//                 Don’t have an account yet?{' '}
//                 <Link href="/signup" className="text-blue-600 hover:underline">
//                   Signup
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
