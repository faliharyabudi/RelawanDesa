'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Activity, VolunteerActivity } from '@/types';

export default function VolunteersPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [volunteers, setVolunteers] = useState<VolunteerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await api.get<Activity[]>('/api/activities');
        setActivities(data);
        if (data.length > 0) {
          setSelectedActivity(data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    if (!selectedActivity) return;
    const fetchVolunteers = async () => {
      setLoadingVolunteers(true);
      try {
        const data = await api.get<VolunteerActivity[]>(`/api/activities/${selectedActivity}/volunteers`);
        setVolunteers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingVolunteers(false);
      }
    };
    fetchVolunteers();
  }, [selectedActivity]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Monitoring Relawan</h1>
        <p className="text-slate-500 mt-1">Pantau partisipasi relawan di setiap kegiatan sosial</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Kegiatan:</label>
        {loading ? (
          <div className="h-10 bg-slate-100 animate-pulse rounded-xl w-full max-w-md"></div>
        ) : (
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            {activities.map(act => (
              <option key={act.id} value={act.id}>{act.title} — {new Date(act.date).toLocaleDateString('id-ID')}</option>
            ))}
            {activities.length === 0 && <option value="">Tidak ada kegiatan</option>}
          </select>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Daftar Relawan Terdaftar</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 text-sm border-b border-slate-100">
              <th className="px-6 py-4 font-medium">Nama</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Tanggal Mendaftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loadingVolunteers ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-400">Memuat relawan...</td>
              </tr>
            ) : volunteers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-slate-400">Belum ada relawan untuk kegiatan ini.</td>
              </tr>
            ) : (
              volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{vol.user.name}</td>
                  <td className="px-6 py-4">{vol.user.email}</td>
                  <td className="px-6 py-4">{new Date(vol.joinedAt).toLocaleString('id-ID')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
