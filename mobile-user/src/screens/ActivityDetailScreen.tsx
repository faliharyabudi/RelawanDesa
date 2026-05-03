import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ImageBackground, Linking, Image
} from 'react-native';
import api, { API_URL } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityDetailScreen({ route, navigation }: any) {
  const { activity } = route.params;
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        {activity.imageUrl ? (
          <ImageBackground 
            source={{ uri: `${API_URL}${activity.imageUrl}` }} 
            style={styles.heroImageBg}
            imageStyle={{ opacity: 0.7 }}
          >
            <LinearGradient colors={['rgba(5,150,105,0.4)', 'rgba(5,150,105,0.9)']} style={styles.heroGradientOverlay}>
              <View style={styles.heroBadge}>
                <Ionicons name="leaf" size={16} color="#ffffff" style={{marginRight: 4}} />
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
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient colors={['#059669', '#34d399']} style={styles.hero}>
            <View style={styles.heroBadge}>
              <Ionicons name="leaf" size={16} color="#ffffff" style={{marginRight: 4}} />
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
        {checkingStatus ? (
          <View style={styles.loadingBtn}>
            <ActivityIndicator color="#10b981" />
            <Text style={styles.loadingBtnText}>Memeriksa status...</Text>
          </View>
        ) : isJoined ? (
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
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  hero: {
    padding: 28,
    paddingTop: 32,
    paddingBottom: 48,
  },
  heroImageBg: {
    backgroundColor: '#059669',
  },
  heroGradientOverlay: {
    padding: 28,
    paddingTop: 32,
    paddingBottom: 48,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroVolunteer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroVolunteerText: {
    color: '#d1fae5',
    fontSize: 14,
    fontWeight: '500',
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
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  infoSection: {
    marginTop: -30,
    paddingHorizontal: 20,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  infoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  descSection: {
    padding: 24,
  },
  descTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  descCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  descText: {
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
    color: '#059669',
    fontWeight: '700',
    fontSize: 16,
  },
  volunteerName: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
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
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  loadingBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
});
