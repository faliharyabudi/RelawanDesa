import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../lib/api';

export default function ActivityDetailScreen({ route, navigation }: any) {
  const { activity } = route.params;
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    Alert.alert(
      'Konfirmasi',
      `Apakah Anda yakin ingin mendaftar sebagai relawan untuk kegiatan "${activity.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Daftar',
          onPress: async () => {
            setLoading(true);
            try {
              await api.post(`/api/activities/${activity.id}/join`);
              Alert.alert('Sukses', 'Anda berhasil terdaftar sebagai relawan pada kegiatan ini!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              const message = error.response?.data?.message || 'Gagal mendaftar. Anda mungkin sudah terdaftar.';
              Alert.alert('Gagal', message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Kegiatan Sosial</Text>
        </View>
        <Text style={styles.title}>{activity.title}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>{new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText}>{activity.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👥</Text>
          <Text style={styles.infoText}>{activity._count?.volunteers || 0} Relawan Terdaftar</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tentang Kegiatan</Text>
        <Text style={styles.description}>{activity.description}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.joinButtonText}>Daftar Sebagai Relawan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    lineHeight: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
  },
  content: {
    padding: 24,
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
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  joinButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 16,
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
