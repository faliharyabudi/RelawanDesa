import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api, { API_URL } from '../lib/api';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [isEditNameModalVisible, setEditNameModalVisible] = useState(false);
  const [isAboutModalVisible, setAboutModalVisible] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert('PERHATIAN!', 'Nama tidak boleh kosong !!');
      return;
    }

    setIsUpdatingName(true);
    try {
      await api.put('/api/users/me/profile', { name: newName.trim() });
      await updateUser({ name: newName.trim() });
      setEditNameModalVisible(false);
      Alert.alert('Berhasil', 'Nama Anda telah diperbarui.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error!', 'Gagal memperbarui nama anda');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Izin Ditolak', 'Anda perlu memberikan izin untuk mengakses galeri.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      setLoading(true);
      try {
        const imageUri = result.assets[0].uri;
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('file', {
          uri: imageUri,
          name: filename,
          type,
        } as any);

        const uploadRes = await api.post('/api/activities/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const avatarUrl = uploadRes.data.imageUrl;
        await api.put('/api/users/me/profile', { avatarUrl });
        await updateUser({ avatarUrl });
        Alert.alert('Berhasil', 'Foto profil berhasil diperbarui!');
      } catch (error) {
        console.error(error);
        Alert.alert('Error!', 'Gagal mengupload foto profil anda.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Keluar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
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
        {/* Header Profile */}
        <LinearGradient colors={['#064e3b', '#047857']} style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage} disabled={loading}>
            {user?.avatarUrl ? (
              <Image source={{ uri: `${API_URL}${user.avatarUrl}` }} style={[styles.avatar, { padding: 0 }]} />
            ) : (
              <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
              </LinearGradient>
            )}
            <View style={styles.badgeRole}>
              <Text style={styles.badgeRoleText}>{user?.role || 'REL'}</Text>
            </View>
            <View style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>

          <View style={styles.cardGroup}>
            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Ionicons name="person" size={20} color="#059669" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Nama Lengkap</Text>
                <Text style={styles.cardValue}>{user?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => { setNewName(user?.name || ''); setEditNameModalVisible(true); }}>
                <Ionicons name="pencil" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Ionicons name="mail" size={20} color="#059669" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Email</Text>
                <Text style={styles.cardValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Ionicons name="shield-checkmark" size={20} color="#059669" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Status Peran</Text>
                <Text style={[
                  styles.cardValue,
                  user?.role === 'ADMIN' ? { color: '#059669' } : {}
                ]}>
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Relawan (User)'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Tentang Aplikasi</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity style={styles.cardRowAction} activeOpacity={0.7} onPress={() => setAboutModalVisible(true)}>
              <View style={styles.iconBoxGray}>
                <Ionicons name="information-circle" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>Tentang RelawanDesa</Text>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.cardRowAction} activeOpacity={0.7} onPress={() => setTermsModalVisible(true)}>
              <View style={styles.iconBoxGray}>
                <Ionicons name="document-text" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>Syarat & Ketentuan</Text>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>
              {loading ? 'Keluar...' : 'Keluar dari Akun'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.version}>Versi 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={isEditNameModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ganti Nama</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Masukkan nama baru"
              autoCapitalize="words"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setEditNameModalVisible(false)}
                disabled={isUpdatingName}
              >
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={handleUpdateName}
                disabled={isUpdatingName}
              >
                {isUpdatingName ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalBtnSaveText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* About App Modal */}
      <Modal
        visible={isAboutModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aboutModalContent}>
            <View style={styles.aboutHeader}>
              <View style={styles.aboutIconContainer}>
                <Ionicons name="leaf" size={40} color="#059669" />
              </View>
              <Text style={styles.aboutTitle}>RelawanDesa</Text>
              <Text style={styles.aboutVersion}>Versi 1.0.0</Text>
            </View>
            <View style={styles.aboutBody}>
              <Text style={styles.aboutText}>
                RelawanDesa adalah platform digital inovatif yang menghubungkan relawan dengan berbagai kegiatan sosial dan pembangunan nyata di desa-desa.
              </Text>
              <Text style={styles.aboutText}>
                Misi utama kami adalah menciptakan dampak positif melalui kolaborasi nyata untuk kemajuan dan kesejahteraan masyarakat desa.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.aboutBtnClose}
              onPress={() => setAboutModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.aboutBtnCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={isTermsModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.termsModalContent}>
            <View style={styles.aboutHeader}>
              <View style={styles.termsIconContainer}>
                <Ionicons name="document-text" size={40} color="#0284c7" />
              </View>
              <Text style={styles.aboutTitle}>Syarat & Ketentuan</Text>
            </View>
            <ScrollView style={styles.termsBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.termsText}>
                <Text style={styles.termsTextBold}>1. Pendaftaran Relawan</Text>
                {'\n'}Setiap pengguna wajib memberikan data asli yang valid dan dapat dipertanggungjawabkan saat mendaftar.
                {'\n\n'}
                <Text style={styles.termsTextBold}>2. Partisipasi Kegiatan</Text>
                {'\n'}Relawan yang telah menyetujui untuk ikut serta diharapkan hadir dan berkontribusi secara penuh. Ketidakhadiran tanpa keterangan dapat mempengaruhi status relawan.
                {'\n\n'}
                <Text style={styles.termsTextBold}>3. Privasi & Keamanan Data</Text>
                {'\n'}Data pribadi Anda dilindungi dengan enkripsi dan hanya digunakan untuk keperluan koordinasi RelawanDesa. Kami tidak akan menjual atau membagikannya kepada pihak ketiga.
                {'\n\n'}
                <Text style={styles.termsTextBold}>4. Etika Berinteraksi</Text>
                {'\n'}Selama mengikuti kegiatan, relawan wajib menjaga kesopanan, menghormati nilai dan budaya lokal, serta bersikap suportif terhadap rekan relawan lainnya.
                {'\n\n'}
                <Text style={styles.termsTextBold}>5. Pembaruan Aturan</Text>
                {'\n'}Pihak RelawanDesa berhak untuk memperbarui syarat dan ketentuan ini sewaktu-waktu.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.termsBtnClose}
              onPress={() => setTermsModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.termsBtnCloseText}>Saya Mengerti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    backgroundColor: '#0f172a',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 45,
    fontWeight: '900',
    color: '#059669',
  },
  badgeRole: {
    position: 'absolute',
    top: 0,
    left: -10,
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  badgeRoleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 16,
    color: '#ecfdf5',
    fontWeight: '600',
    opacity: 0.9,
  },
  content: {
    padding: 24,
    marginTop: -25,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 14,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
  },
  cardRowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  iconBoxGray: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  actionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 88,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 18,
    borderRadius: 24,
    marginTop: 36,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#fecaca',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 17,
    fontWeight: '800',
  },
  version: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    fontSize: 17,
    color: '#1e293b',
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 16,
  },
  modalBtnSave: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBtnSaveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  aboutModalContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
    alignItems: 'center',
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aboutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#d1fae5',
  },
  aboutTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  aboutBody: {
    marginBottom: 32,
  },
  aboutText: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  aboutBtnClose: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  aboutBtnCloseText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
  termsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
    alignItems: 'center',
  },
  termsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0f2fe',
  },
  termsBody: {
    marginBottom: 24,
    width: '100%',
  },
  termsText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'left',
    lineHeight: 24,
  },
  termsTextBold: {
    fontWeight: '800',
    color: '#0f172a',
    fontSize: 15,
  },
  termsBtnClose: {
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  termsBtnCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  }
});
