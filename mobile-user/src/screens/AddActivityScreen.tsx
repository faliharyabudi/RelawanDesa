import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api, { API_URL } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddActivityScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validasi format tanggal sederhana: YYYY-MM-DD
  const isValidDate = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Kami butuh izin akses galeri untuk mengupload foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim()) {
      Alert.alert('Perhatian', 'Semua kolom teks harus diisi.');
      return;
    }
    if (!isValidDate(date.trim())) {
      Alert.alert('Format Salah', 'Format tanggal harus YYYY-MM-DD.\nContoh: 2026-06-15');
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = null;

      // Jika ada gambar, upload dulu gambarnya
      if (imageUri) {
        const formData = new FormData();
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', {
          uri: imageUri,
          name: filename,
          type,
        } as any);

        const token = await AsyncStorage.getItem('token');
        const uploadRes = await fetch(`${API_URL}/api/activities/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            // jangan set Content-Type secara manual untuk FormData di fetch react-native
          },
        });
        
        if (!uploadRes.ok) {
          throw new Error('Gagal mengupload foto');
        }

        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.imageUrl;
      }

      // Submit data kegiatan
      await api.post('/api/activities', {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date: new Date(date.trim()).toISOString(),
        ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
      });

      Alert.alert('Berhasil!', 'Kegiatan baru berhasil ditambahkan.', [
        {
          text: 'Oke',
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || error.message || 'Gagal menambahkan kegiatan.';
      Alert.alert('Error', Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      icon: <Ionicons name="document-text" size={18} color="#0f172a" />,
      label: 'Judul Kegiatan',
      placeholder: 'Contoh: Gotong Royong Desa',
      value: title,
      onChangeText: setTitle,
      multiline: false,
    },
    {
      icon: <Ionicons name="pencil" size={18} color="#0f172a" />,
      label: 'Deskripsi Kegiatan',
      placeholder: 'Jelaskan tujuan dan detail kegiatan...',
      value: description,
      onChangeText: setDescription,
      multiline: true,
    },
    {
      icon: <Ionicons name="location" size={18} color="#0f172a" />,
      label: 'Lokasi',
      placeholder: 'Contoh: Balai Desa Sukamaju',
      value: location,
      onChangeText: setLocation,
      multiline: false,
    },
    {
      icon: <Ionicons name="calendar" size={18} color="#0f172a" />,
      label: 'Tanggal (Format: YYYY-MM-DD)',
      placeholder: 'Contoh: 2026-06-15',
      value: date,
      onChangeText: setDate,
      multiline: false,
      keyboardType: 'default' as const,
    },
  ];

  return (
    <LinearGradient colors={['#ffffff', '#f0fdf4']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient colors={['#34d399', '#059669']} style={styles.iconBox}>
              <Ionicons name="add" size={40} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.title}>Tambah Kegiatan</Text>
            <Text style={styles.subtitle}>Isi detail kegiatan sosial baru</Text>
          </View>

          {/* Image Picker */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="image" size={18} color="#0f172a" />
              <Text style={styles.label}>Foto Kegiatan (Opsional)</Text>
            </View>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage} activeOpacity={0.8}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color="#94a3b8" />
                  <Text style={styles.imagePlaceholderText}>Pilih dari Galeri</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          {fields.map((field, index) => (
            <View key={index} style={styles.inputGroup}>
              <View style={styles.labelRow}>
                {field.icon}
                <Text style={styles.label}>{field.label}</Text>
              </View>
              <View style={[styles.inputContainer, field.multiline && styles.inputContainerMultiline]}>
                <TextInput
                  style={[styles.input, field.multiline && styles.inputMultiline]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#94a3b8"
                  value={field.value}
                  onChangeText={field.onChangeText}
                  multiline={field.multiline}
                  numberOfLines={field.multiline ? 4 : 1}
                  textAlignVertical={field.multiline ? 'top' : 'center'}
                />
              </View>
            </View>
          ))}

          {/* Tip Box */}
          <View style={styles.tipBox}>
            <Ionicons name="bulb" size={24} color="#d97706" />
            <Text style={styles.tipText}>
              Pastikan tanggal sudah benar. Format harus: <Text style={styles.tipBold}>YYYY-MM-DD</Text>{'\n'}
              Contoh: <Text style={styles.tipBold}>2026-06-15</Text>
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="rocket" size={20} color="#ffffff" style={{marginRight: 8}} />
                  <Text style={styles.buttonText}>Tambahkan Kegiatan</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  inputGroup: { marginBottom: 20 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerMultiline: {
    borderRadius: 18,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  inputMultiline: {
    height: 100,
    paddingTop: 16,
  },
  imagePickerBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    overflow: 'hidden',
    borderStyle: 'dashed',
    height: 160,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 20 },
  tipBold: { fontWeight: '800' },
  button: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 14,
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
});
