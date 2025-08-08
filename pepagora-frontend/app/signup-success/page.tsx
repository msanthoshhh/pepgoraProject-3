'use client';
import Link from 'next/link';

export default function SignupSuccessPage() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Account Created Successfully! 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your account has been created successfully. Please log in to continue.
        </p>
        <Link
          href="/login"
          className="inline-block w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Go to Login
        </Link>
      </div>
    </section>
  );
}
