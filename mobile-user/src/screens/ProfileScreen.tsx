import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../lib/api';

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();

  const handleLogout = () => {
    // Fungsi logout akan ditaruh di sini
    console.log('Logout pressed');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header Profile (Desain Modern Ala Gojek / Kitabisa) */}
        <LinearGradient 
          colors={['#059669', '#10b981']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.headerSection}
        >
          {/* Avatar Container */}
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <Image source={{ uri: `${API_URL}${user.avatarUrl}` }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </Text>
              </View>
            )}
            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#ffffff" />
            </View>
          </View>

          {/* Nama Pengguna & Checkmark Verified */}
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{user?.name || 'Administrator'}</Text>
            <Ionicons name="checkmark-circle" size={18} color="#38bdf8" />
          </View>
          
          {/* Email Pengguna */}
          <Text style={styles.userEmail}>{user?.email || 'admin@relawandesa.id'}</Text>

          {/* Role Badge with conditional colors */}
          <View style={[styles.roleBadge, user?.role === 'ADMIN' ? styles.roleBadgeAdmin : styles.roleBadgeVolunteer]}>
            <Text style={styles.roleBadgeText}>
              {user?.role === 'ADMIN' ? 'Administrator' : 'Relawan'}
            </Text>
          </View>
        </LinearGradient>

        {/* 2. Statistik Pengguna */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Statistik Pengguna</Text>
          <View style={styles.statContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>-</Text>
              <Text style={styles.statLabel}>Kegiatan</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>-</Text>
              <Text style={styles.statLabel}>Keterlibatan</Text>
            </View>
          </View>
        </View>

        {/* 3. Menu Akun */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Menu Akun</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Ubah Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Pengaturan Keamanan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Menu Aktivitas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Menu Aktivitas</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Riwayat Aksi Sosial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Sertifikat Saya</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Panel Admin */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Panel Admin</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Kelola Kegiatan Desa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Daftar Semua Relawan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Tentang Aplikasi */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Syarat & Ketentuan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Kebijakan Privasi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. Tombol Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingTop: 65,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#059669',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#3b82f6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
    color: '#e6fffa',
    fontWeight: '500',
    opacity: 0.9,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    // default background (will be overridden)
    backgroundColor: '#64748b',
  },
  roleBadgeAdmin: {
    backgroundColor: '#059669',
  },
  roleBadgeVolunteer: {
    backgroundColor: '#64748b',
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 36,
    backgroundColor: '#fee2e2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
