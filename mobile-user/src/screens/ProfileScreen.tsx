import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
  // Tempat menaruh hooks dan state di kemudian hari (contoh: const { user, logout } = useAuth())

  const handleLogout = () => {
    // Fungsi logout akan ditaruh di sini
    console.log('Logout pressed');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header Profile */}
        <View style={styles.headerSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text style={styles.userName}>Nama Pengguna</Text>
          <Text style={styles.userEmail}>email@domain.com</Text>
        </View>

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
    backgroundColor: '#059669',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#d1fae5',
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
