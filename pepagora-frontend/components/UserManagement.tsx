'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axiosInstance';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

type UserRole = 'admin' | 'category_manager' | 'pepagora_manager';

interface User {
  _id: string;
  email: string;
  username: string;
  role: UserRole;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/auth/users');
      setUsers(res.data?.data || res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/auth/users/${id}`);
      toast.success('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user', error);
      toast.error('Failed to delete user');
    }
  };

  const updateUser = async (id: string, updatedData: Pick<User, 'email' | 'username' | 'role'>) => {
    try {
      const payload = {
        email: updatedData.email,
        username: updatedData.username,
        role: updatedData.role,
      };
      await axios.put(`/auth/users/${id}`, payload);
      toast.success('User edited successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">All Users</h2>

      {/* Search Input */}
      <div className="flex justify-end mb-4 mr-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username..."
          className="border p-2 rounded w-64"
        />
      </div>

      <table className="min-w-full table-auto border-collapse m-10">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">S No</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditUser(user)}
                  >
                    <TbEdit /> Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => deleteUser(user._id)}
                  >
                    <RiDeleteBin6Line /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="p-6 rounded shadow-md bg-amber-50 relative border w-1/3">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateUser(editUser._id, editUser);
                setEditUser(null);
              }}
            >
              <div className="flex flex-col items-start">
                <h3 className="font-bold mb-2 text-center w-full">Edit User</h3>
                <h4 className="py-2 font-semibold">Username</h4>
                <input
                  type="text"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  className="border p-2 mr-2 mb-2 w-full"
                  placeholder="Username"
                />
                <h4 className="py-2 font-semibold">Email</h4>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="border p-2 mr-2"
                />
                <h4 className="py-2 font-semibold">Role</h4>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                  className="border p-2 mr-2"
                >
                  <option value="admin">Admin</option>
                  <option value="category_manager">Category Manager</option>
                  <option value="pepagora_manager">Pepagora Manager</option>
                </select>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-1 rounded my-5"
                >
                  Update
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-4 text-black hover:cursor-pointer w-5 h-5"
              onClick={() => setEditUser(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
