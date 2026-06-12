import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ImageBackground, Linking, Image
} from 'react-native';
import api, { API_URL } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActivityDetailScreen({ route, navigation }: any) {
  const { activity } = route.params;
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [volunteerCount, setVolunteerCount] = useState<number>(activity._count?.volunteers || 0);
  const [volunteersList, setVolunteersList] = useState<{user: {id: string, name: string, avatarUrl?: string}}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cek status join
        const responseMyActivities = await api.get('/api/users/me/activities');
        const myActivities: any[] = responseMyActivities.data;
        const alreadyJoined = myActivities.some(a => a.activityId === activity.id);
        setIsJoined(alreadyJoined);

        // Ambil detail activity (termasuk list volunteer)
        const responseActivity = await api.get(`/api/activities/${activity.id}`);
        if (responseActivity.data && responseActivity.data.volunteers) {
          setVolunteersList(responseActivity.data.volunteers);
          setVolunteerCount(responseActivity.data.volunteers.length);
        }
      } catch (error) {
        // Error handling
      } finally {
        setCheckingStatus(false);
      }
    };
    fetchData();
  }, []);

  const handleJoin = async () => {
    Alert.alert(
      'Konfirmasi Partisipasi',
      `Anda akan mendaftar sebagai relawan pada kegiatan:\n\n"${activity.title}"\n\nLanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Daftar',
          onPress: async () => {
            setLoading(true);
            try {
              await api.post(`/api/activities/${activity.id}/join`);
              setIsJoined(true);
              setVolunteerCount(prev => prev + 1);
              Alert.alert('Berhasil!', 'Terima kasih atas kepedulian Anda. Anda telah resmi terdaftar sebagai relawan.', [
                { text: 'Oke' }
              ]);
            } catch (error: any) {
              const message = error.response?.data?.message || 'Gagal mendaftar.';
              Alert.alert('Informasi', message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleUnjoin = async () => {
    Alert.alert(
      'Batalkan Partisipasi',
      `Anda yakin ingin membatalkan pendaftaran dari:\n\n"${activity.title}"?`,
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete(`/api/users/me/activities/${activity.id}`);
              setIsJoined(false);
              setVolunteerCount(prev => Math.max(0, prev - 1));
              Alert.alert('Berhasil', 'Pendaftaran Anda telah dibatalkan.');
            } catch (error: any) {
              const message = error.response?.data?.message || 'Gagal membatalkan pendaftaran.';
              Alert.alert('Error', message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      '🗑️ Hapus Kegiatan',
      `Anda yakin ingin menghapus kegiatan:\n\n"${activity.title}"?\n\nTindakan ini tidak dapat dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete(`/api/activities/${activity.id}`);
              Alert.alert('Berhasil', 'Kegiatan berhasil dihapus.', [
                { text: 'Oke', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              const message = error.response?.data?.message || 'Gagal menghapus kegiatan.';
              Alert.alert('Error', message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const infoItems = [
    {
      icon: <Ionicons name="calendar" size={24} color="#059669" />,
      label: 'Tanggal Pelaksanaan',
      value: new Date(activity.date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    { 
      icon: <Ionicons name="location" size={24} color="#059669" />, 
      label: 'Lokasi Kegiatan', 
      value: activity.location,
      isLocation: true
    },
    { icon: <Ionicons name="people" size={24} color="#059669" />, label: 'Total Relawan', value: `${volunteerCount} Orang Terdaftar` },
  ];

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        {activity.imageUrl ? (
          <ImageBackground 
            source={{ uri: `${API_URL}${activity.imageUrl}` }} 
            style={styles.heroImageBg}
          >
            <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(4,120,87,0.9)']} style={styles.heroGradientOverlay}>
              
              {/* Custom Header with Glassmorphism */}
              <View style={[styles.customHeader, { paddingTop: insets.top || 20 }]}>
                <BlurView intensity={30} tint="light" style={styles.backBtnWrapper}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#ffffff" />
                  </TouchableOpacity>
                </BlurView>
              </View>

              <View style={styles.heroContentBottom}>
                <View style={styles.heroBadge}>
                  <Ionicons name="sparkles" size={14} color="#FBBF24" style={{marginRight: 6}} />
                  <Text style={styles.heroBadgeText}>Aksi Sosial</Text>
                </View>
                <Text style={styles.heroTitle}>{activity.title}</Text>
                <View style={styles.heroVolunteer}>
                  <Ionicons name="people" size={16} color="#d1fae5" style={{marginRight: 6}} />
                  <Text style={styles.heroVolunteerText}>
                    {volunteerCount} relawan sudah bergabung
                  </Text>
                </View>

                {/* Status Badge */}
                {!checkingStatus && isJoined && (
                  <View style={styles.joinedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" style={{marginRight: 6}} />
                    <Text style={styles.joinedBadgeText}>Anda sudah terdaftar</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient colors={['#064e3b', '#047857']} style={styles.heroFallback}>
            <View style={[styles.customHeader, { paddingTop: insets.top || 20 }]}>
              <BlurView intensity={30} tint="light" style={styles.backBtnWrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <Ionicons name="chevron-back" size={24} color="#ffffff" />
                </TouchableOpacity>
              </BlurView>
            </View>

            <View style={styles.heroContentBottomFallback}>
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles" size={14} color="#FBBF24" style={{marginRight: 6}} />
                <Text style={styles.heroBadgeText}>Aksi Sosial</Text>
              </View>
              <Text style={styles.heroTitle}>{activity.title}</Text>
              <View style={styles.heroVolunteer}>
                <Ionicons name="people" size={16} color="#d1fae5" style={{marginRight: 6}} />
                <Text style={styles.heroVolunteerText}>
                  {volunteerCount} relawan sudah bergabung
                </Text>
              </View>

              {!checkingStatus && isJoined && (
                <View style={styles.joinedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" style={{marginRight: 6}} />
                  <Text style={styles.joinedBadgeText}>Anda sudah terdaftar</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        )}


        {/* Info Cards */}
        <View style={styles.infoSection}>
          {infoItems.map((item, index) => {
            const content = (
              <View key={index} style={styles.infoCard}>
                <View style={styles.infoIconBox}>
                  {item.icon}
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={[styles.infoValue, item.isLocation && { color: '#0ea5e9', textDecorationLine: 'underline' }]}>{item.value}</Text>
                </View>
                {item.isLocation && (
                  <Ionicons name="open-outline" size={20} color="#0ea5e9" />
                )}
              </View>
            );

            if (item.isLocation) {
              return (
                <TouchableOpacity 
                  key={index} 
                  activeOpacity={0.7} 
                  onPress={() => {
                    if (item.value.startsWith('http')) {
                      Linking.openURL(item.value);
                    } else {
                      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(item.value)}`);
                    }
                  }}
                >
                  {content}
                </TouchableOpacity>
              );
            }
            return content;
          })}
        </View>

        {/* Description */}
        <View style={styles.descSection}>
          <Text style={styles.descTitle}>Deskripsi Kegiatan</Text>
          <View style={styles.descCard}>
            <Text style={styles.descText}>{activity.description}</Text>
          </View>
        </View>

        {/* Volunteers List */}
        <View style={styles.descSection}>
          <Text style={styles.descTitle}>Relawan yang Berpartisipasi ({volunteerCount})</Text>
          <View style={styles.descCard}>
            {volunteersList.length > 0 ? (
              volunteersList.map((vol, index) => (
                <View key={index} style={styles.volunteerItem}>
                  {vol.user.avatarUrl ? (
                    <Image
                      source={{ uri: `${API_URL}${vol.user.avatarUrl}` }}
                      style={styles.volunteerAvatarImg}
                    />
                  ) : (
                    <View style={styles.volunteerAvatar}>
                      <Text style={styles.volunteerAvatarText}>{vol.user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  <Text style={styles.volunteerName}>{vol.user.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.descText}>Belum ada relawan yang terdaftar. Jadilah yang pertama!</Text>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.footerOverlay}>
        {isAdmin ? (
          // Tombol Hapus untuk Admin
          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading}
            activeOpacity={0.85}
            style={styles.deleteButton}
          >
            {loading ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <>
                <Ionicons name="trash" size={18} color="#ef4444" style={{ marginRight: 6 }} />
                <Text style={styles.deleteButtonText}>Hapus Kegiatan</Text>
              </>
            )}
          </TouchableOpacity>
        ) : checkingStatus ? (
          // Loading status
          <View style={styles.loadingBtn}>
            <ActivityIndicator color="#10b981" />
            <Text style={styles.loadingBtnText}>Memeriksa status...</Text>
          </View>
        ) : isJoined ? (
          // Batalkan pendaftaran
          <TouchableOpacity onPress={handleUnjoin} disabled={loading} activeOpacity={0.85}>
            <View style={styles.unjoinButton}>
              {loading ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <>
                  <Ionicons name="close-circle" size={20} color="#ef4444" style={{marginRight: 8}} />
                  <Text style={styles.unjoinButtonText}>Batalkan Pendaftaran</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          // Daftar sebagai relawan
          <TouchableOpacity onPress={handleJoin} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.joinButton}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="heart" size={20} color="#ffffff" style={{marginRight: 8}} />
                  <Text style={styles.joinButtonText}>Daftar Sebagai Relawan</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  heroImageBg: {
    width: '100%',
    height: 420,
    backgroundColor: '#064e3b',
  },
  heroGradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  heroFallback: {
    width: '100%',
    paddingBottom: 40,
  },
  customHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  backBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroContentBottom: {
    paddingHorizontal: 24,
  },
  heroContentBottomFallback: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroBadgeText: { fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', fontSize: 13, letterSpacing: 0.5 },
  heroTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 32,
    color: '#ffffff',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroVolunteer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroVolunteerText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#d1fae5',
    fontSize: 15,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  joinedBadgeText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#064e3b',
    fontSize: 14,
  },
  infoSection: {
    marginTop: -24,
    paddingHorizontal: 20,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 16, color: '#0f172a' },
  descSection: {
    padding: 24,
  },
  descTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 16,
  },
  descCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  descText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: '#475569',
    lineHeight: 26,
  },
  volunteerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  volunteerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  volunteerAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#d1fae5',
  },
  volunteerAvatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#059669',
    fontSize: 16,
  },
  volunteerName: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: '#334155',
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 36,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  joinButtonText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  unjoinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  unjoinButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#ef4444',
    fontSize: 16,
  },
  loadingBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  loadingBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#64748b',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
  },
  deleteButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#ef4444',
    fontSize: 15,
  },
});
