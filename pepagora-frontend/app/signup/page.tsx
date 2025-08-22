// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { signupSchema, SignupDtoType } from '@/lib/zodSchemas';
// // import api from '@/lib/api';
// import { saveToken } from '@/lib/auth';
// import axiosInstance from '@/lib/axiosInstance';
// import { toast } from 'react-toastify';

// export default function SignupPage() {
//   const [formData, setFormData] = useState<SignupDtoType>({
//     email: '',
//     username: '',
//     password: '',
//     role: 'pepagora_manager', // Default role
//   });
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState<Partial<Record<keyof SignupDtoType, string>>>({});
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const router = useRouter();

//   // ✅ Handle input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setConfirmPassword(e.target.value);
//     setConfirmPasswordError('');
//   };

//   // ✅ Handle form submit
//   const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Validate with Zod
//     const validation = signupSchema.safeParse(formData);

//     if (!validation.success) {
//       const newErrors: Partial<Record<keyof SignupDtoType, string>> = {};
//       validation.error.issues.forEach((issue: any) => {
//         const field = issue.path[0] as keyof SignupDtoType;
//         newErrors[field] = issue.message;
//       });
//       setErrors(newErrors);
//       return;
//     }

//     // Check confirm password
//     if (formData.password !== confirmPassword) {
//       setConfirmPasswordError('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axiosInstance.post('/auth/signup', formData);
//       saveToken(res.data.access_token, res.data.user.id, res.data.user.role);
//       if (res.status == 200) {
//         toast.success('Signup successful!');
//       }
//       router.push('/dashboard');
//     } catch (error: any) {
//       console.error(error.response?.data || error.message);
//       // alert('Signup failed. Please try again.');
//       toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className=" max-h-screen flex items-center justify-center">
//       <div className="w-full max-w-md bg-white rounded-lg shadow mt-10">
//         <div className="p-6 space-y-4 md:space-y-6">
//           <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
//             Add User
//           </h1>
//           <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>
//             {/* Email */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//               />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 placeholder="Enter your username"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//               />
//               {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
//             </div>

//             {/* Password */}
//             {/* <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//               />
//               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//             </div>

//             {/* Confirm Password */}
//             {/* <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={handleConfirmPasswordChange}
//                 placeholder="••••••••"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//               />
//               {confirmPasswordError && (
//                 <p className="text-red-500 text-sm">{confirmPasswordError}</p>
//               )}
//             </div> */}

//             {/* Password */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
//                   onMouseDown={() => setShowPassword(true)}
//                   onMouseUp={() => setShowPassword(false)}
//                   onMouseLeave={() => setShowPassword(false)}
//                 >
//                   {showPassword ? '👁️' : '🙈'}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={confirmPassword}
//                   onChange={handleConfirmPasswordChange}
//                   placeholder="••••••••"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
//                   onMouseDown={() => setShowConfirmPassword(true)}
//                   onMouseUp={() => setShowConfirmPassword(false)}
//                   onMouseLeave={() => setShowConfirmPassword(false)}
//                 >
//                   {showConfirmPassword ? '👁️' : '🙈'}
//                 </button>
//               </div>
//               {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
//             </div>


//             {/* Role Dropdown */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-900">
//                 Role
//               </label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//               >
//                 <option value="admin">Admin</option>
//                 <option value="category_manager">Category Manager</option>
//                 <option value="pepagora_manager">Pepagora Manager</option>
//               </select>
//               {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//             >
//               {loading ? 'Adding user...' : 'Add new User'}
//             </button>


//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupSchema, SignupDtoType } from '@/lib/zodSchemas';
import { saveToken } from '@/lib/auth';
import axiosInstance from '@/lib/axiosInstance'; 
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupDtoType>({
    email: '',
    username: '',
    password: '',
    role: 'pepagora_manager',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof SignupDtoType, string>>>({});
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      const newErrors: Partial<Record<keyof SignupDtoType, string>> = {};
      validation.error.issues.forEach((issue: any) => {
        const field = issue.path[0] as keyof SignupDtoType;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    if (formData.password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      console.log(formData)
      const res = await axiosInstance.post('/auth/signup', formData);
      // saveToken(res.data.access_token, res.data.user.id, res.data.user.role);
      console.log(res)
      if (res.status === 200) {
        toast.success('Signup successful!');
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow mt-10">
        <div className="p-6 space-y-4 md:space-y-6">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Add User</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
              />
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                className="absolute right-2 top-[38px] text-gray-500"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
              />
              <button
                type="button"
                onMouseDown={() => setShowConfirmPassword(true)}
                onMouseUp={() => setShowConfirmPassword(false)}
                onMouseLeave={() => setShowConfirmPassword(false)}
                className="absolute right-2 top-[38px] text-gray-500"
              >
                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              {confirmPasswordError && (
                <p className="text-red-500 text-sm">{confirmPasswordError}</p>
              )}
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              >
                <option value="admin">Admin</option>
                <option value="category_manager">Category Manager</option>
                <option value="pepagora_manager">Pepagora Manager</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {loading ? 'Adding user...' : 'Add new User'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

