import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, Animated, TouchableOpacity, Alert
} from 'react-native';
import api from '../lib/api';
import { VolunteerActivity } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

export default function HistoryScreen() {
  const [history, setHistory] = useState<VolunteerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unjoinLoading, setUnjoinLoading] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchHistory = async () => {
    try {
      // Gunakan endpoint yang sudah benar
      const response = await api.get<VolunteerActivity[]>('/api/users/me/activities');
      setHistory(response.data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleUnjoin = (item: VolunteerActivity) => {
    Alert.alert(
      'Batalkan Partisipasi',
      `Anda yakin ingin membatalkan pendaftaran dari kegiatan:\n\n"${item.activity.title}"?`,
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            setUnjoinLoading(item.activityId);
            try {
              await api.delete(`/api/users/me/activities/${item.activityId}`);
              setHistory(prev => prev.filter(h => h.activityId !== item.activityId));
            } catch (error: any) {
              const message = error.response?.data?.message || 'Gagal membatalkan pendaftaran.';
              Alert.alert('Error', message);
            } finally {
              setUnjoinLoading(null);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: VolunteerActivity }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.card}>
        <LinearGradient colors={['#ecfdf5', '#ffffff']} style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.activity.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✅ Terdaftar</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.infoChip}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Tanggal Kegiatan</Text>
                <Text style={styles.infoValue}>
                  {new Date(item.activity.date).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoIcon}>📍</Text>
              <View>
                <Text style={styles.infoLabel}>Lokasi</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{item.activity.location}</Text>
              </View>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoIcon}>🕒</Text>
              <View>
                <Text style={styles.infoLabel}>Tanggal Daftar</Text>
                <Text style={styles.infoValue}>
                  {new Date(item.joinedAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.unjoinBtn}
            onPress={() => handleUnjoin(item)}
            disabled={unjoinLoading === item.activityId}
            activeOpacity={0.8}
          >
            {unjoinLoading === item.activityId ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Text style={styles.unjoinBtnText}>✖ Batalkan Pendaftaran</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#059669', '#10b981']} style={styles.header}>
        <Text style={styles.headerLabel}>Histori Saya</Text>
        <Text style={styles.title}>Riwayat Relawan</Text>
        <Text style={styles.subtitle}>Kegiatan sosial yang telah Anda ikuti</Text>
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{history.length}</Text>
          <Text style={styles.statLabel}>Total Kegiatan Diikuti</Text>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Memuat riwayat...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🌿</Text>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptyText}>
                Anda belum pernah mendaftar ke kegiatan relawan. Yuk mulai berkontribusi!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 13,
    color: '#d1fae5',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#a7f3d0',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '500',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 13,
    color: '#d1fae5',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#064e3b',
    flex: 1,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardInfo: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
    paddingTop: 14,
    marginBottom: 16,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    color: '#064e3b',
    fontWeight: '700',
  },
  unjoinBtn: {
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  unjoinBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
