import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert
} from 'react-native';
import api from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function ActivityDetailScreen({ route, navigation }: any) {
  const { activity } = route.params;
  const [loading, setLoading] = useState(false);

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
              Alert.alert('Berhasil! 🎉', 'Terima kasih atas kepedulian Anda. Anda telah resmi terdaftar sebagai relawan.', [
                { text: 'Tutup', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              const message = error.response?.data?.message || 'Gagal mendaftar. Anda mungkin sudah terdaftar.';
              Alert.alert('Informasi', message);
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
      icon: '📅',
      label: 'Tanggal Pelaksanaan',
      value: new Date(activity.date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    { icon: '📍', label: 'Lokasi Kegiatan', value: activity.location },
    { icon: '👥', label: 'Total Relawan', value: `${activity._count?.volunteers || 0} Orang Terdaftar` },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient colors={['#059669', '#34d399']} style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🌿 Aksi Sosial</Text>
          </View>
          <Text style={styles.heroTitle}>{activity.title}</Text>
          <View style={styles.heroVolunteer}>
            <Text style={styles.heroVolunteerText}>
              👥 {activity._count?.volunteers || 0} relawan sudah bergabung
            </Text>
          </View>
        </LinearGradient>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {infoItems.map((item, index) => (
            <View key={index} style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Text style={styles.infoIconText}>{item.icon}</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.descSection}>
          <Text style={styles.descTitle}>Deskripsi Kegiatan</Text>
          <View style={styles.descCard}>
            <Text style={styles.descText}>{activity.description}</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.footerOverlay}>
        <TouchableOpacity
          onPress={handleJoin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#10b981', '#059669']} style={styles.joinButton}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.joinButtonIcon}>🤝</Text>
                <Text style={styles.joinButtonText}>Daftar Sebagai Relawan</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  hero: {
    padding: 28,
    paddingTop: 32,
    paddingBottom: 48,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 34,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  heroVolunteer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  heroVolunteerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: -24,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 14,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: 22,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#064e3b',
    fontWeight: '700',
    lineHeight: 22,
  },
  descSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  descCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  descText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 28,
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(240,253,244,0.95)',
    padding: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  joinButton: {
    padding: 20,
    borderRadius: 22,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  joinButtonIcon: {
    fontSize: 20,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
