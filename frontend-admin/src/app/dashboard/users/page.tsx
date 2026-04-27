'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<User[]>('/api/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await api.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('Gagal menghapus user');
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Manajemen User</h1>
        <p className="text-slate-500 mt-1">Daftar semua pengguna terdaftar di sistem</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="px-6 py-4 font-medium">Nama</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Peran</th>
              <th className="px-6 py-4 font-medium">Total Partisipasi</th>
              <th className="px-6 py-4 font-medium">Terdaftar Pada</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Memuat data...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada pengguna.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u._count?.volunteers || 0} kegiatan</td>
                  <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(u.id)} 
                      disabled={u.role === 'ADMIN'}
                      className={`font-medium text-sm ${u.role === 'ADMIN' ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
