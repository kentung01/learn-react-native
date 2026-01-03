import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { redCollor } from '../color';

export default function TabTwoScreen() {
  const nomorInvoice = 'BMWM-1234';
  const tanggal = new Date().toLocaleDateString('id-ID');

  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [nomorPelanggan, setNomorPelanggan] = useState('');
  const [platNomor, setPlatNomor] = useState('');
  const [imageUri, setImageUri] = useState<string[] | null>(null);

  //function pickImage() {
    const takePicture = async () => {
      // 1. Minta Izin Kamera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
          
          if (status !== 'granted') {
            Alert.alert('Maaf', 'Aplikasi butuh izin kamera untuk mengambil foto.');
            return;
          }
          

          // 2. Buka Kamera System
          const result = await ImagePicker.launchCameraAsync({
            // PERBAIKAN 1: Gunakan Enum, jangan array string manual
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: false,
            quality: 1,
          });

        // 3. Cek apakah user jadi ambil foto atau cancel
        if (!result.canceled) {
          // Ambil URI dari foto pertama (assets[0])
          const photos = imageUri ? [...imageUri] : [];
          photos.push(result.assets[0].uri);
          setImageUri(photos);
          
        }
      }

    // --- FUNGSI 2: Simpan ke Galeri HP ---
  const saveToGallery = async () => {
    if (!imageUri) return;

    // 1. Minta Izin Tulis ke Galeri
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      try {
        // 2. Simpan Asset
        await MediaLibrary.createAssetAsync(imageUri[0]);
        Alert.alert('Sukses', 'Foto berhasil disimpan ke Galeri!');
      } catch (error) {
        Alert.alert('Gagal', 'Tidak bisa menyimpan foto.');
      }
    } else {
      Alert.alert('Izin Ditolak', 'Berikan izin akses galeri di pengaturan.');
    }
  };

  // State Dinamis untuk List Item
  const [items, setItems] = useState([
    { id: Date.now(), qty: '', deskripsi: '', harga: '', jumlah: 0 }
  ]);

  // Fungsi Tambah Item
  const tambahItem = () => {
    setItems([...items, { id: Date.now(), qty: '', deskripsi: '', harga: '', jumlah: 0 }]);
  };

  // Fungsi Hapus Item
  const hapusItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Fungsi Update Item & Hitung Otomatis
  const updateItem = (id: number, field: string, value: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Hitung jumlah otomatis jika qty atau harga berubah
        if (field === 'qty' || field === 'harga') {
          updatedItem.jumlah = (parseInt(updatedItem.qty) || 0) * (parseInt(updatedItem.harga) || 0);
        }
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          
          {/* Header Invoice */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>No. Invoice: {nomorInvoice}</Text>
            <Text style={styles.dateText}>{tanggal}</Text>
          </View>

            {/* Area Preview Foto */}
            <View style={styles.previewBox}>
              {imageUri ? (
                <Image source={{ uri: imageUri[0] }} style={styles.image} />
              ) : (
                <Text style={styles.placeholderText}>Belum ada foto diambil</Text>
              )}
            </View>

            {/* Tombol Ambil Foto */}
            <TouchableOpacity onPress={takePicture} style={styles.btnCapture}>
              <Text style={styles.btnText}>📷 Ambil Foto</Text>
            </TouchableOpacity>

            {/* Tombol Simpan (Muncul hanya jika sudah ada foto) */}
            {imageUri && (
              <TouchableOpacity onPress={saveToGallery} style={styles.btnSave}>
                <Text style={styles.btnText}>💾 Simpan ke Galeri</Text>
              </TouchableOpacity>
            )}
      

          {/* Input Data Pelanggan */}
          <View style={styles.section}>
            <TextInput
              style={styles.inputFull}
              placeholder="Masukan Plat Nomor Mobil"
              value={platNomor}
              onChangeText={setPlatNomor}
            />
            <View style={styles.row}>
              <Text style={styles.label}>Nama:</Text>
              <TextInput
                style={styles.inputFlex}
                placeholder="Hermawan"
                value={namaPelanggan}
                onChangeText={setNamaPelanggan}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>No HP:</Text>
              <TextInput
                style={styles.inputFlex}
                placeholder="0812xxx"
                keyboardType="phone-pad"
                value={nomorPelanggan}
                onChangeText={setNomorPelanggan}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* List Item Dinamis */}
          <Text style={styles.sectionTitle}>Perincian Pekerjaan</Text>
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemBox}>
              <View style={styles.rowBetween}>
                <Text style={styles.itemNumber}>Item #{index + 1}</Text>
                {items.length > 1 && (
                  <Pressable onPress={() => hapusItem(item.id)}>
                    <Text style={styles.deleteBtn}>Hapus</Text>
                  </Pressable>
                )}
              </View>

              <TextInput
                style={styles.inputFull}
                placeholder="Perincian Barang / Jenis Pekerjaan"
                value={item.deskripsi}
                onChangeText={(val) => updateItem(item.id, 'deskripsi', val)}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.miniLabel}>Banyaknya</Text>
                  <TextInput
                    style={styles.inputFull}
                    placeholder="0"
                    keyboardType="numeric"
                    value={item.qty}
                    onChangeText={(val) => updateItem(item.id, 'qty', val)}
                  />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.miniLabel}>Harga Satuan</Text>
                  <TextInput
                    style={styles.inputFull}
                    placeholder="Rp"
                    keyboardType="numeric"
                    value={item.harga}
                    onChangeText={(val) => updateItem(item.id, 'harga', val)}
                  />
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text>Subtotal: </Text>
                <Text style={styles.totalText}>Rp {item.jumlah.toLocaleString('id-ID')}</Text>
              </View>
            </View>
          ))}

          {/* Tombol Tambah */}
          <Pressable style={styles.addBtn} onPress={tambahItem}>
            <Text style={styles.addBtnText}>+ Tambah Pekerjaan</Text>
          </Pressable>
          <View style={[{flexDirection: 'row', justifyContent: 'center', gap: 10}, {marginTop: 20}]}>
             {/* Tombol Simpan */}
            <Pressable style={styles.addBtn} onPress={tambahItem}>
              <Text style={styles.addBtnText}> Simpan </Text>
            </Pressable>
             <Pressable style={styles.addBtn} onPress={tambahItem}>
              <Text style={styles.addBtnText}> Cetak </Text>
            </Pressable>

          </View>
         


          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  dateText: { color: 'gray' },
  section: { marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#333' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { width: 120, fontSize: 14 },
  miniLabel: { fontSize: 12, color: 'gray', marginBottom: 4 },
  inputFull: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#fafafa',
  },
  itemBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  itemNumber: { fontWeight: 'bold', color: '#666' },
  deleteBtn: { color: 'red', fontWeight: '500' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  totalText: { fontWeight: 'bold', color: '#2e7d32' },
  addBtn: {
    backgroundColor: redCollor(),
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },


  previewBox: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden', // Agar gambar tidak keluar border
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderText: {
    color: '#777',
  },
  btnCapture: {
    backgroundColor: '#2196F3', // Biru
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnSave: {
    backgroundColor: '#4CAF50', // Hijau
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}


);