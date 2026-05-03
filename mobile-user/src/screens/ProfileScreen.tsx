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
  const [newName, setNewName] = useState(user?.name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert('Perhatian', 'Nama tidak boleh kosong');
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
      Alert.alert('Error', 'Gagal memperbarui nama');
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

        const uploadRes = await api.post('/api/activities/upload', formData, {
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
        Alert.alert('Error', 'Gagal mengupload foto profil.');
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
        <LinearGradient colors={['#059669', '#34d399']} style={styles.header}>
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
            <TouchableOpacity style={styles.cardRowAction} activeOpacity={0.7}>
              <View style={styles.iconBoxGray}>
                <Ionicons name="information-circle" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>Tentang RelawanDesa</Text>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.cardRowAction} activeOpacity={0.7}>
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
            <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{marginRight: 8}} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#0f172a',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#059669',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#059669',
  },
  badgeRole: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeRoleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#d1fae5',
    fontWeight: '500',
  },
  content: {
    padding: 24,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cardRowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconBoxGray: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 80,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#334155',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtnCancel: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalBtnCancelText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
  modalBtnSave: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  modalBtnSaveText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  }
});
