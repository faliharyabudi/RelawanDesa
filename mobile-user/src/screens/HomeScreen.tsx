import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Animated
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Activity } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const renderItem = ({ item, index }: { item: Activity; index: number }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ActivityDetail', { activity: item })}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#ecfdf5', '#ffffff']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>👥 {item._count?.volunteers || 0}</Text>
            </View>
          </View>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <View style={styles.infoRow}>
              <View style={styles.infoChip}>
                <Text style={styles.iconText}>📍</Text>
                <Text style={styles.cardInfo}>{item.location}</Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.iconText}>📅</Text>
                <Text style={styles.cardInfo}>
                  {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.arrowBtn}>
              <Text style={styles.arrowText}>→</Text>
            </LinearGradient>
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
            <Text style={styles.greeting}>{user?.name?.split(' ')[0]} 👋</Text>
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
        <Text style={styles.sectionTitle}>Kegiatan Tersedia</Text>
        <Text style={styles.sectionSubtitle}>Pilih dan daftarkan diri Anda</Text>
      </View>

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
              <Text style={styles.emptyEmoji}>🌾</Text>
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
    paddingBottom: 24,
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
    width: 52,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarMiniText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
  },
  statRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#d1fae5',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064e3b',
    lineHeight: 24,
  },
  badge: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 16,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
    paddingTop: 14,
  },
  infoRow: {
    flex: 1,
    gap: 6,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconText: {
    fontSize: 13,
  },
  cardInfo: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
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
