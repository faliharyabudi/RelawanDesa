'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Activity, User } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({ activities: 0, users: 0, volunteers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [activities, users] = await Promise.all([
          api.get<Activity[]>('/api/activities'),
          api.get<User[]>('/api/users'),
        ]);

        const totalVolunteers = activities.reduce(
          (sum, act) => sum + (act._count?.volunteers || 0),
          0
        );

        setStats({
          activities: activities.length,
          users: users.length,
          volunteers: totalVolunteers,
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-200 rounded col-span-2"></div><div className="h-2 bg-slate-200 rounded col-span-1"></div></div><div className="h-2 bg-slate-200 rounded"></div></div></div></div>;
  }

  const statCards = [
    { title: 'Total Kegiatan', value: stats.activities, icon: '📋', color: 'bg-emerald-500' },
    { title: 'Total Relawan Berpartisipasi', value: stats.volunteers, icon: '👥', color: 'bg-teal-500' },
    { title: 'Total Pengguna', value: stats.users, icon: '⚙️', color: 'bg-cyan-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Ringkasan aktivitas di RelawanDesa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg ${stat.color} shadow-${stat.color.split('-')[1]}-500/30`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
