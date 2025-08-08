'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  const [name, setName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      api.get(`/categories/${categoryId}`).then((res) => {
        const data = res.data.data;
        setName(data.name);
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setExistingImage(data.imageUrl || '');
      });
    }
  }, [categoryId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      if (banner) formData.append('banner', banner);

      await api.put(`/categories/${categoryId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/categories');
    } catch (err) {
      console.error('Failed to update category', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
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
        <textarea
          placeholder="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />

        {existingImage && (
          <div>
            <p className="mb-2">Current Image:</p>
            <img src={existingImage} alt="Banner" className="w-32 h-32 object-cover rounded" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBanner(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Updating...' : 'Update Category'}
        </button>
      </form>
    </div>
  );
}
