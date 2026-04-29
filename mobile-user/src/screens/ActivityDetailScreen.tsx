import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import api from '../lib/api';

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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>📸</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Aksi Sosial</Text>
          </View>
          <Text style={styles.title}>{activity.title}</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Tanggal Pelaksanaan</Text>
                <Text style={styles.infoText}>{new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.infoIcon}>📍</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Lokasi Kegiatan</Text>
                <Text style={styles.infoText}>{activity.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.infoIcon}>👥</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Total Relawan</Text>
                <Text style={styles.infoText}>{activity._count?.volunteers || 0} Orang Terdaftar</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Deskripsi Kegiatan</Text>
          <Text style={styles.description}>{activity.description}</Text>
        </View>
        <View style={{height: 100}} />
      </ScrollView>

      <View style={styles.footerOverlay}>
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.joinButtonText}>Daftar Sebagai Relawan</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 50,
    opacity: 0.5,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeContainer: {
    backgroundColor: '#ecfdf5',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 24,
    lineHeight: 34,
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  content: {
    padding: 24,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 26,
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  joinButton: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
