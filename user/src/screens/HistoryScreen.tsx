import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, Animated, TouchableOpacity, Alert
} from 'react-native';
import api from '../lib/api';
import { VolunteerActivity } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [history, setHistory] = useState<VolunteerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchHistory = async () => {
    try {
      const response = await api.get<VolunteerActivity[]>('/api/users/me/activities');
      setHistory(response.data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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

  const handleUnjoin = (activityId: string, activityTitle: string) => {
    Alert.alert(
      'Batalkan Pendaftaran',
      `Anda yakin ingin batal mendaftar dari "${activityTitle}"?`,
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/users/me/activities/${activityId}`);
              Alert.alert('Berhasil', 'Pendaftaran berhasil dibatalkan.');
              fetchHistory(); // Refresh data
            } catch (error: any) {
              const msg = error.response?.data?.message || 'Gagal membatalkan.';
              Alert.alert('Error', msg);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: VolunteerActivity }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#059669" style={{marginRight: 4}} />
            <Text style={styles.statusText}>Terdaftar</Text>
          </View>
          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={() => handleUnjoin(item.activity.id, item.activity.title)}
          >
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.cardTitle}>{item.activity.title}</Text>
        
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={16} color="#059669" />
            </View>
            <Text style={styles.detailText}>
              {new Date(item.activity.date).toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={16} color="#059669" />
            </View>
            <Text style={styles.detailText}>{item.activity.location}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#064e3b', '#047857']} style={styles.header}>
        {/* Decorative Circle */}
        <View style={styles.decorativeCircle} />
        
        <Text style={styles.headerTitle}>Riwayat Kegiatan</Text>
        <Text style={styles.headerSubtitle}>Jejak kebaikan yang telah Anda lakukan</Text>
        
        <View style={styles.statChipWrapper}>
          <View style={styles.statChip}>
            <Ionicons name="trophy" size={18} color="#FBBF24" style={{marginRight: 8}} />
            <Text style={styles.statChipText}>{history.length} Kegiatan Diikuti</Text>
          </View>
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
              <View style={styles.emptyIconCircle}>
                <Ionicons name="document-text-outline" size={40} color="#94a3b8" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptyText}>Anda belum terdaftar dalam kegiatan apapun. Yuk mulai berkontribusi!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: { fontSize: 26, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#ffffff', marginBottom: 6 },
  headerSubtitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: '#a7f3d0', marginBottom: 24 },
  statChipWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statChipText: { color: '#ffffff', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14 },
  list: { padding: 20, paddingTop: 24, paddingBottom: 100 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: { color: '#059669', fontSize: 12, fontWeight: '700' },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 24,
  },
  cardDetails: { gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: { fontSize: 14, color: '#475569', flex: 1, fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748b' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22 },
});
