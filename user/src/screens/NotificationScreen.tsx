import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const notifications = [
    {
      id: '1',
      title: 'Selamat Datang!',
      message: 'Terima kasih telah bergabung menjadi Relawan Desa. Mari mulai membuat perubahan bersama kami.',
      time: 'Baru saja',
      type: 'info'
    },
    {
      id: '2',
      title: 'Kegiatan Baru di Sekitar Anda',
      message: 'Ada aksi sosial "Jum\'at bersih" yang baru ditambahkan. Segera daftarkan diri Anda sebelum kuota penuh!',
      time: '2 jam yang lalu',
      type: 'alert'
    }
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={[styles.iconContainer, item.type === 'alert' ? styles.iconAlert : styles.iconInfo]}>
        <Ionicons 
          name={item.type === 'alert' ? 'alert-circle' : 'information-circle'} 
          size={24} 
          color={item.type === 'alert' ? '#ef4444' : '#3b82f6'} 
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  list: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconInfo: {
    backgroundColor: '#eff6ff',
  },
  iconAlert: {
    backgroundColor: '#fef2f2',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 4,
  },
  message: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#94a3b8',
  },
});
