import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  foto?: string;          // Optional (Boleh kosong, karena ada fallback)
  judul: string;          // Wajib String
  harga: string | number; // Bisa String ("Rp 50rb") atau Number (50000)
  deskripsi: string;      // Wajib String
  onPress?: () => void;   // Function yang tidak mengembalikan nilai (Optional)
}

const ProductCard = ({ foto, judul, harga, deskripsi, onPress } : ProductCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      {/* BAGIAN KIRI: FOTO */}
      <View style={styles.leftContainer}>
        <Image 
          source={{ uri: foto || 'https://via.placeholder.com/100' }} // Fallback jika url kosong
          style={styles.image} 
        />
      </View>

      {/* BAGIAN KANAN: TEXT */}
      <View style={styles.rightContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {judul}
        </Text>
        
        <Text style={styles.price}>
          {harga}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {deskripsi}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // Kunci agar Kiri & Kanan sejajar
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    
    // Efek Bayangan (Shadow) agar terlihat timbul
    elevation: 3, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 4, // iOS
  },
  
  // Style Kiri
  leftContainer: {
    marginRight: 15,
    justifyContent: 'center', // Agar gambar vertikal tengah
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // Warna background saat loading
    resizeMode: 'cover',
  },

  // Style Kanan
  rightContainer: {
    flex: 1, // Ambil sisa ruang yang tersedia
    justifyContent: 'center',
    gap: 4, // Jarak antar baris text
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32', // Warna Hijau Duit
  },
  description: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 18,
  },
});

export default ProductCard;