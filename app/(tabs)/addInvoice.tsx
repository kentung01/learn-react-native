import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { redCollor } from '../color';

export default function TabTwoScreen() {
  const nomorInvoice = 'BMWM-1234';
  const tanggal = new Date().toLocaleDateString('id-ID');

  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [nomorPelanggan, setNomorPelanggan] = useState('');
  const [platNomor, setPlatNomor] = useState('');

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
});