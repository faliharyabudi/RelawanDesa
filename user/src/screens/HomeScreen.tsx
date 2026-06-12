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
  const [activeCategory, setActiveCategory] = useState('Semua');
  const isAdmin = user?.role === 'ADMIN';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.location && activity.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Simulating category filtering
    if (activeCategory === 'Aksi Sosial') return matchesSearch && activity.title.includes('Sosial');
    if (activeCategory === 'Lingkungan') return matchesSearch && activity.title.includes('Pohon');
    if (activeCategory === 'Pendidikan') return matchesSearch && activity.title.includes('Belajar');
    
    return matchesSearch;
  });

  const categories = ['Semua', 'Aksi Sosial', 'Lingkungan', 'Pendidikan'];

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
        style={styles.cardOverlay}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ActivityDetail', { activity: item })}
      >
        <ImageBackground
          source={item.imageUrl ? { uri: `${API_URL}${item.imageUrl}` } : require('../../assets/adaptive-icon.png')}
          style={styles.cardImageBg}
          imageStyle={{ borderRadius: 24 }}
        >
          <LinearGradient 
            colors={['transparent', 'rgba(0,0,0,0.8)']} 
            style={styles.cardGradientOverlay}
          >
            <View style={styles.cardHeaderOverlay}>
              <View style={styles.badgeOverlay}>
                <Text style={styles.badgeTextOverlay}>Aksi Sosial</Text>
              </View>
              <BlurView intensity={20} tint="dark" style={styles.volunteerBadgeOverlay}>
                <Ionicons name="people" size={14} color="#FBBF24" />
                <Text style={styles.volunteerTextOverlay}>
                  {item._count?.volunteers || 0} Terdaftar
                </Text>
              </BlurView>
            </View>

            <View style={styles.cardContentOverlay}>
              <Text style={styles.cardTitleOverlay} numberOfLines={2}>{item.title}</Text>
              
              <View style={styles.cardFooterOverlay}>
                <View style={styles.footerItemOverlay}>
                  <Ionicons name="calendar" size={14} color="#d1fae5" />
                  <Text style={styles.footerTextOverlay}>
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short'
                    })}
                  </Text>
                </View>
                <View style={styles.footerItemOverlay}>
                  <Ionicons name="location" size={14} color="#d1fae5" />
                  <Text style={styles.footerTextOverlay} numberOfLines={1}>{item.location}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
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

      {/* Horizontal Category Filters */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.categoryPill, activeCategory === item && styles.categoryPillActive]}
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, activeCategory === item && styles.categoryTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
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
  categoriesWrapper: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillActive: {
    backgroundColor: '#064e3b',
    borderColor: '#064e3b',
  },
  categoryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
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
    paddingBottom: 100, // padding for floating navigation
  },
  cardOverlay: {
    borderRadius: 24,
    marginBottom: 20,
    backgroundColor: '#064e3b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cardImageBg: {
    width: '100%',
    height: 280,
    borderRadius: 24,
  },
  cardGradientOverlay: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'space-between',
    padding: 20,
  },
  cardHeaderOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeOverlay: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeTextOverlay: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#ffffff',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  volunteerBadgeOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
    gap: 6,
  },
  volunteerTextOverlay: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#ffffff',
    fontSize: 11,
  },
  cardContentOverlay: {
    justifyContent: 'flex-end',
  },
  cardTitleOverlay: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 32,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFooterOverlay: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItemOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  footerTextOverlay: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: '#f8fafc',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
