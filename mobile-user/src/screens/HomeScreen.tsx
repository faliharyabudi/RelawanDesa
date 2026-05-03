import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Animated
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Activity } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchActivities = async () => {
    try {
      const response = await api.get<Activity[]>('/api/activities');
      setActivities(response.data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Failed to fetch activities', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const renderItem = ({ item }: { item: Activity }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ActivityDetail', { activity: item })}
      >
        <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Aksi Sosial</Text>
            </View>
            <View style={styles.volunteerBadge}>
              <Ionicons name="people" size={14} color="#059669" />
              <Text style={styles.volunteerText}>
                {item._count?.volunteers || 0} Terdaftar
              </Text>
            </View>
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Ionicons name="calendar-outline" size={14} color="#64748b" />
              <Text style={styles.footerText}>
                {new Date(item.date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Ionicons name="location-outline" size={14} color="#64748b" />
              <Text style={styles.footerText} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#059669', '#10b981']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingSmall}>Halo,</Text>
            <Text style={styles.greeting}>{user?.name?.split(' ')[0]} <Ionicons name="hand-left" size={24} color="#fcd34d" /></Text>
            <Text style={styles.subtitle}>Mari buat perubahan hari ini!</Text>
          </View>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Stat Banner */}
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{activities.length}</Text>
            <Text style={styles.statLabel}>Kegiatan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {activities.reduce((sum, a) => sum + (a._count?.volunteers || 0), 0)}
            </Text>
            <Text style={styles.statLabel}>Relawan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{user?.role === 'ADMIN' ? 'Admin' : 'User'}</Text>
            <Text style={styles.statLabel}>Peran Anda</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Kegiatan Tersedia</Text>
          <Text style={styles.sectionSubtitle}>Pilih dan daftarkan diri Anda</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddActivity')}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#10b981', '#059669']} style={styles.addBtn}>
              <Ionicons name="add" size={16} color="#ffffff" style={{marginRight: 4}} />
              <Text style={styles.addBtnText}>Tambah</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Banner Admin */}
      {isAdmin && (
        <View style={styles.adminBanner}>
          <Ionicons name="shield-checkmark" size={20} color="#92400e" style={styles.adminBannerIcon} />
          <Text style={styles.adminBannerText}>Mode Admin aktif — Anda bisa menambah dan mengelola kegiatan.</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Memuat kegiatan...</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={56} color="#94a3b8" style={{ marginBottom: 16 }} />
              <Text style={styles.emptyTitle}>Belum Ada Kegiatan</Text>
              <Text style={styles.emptyText}>Belum ada kegiatan sosial yang tersedia saat ini. Coba lagi nanti.</Text>
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
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingSmall: {
    fontSize: 14,
    color: '#d1fae5',
    fontWeight: '500',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#a7f3d0',
    marginTop: 4,
    fontWeight: '500',
  },
  avatarMini: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarMiniText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  statRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 16,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#d1fae5',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  adminBannerIcon: {
    marginRight: 10,
  },
  adminBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 20,
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
  },
  cardGradient: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  volunteerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  volunteerText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 24,
  },
  cardDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
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
