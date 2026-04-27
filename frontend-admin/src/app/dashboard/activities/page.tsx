'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Activity } from '@/types';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  });

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await api.get<Activity[]>('/api/activities');
      setActivities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/activities/${editId}`, formData);
      } else {
        await api.post('/api/activities', formData);
      }
      setIsModalOpen(false);
      fetchActivities();
      setFormData({ title: '', description: '', location: '', date: '' });
      setEditId(null);
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan kegiatan');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      try {
        await api.delete(`/api/activities/${id}`);
        fetchActivities();
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus');
      }
    }
  };

  const openEdit = (act: Activity) => {
    setEditId(act.id);
    setFormData({
      title: act.title,
      description: act.description,
      location: act.location,
      date: new Date(act.date).toISOString().substring(0, 10),
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kegiatan Sosial</h1>
          <p className="text-slate-500 mt-1">Kelola data kegiatan dan partisipasi relawan</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ title: '', description: '', location: '', date: '' });
            setIsModalOpen(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all"
        >
          + Tambah Kegiatan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
              <th className="px-6 py-4 font-medium">Judul</th>
              <th className="px-6 py-4 font-medium">Lokasi</th>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Relawan</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">Memuat data...</td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">Belum ada kegiatan.</td>
              </tr>
            ) : (
              activities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{act.title}</td>
                  <td className="px-6 py-4">{act.location}</td>
                  <td className="px-6 py-4">{new Date(act.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {act._count?.volunteers || 0} orang
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(act)} className="text-blue-500 hover:text-blue-700 font-medium text-sm">Edit</button>
                    <button onClick={() => handleDelete(act.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{editId ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                  <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                  <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
