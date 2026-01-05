import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; // Untuk navigasi back
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image, KeyboardAvoidingView, Platform,
  Pressable,
  ScrollView, StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { redCollor } from './color';

// Ganti dengan path color Anda


export default function EditInvoiceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // --- 1. SIMULASI MENERIMA DATA DARI HALAMAN SEBELUMNYA ---
  // Dalam praktek nyata, data ini diambil dari `route.params`
  // Contoh: const { invoiceData } = route.params;
  const initialData = {
    nomorInvoice: 'INV-20250101-001',
    tanggal: '01/01/2026',
    platNomor: 'B 1234 ABC',
    namaPelanggan: 'Budi Santoso',
    nomorPelanggan: '08123456789',
    items: [
      { 
        id: 101, 
        deskripsi: 'Ganti Oli Shell Helix', 
        qty: '1', 
        harga: '350000', 
        jumlah: 350000, 
        imageUri: 'https://down-id.img.susercontent.com/file/id-11134207-7r98o-lty9q4j8d5i6e4'
      }
    ]
  };

  // --- STATE ---
  const [nomorInvoice, setNomorInvoice] = useState(initialData.nomorInvoice);
  const [tanggal, setTanggal] = useState(initialData.tanggal);
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [nomorPelanggan, setNomorPelanggan] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  
  const [items, setItems] = useState<any[]>([]);

  // --- USE EFFECT: ISI DATA SAAT LAYAR DIBUKA ---
  useEffect(() => {
    // Di sini kita set state berdasarkan data yang diterima
    if (initialData) {
      setNomorInvoice(initialData.nomorInvoice);
      setTanggal(initialData.tanggal);
      setPlatNomor(initialData.platNomor);
      setNamaPelanggan(initialData.namaPelanggan);
      setNomorPelanggan(initialData.nomorPelanggan);
      setItems(initialData.items);
    }
  }, []);

  // --- FUNGSI HELPER (Sama seperti Add Invoice) ---
  
  const updateItemImage = (id: any, uri: string | null) => {
    const newItems = items.map(item => {
      if (item.id === id) return { ...item, imageUri: uri };
      return item;
    });
    setItems(newItems);
  };

  const takePicture = async (itemId: any) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Maaf', 'Butuh izin kamera.');

   const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // <--- Perbaikan Syntax
      allowsEditing: true, // Ubah jadi TRUE agar user bisa crop (opsional, tapi lebih stabil)
      aspect: [4, 3],      // Rasio foto standar
      quality: 0.3,        // <--- TURUNKAN JADI 0.3 - 0.5 AGAR TIDAK CRASH MEMORI
    });

    if (!result.canceled) updateItemImage(itemId, result.assets[0].uri);
  };

  const pickImage = async (itemId: any) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Maaf', 'Butuh izin galeri.');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) updateItemImage(itemId, result.assets[0].uri);
  };

  const tambahItem = () => {
    setItems([...items, { id: Date.now(), qty: '', deskripsi: '', harga: '', jumlah: 0, imageUri: null }]);
  };

  const hapusItem = (id: any) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      Alert.alert("Info", "Minimal harus ada 1 item.");
    }
  };

  const updateItem = (id: any, field: any, value: any) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'harga') {
          updatedItem.jumlah = (parseInt(updatedItem.qty) || 0) * (parseInt(updatedItem.harga) || 0);
        }
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
  };

  const handleSimpanPerubahan = () => {
    // Logic update ke backend (API) di sini
    console.log("Data Update:", { platNomor, items });
    Alert.alert("Sukses", "Data invoice berhasil diperbarui!");
    navigation.goBack(); // Kembali ke layar sebelumnya
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      
      {/* --- HEADER CUSTOM dengan TOMBOL KEMBALI --- */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Invoice</Text>
        {/* View kosong untuk penyeimbang agar judul di tengah */}
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          
          {/* Info Invoice (Read Only) */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>No: {nomorInvoice}</Text>
            <Text style={styles.dateText}>{tanggal}</Text>
          </View>

          {/* Form Pelanggan */}
          <View style={styles.section}>
            <Text style={styles.label}>Plat Nomor</Text>
            <TextInput
              style={styles.inputFull}
              value={platNomor}
              onChangeText={setPlatNomor}
            />
            
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Nama</Text>
                <TextInput
                  style={styles.inputFull}
                  value={namaPelanggan}
                  onChangeText={setNamaPelanggan}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>No HP</Text>
                <TextInput
                  style={styles.inputFull}
                  keyboardType="phone-pad"
                  value={nomorPelanggan}
                  onChangeText={setNomorPelanggan}
                />
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* List Item */}
          <Text style={styles.sectionTitle}>Perincian Pekerjaan</Text>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemBox}>
              <View style={styles.rowBetween}>
                <Text style={styles.itemNumber}>Item #{index + 1}</Text>
                <Pressable onPress={() => hapusItem(item.id)}>
                   <Text style={styles.deleteBtn}>Hapus</Text>
                </Pressable>
              </View>

              <TextInput
                style={styles.inputFull}
                placeholder="Deskripsi"
                value={item.deskripsi}
                onChangeText={(val) => updateItem(item.id, 'deskripsi', val)}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.miniLabel}>Qty</Text>
                  <TextInput
                    style={styles.inputFull}
                    keyboardType="numeric"
                    value={String(item.qty)}
                    onChangeText={(val) => updateItem(item.id, 'qty', val)}
                  />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.miniLabel}>Harga</Text>
                  <TextInput
                    style={styles.inputFull}
                    keyboardType="numeric"
                    value={String(item.harga)}
                    onChangeText={(val) => updateItem(item.id, 'harga', val)}
                  />
                </View>
              </View>

              {/* Area Foto */}
              <View style={styles.photoSection}>
                {item.imageUri ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                        <TouchableOpacity 
                            style={styles.removePhotoBtn} 
                            onPress={() => updateItemImage(item.id, null)}
                        >
                            <Ionicons name="close" size={12} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.photoButtonRow}>
                        <TouchableOpacity onPress={() => takePicture(item.id)} style={[styles.smallBtn, {backgroundColor: '#2196F3'}]}>
                            <Ionicons name="camera" size={16} color="white" style={{marginRight:5}} />
                            <Text style={styles.smallBtnText}>Foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImage(item.id)} style={[styles.smallBtn, {backgroundColor: '#FF9800'}]}>
                            <Ionicons name="images" size={16} color="white" style={{marginRight:5}} />
                            <Text style={styles.smallBtnText}>Galeri</Text>
                        </TouchableOpacity>
                    </View>
                )}
              </View>

              <View style={styles.totalRow}>
                <Text>Subtotal: </Text>
                <Text style={styles.totalText}>
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.jumlah)}
                </Text>
              </View>
            </View>
          ))}

          <Pressable style={[styles.addBtn, { backgroundColor: '#666' }]} onPress={tambahItem}>
            <Text style={styles.addBtnText}>+ Tambah Item</Text>
          </Pressable>

          {/* Tombol Simpan Perubahan */}
          <Pressable style={[styles.addBtn, { marginTop: 20 }]} onPress={handleSimpanPerubahan}>
            <Text style={styles.addBtnText}>SIMPAN PERUBAHAN</Text>
          </Pressable>

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // --- HEADER STYLES ---
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50, // Untuk Safe Area (Notch)
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 5,
  },

  // --- CONTENT STYLES ---
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    margin: 15, padding: 20, backgroundColor: 'white',
    borderRadius: 12, elevation: 4,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10,
  },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  dateText: { color: 'gray' },
  section: { marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#333' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 12, color: 'gray', marginBottom: 4 },
  miniLabel: { fontSize: 12, color: 'gray', marginBottom: 4 },
  inputFull: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 6,
    padding: 8, marginBottom: 10, backgroundColor: '#fafafa',
  },
  itemBox: {
    borderWidth: 1, borderColor: '#e0e0e0', padding: 15,
    borderRadius: 8, marginBottom: 20, backgroundColor: '#fff',
  },
  itemNumber: { fontWeight: 'bold', color: '#666' },
  deleteBtn: { color: 'red', fontWeight: '500' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  totalText: { fontWeight: 'bold', color: '#2e7d32' },
  
  // Tombol Utama
  addBtn: {
    backgroundColor: redCollor ? redCollor() : 'red',
    padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10,
  },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },

  // Styles Foto
  photoSection: { marginTop: 5, marginBottom: 10, alignItems: 'flex-start' },
  photoButtonRow: { flexDirection: 'row', gap: 10 },
  smallBtn: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6,
    flexDirection: 'row', alignItems: 'center',
  },
  smallBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  imageWrapper: { position: 'relative', width: 100, height: 100 },
  itemImage: { width: 100, height: 100, borderRadius: 6, borderWidth: 1, borderColor: '#ddd' },
  removePhotoBtn: {
    position: 'absolute', top: -5, right: -5, backgroundColor: 'red',
    width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  }
});