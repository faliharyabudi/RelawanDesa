import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya, Keluar', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    { icon: '👤', label: 'Nama Lengkap', value: user?.name || '-' },
    { icon: '📧', label: 'Alamat Email', value: user?.email || '-' },
    { icon: '🎖️', label: 'Peran Akun', value: user?.role === 'ADMIN' ? 'Administrator' : 'Relawan Desa' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#059669', '#10b981']} style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient colors={['#ffffff', '#f0fdf4']} style={styles.avatarGrad}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'R'}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {user?.role === 'ADMIN' ? '⭐ Administrator' : '🤝 Relawan Desa'}
          </Text>
        </View>
      </LinearGradient>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        <View style={styles.infoCard}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Text style={styles.infoIcon}>{item.icon}</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutEmoji}>🍃</Text>
          <Text style={styles.aboutName}>RelawanDesa</Text>
          <Text style={styles.aboutDesc}>
            Platform digital untuk menghubungkan relawan dengan kegiatan sosial di desa.
          </Text>
          <View style={styles.versionChip}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 36,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 8,
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarGrad: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#059669',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 20,
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
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0fdf4',
    marginHorizontal: 16,
  },
  aboutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  aboutEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  aboutName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 8,
  },
  aboutDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  versionChip: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  logoutButton: {
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
