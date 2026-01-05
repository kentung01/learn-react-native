import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// Pastikan path import ini sesuai dengan struktur folder Anda

import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/product-card';

// 1. DATA DUMMY (Master Data)
const IMAGE_URL = "https://plus.unsplash.com/premium_photo-1694016219798-9e08a6e9509c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8djglMjBlbmdpbmV8ZW58MHx8MHx8fDA%3D";

const DUMMY_DATA = [
  { id: 1, judul: "Kampas Rem Depan", harga: 250000, deskripsi: "Original Toyota, tahan panas dan pakem." },
  { id: 2, judul: "Oli Shell Helix HX7", harga: 85000, deskripsi: "Oli sintetik 10W-40 untuk perlindungan mesin maksimal." },
  { id: 3, judul: "Aki GS Astra Hybrid", harga: 950000, deskripsi: "Aki basah minim perawatan, daya starter tinggi." },
  { id: 4, judul: "Busi Iridium NGK", harga: 120000, deskripsi: "Pengapian lebih fokus, irit bahan bakar." },
  { id: 5, judul: "Filter Oli Sakura", harga: 35000, deskripsi: "Menyaring kotoran oli dengan sempurna." },
  { id: 6, judul: "Radiator Coolant", harga: 50000, deskripsi: "Cairan pendingin anti karat dan overheat." },
  { id: 7, judul: "Shockbreaker Kayaba", harga: 1200000, deskripsi: "Peredam kejut gas, stabil di jalan bergelombang." },
  { id: 8, judul: "Wiper Bosch", harga: 75000, deskripsi: "Sapuan bersih, karet tahan lama." },
];

export default function DaftarHargaScreen() {
  const [keyword, setKeyword] = useState('');

  // 2. LOGIKA FILTERING & SORTING (Otomatis jalan saat keyword berubah)
  // Ini bertindak sebagai 'state' filtered items yang Anda minta.
  // Jika keyword kosong, dia ambil semua. Jika ada, dia filter.
  const filteredItems = DUMMY_DATA
    .filter((item) => {
      if (keyword === '') return true; // Tampilkan semua jika kosong
      // Cek apakah judul mengandung kata kunci (Case Insensitive)
      return item.judul.toLowerCase().includes(keyword.toLowerCase());
    })
    .sort((a, b) => a.judul.localeCompare(b.judul)); // Urutkan A-Z

  return (
    <View style={styles.container}>
      {/* Search Bar - Fixed di atas (Opsional, kalau mau ikut scroll masukkan ke dalam ScrollView) */}
      <View style={styles.searchContainer}>
        <SearchBar 
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Cari Plat Nomor / Sparepart..."
          // Tambahkan prop onClear jika SearchBar Anda mendukungnya
          onClear={() => setKeyword('')} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Indikator Hasil Pencarian */}
        <Text style={styles.resultText}>
            Menampilkan {filteredItems.length} barang
        </Text>

        {/* 3. LOOPING / RENDERING DATA */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              foto={IMAGE_URL} // URL Gambar dari request Anda
              judul={item.judul}
              harga={item.harga} // ProductCard kita sudah handle number jadi format Rp
              deskripsi={item.deskripsi}
              onPress={() => alert(`Anda memilih: ${item.judul}`)}
            />
          ))
        ) : (
          // Tampilan jika tidak ada yang cocok
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Barang tidak ditemukan 😔</Text>
          </View>
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingBottom: 5,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 5,
  },
  resultText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'right',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  }
});