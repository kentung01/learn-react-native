import { Ionicons } from '@expo/vector-icons'; // Icon bawaan Expo
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchBar = ({ value, onChangeText, placeholder = "Cari...", onClear }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      {/* Icon Kaca Pembesar */}
      <Ionicons name="search" size={20} color="#666" style={styles.icon} />

      {/* Input Field */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />

      {/* Tombol X (Clear) - Muncul hanya jika ada text */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => {
            onChangeText(''); // Kosongkan text
            if (onClear) onClear(); // Panggil fungsi tambahan jika ada
        }}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Warna abu-abu muda khas search bar
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
    // Optional: Border tipis
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1, // Agar input memenuhi sisa ruang
    fontSize: 16,
    color: '#333',
    height: '100%', // Pastikan height aman
  },
});

export default SearchBar;