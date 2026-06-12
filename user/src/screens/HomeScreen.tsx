import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Animated, Image, TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api, { API_URL } from '../lib/api';
import { Activity } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { BlurView } from 'expo-blur';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.location && activity.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
    }, [])
  );

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
          {item.imageUrl && (
            <Image source={{ uri: `${API_URL}${item.imageUrl}` }} style={styles.cardImage} />
          )}
          <View style={[styles.cardHeader, item.imageUrl && { marginTop: 16 }]}>
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
      <LinearGradient colors={['#064e3b', '#047857']} style={styles.header}>
        {/* Background Decorative Blur Element */}
        <View style={styles.decorativeCircle} />
        
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingSmall}>Selamat Datang,</Text>
            <Text style={styles.greeting}>{user?.name?.split(' ')[0]} <Ionicons name="sparkles" size={20} color="#FBBF24" /></Text>
            <Text style={styles.subtitle}>Mari buat perubahan hari ini</Text>
          </View>
          <View style={styles.headerRight}>
            <BlurView intensity={30} tint="light" style={styles.notificationBtnWrapper}>
              <TouchableOpacity 
                style={styles.notificationBtn} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Notification')}
              >
                <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </BlurView>
            <TouchableOpacity 
              style={styles.avatarMini}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profil')}
            >
              <LinearGradient colors={['#FBBF24', '#F59E0B']} style={styles.avatarGradient}>
                <Text style={styles.avatarMiniText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        </View>
      </LinearGradient>

      {/* Overlapping Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kegiatan atau lokasi..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>

      {/* Aesthetic Grid Stats */}
      <View style={styles.gridStatsContainer}>
        <View style={styles.gridStatCard}>
          <View style={[styles.gridIconBox, { backgroundColor: '#ecfdf5' }]}>
            <Ionicons name="calendar" size={20} color="#059669" />
          </View>
          <View>
            <Text style={styles.gridStatNum}>{activities.length}</Text>
            <Text style={styles.gridStatLabel}>Kegiatan</Text>
          </View>
        </View>
        
        <View style={styles.gridStatCard}>
          <View style={[styles.gridIconBox, { backgroundColor: '#fff7ed' }]}>
            <Ionicons name="people" size={20} color="#ea580c" />
          </View>
          <View>
            <Text style={styles.gridStatNum}>
              {activities.reduce((sum, a) => sum + (a._count?.volunteers || 0), 0)}
            </Text>
            <Text style={styles.gridStatLabel}>Relawan</Text>
          </View>
        </View>
      </View>



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
              <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
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
          data={filteredActivities}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 45, // Extra padding for overlapping search bar
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greetingSmall: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: '#a7f3d0',
    marginBottom: 4,
  },
  greeting: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 26,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: '#d1fae5',
    marginTop: 4,
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtnWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  notificationBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#064e3b',
  },
  avatarMini: {
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarGradient: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
    color: '#78350f',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginTop: -28, // Overlapping the header
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gridStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 8,
  },
  gridStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gridStatNum: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    color: '#0f172a',
  },
  gridStatLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontFamily: 'PlusJakartaSans_500Medium',
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    padding: 0,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
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
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#ffffff',
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
    fontFamily: 'PlusJakartaSans_500Medium',
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
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardGradient: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 0,
    backgroundColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#ffffff',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  volunteerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  volunteerText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#059669',
    fontSize: 11,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 28,
  },
  cardDesc: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
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
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#64748b',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#64748b',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
