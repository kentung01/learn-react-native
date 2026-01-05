import SearchBar from '@/components/SearchBar';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print'; // <--- Import Print
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- 1. TIPE DATA & DUMMY DATA ---
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const DUMMY_INVOICES = [
  {
    id: '1',
    nomorInvoice: 'INV-20250101-001',
    tanggal: '01/01/2026',
    platNomor: 'B 1234 ABC',
    namaPelanggan: 'Budi Santoso',
    nomorPelanggan: '08123456789',
    status: 'LUNAS',
    items: [
      { 
        id: 101, 
        deskripsi: 'Ganti Oli Shell Helix', 
        qty: '1', 
        harga: '350000', 
        jumlah: 350000, 
        imageUri: 'https://down-id.img.susercontent.com/file/id-11134207-7r98o-lty9q4j8d5i6e4'
      },
      { 
        id: 102, 
        deskripsi: 'Jasa Ganti Oli', 
        qty: '1', 
        harga: '50000', 
        jumlah: 50000, 
        imageUri: null
      }
    ]
  },
  {
    id: '2',
    nomorInvoice: 'INV-20250102-002',
    tanggal: '02/01/2026',
    platNomor: 'D 5678 XYZ',
    namaPelanggan: 'Siti Aminah',
    nomorPelanggan: '08198765432',
    status: 'BELUM BAYAR',
    items: [
      { 
        id: 201, 
        deskripsi: 'Kampas Rem Depan', 
        qty: '1', 
        harga: '250000', 
        jumlah: 250000, 
        imageUri: null 
      },
      { 
        id: 202, 
        deskripsi: 'Jasa Pasang Rem', 
        qty: '1', 
        harga: '100000', 
        jumlah: 100000, 
        imageUri: null 
      }
    ]
  }
];

// --- 2. KOMPONEN CARD ---
const InvoiceCard = ({ data, onPress }: { data: any, onPress: () => void }) => {
  const grandTotal = data.items.reduce((acc: number, item: any) => acc + item.jumlah, 0);
  // ... state lainnya


  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.invoiceNumber}>{data.nomorInvoice}</Text>
        <Text style={[
          styles.statusBadge, 
          { backgroundColor: data.status === 'LUNAS' ? '#e8f5e9' : '#ffebee', 
            color: data.status === 'LUNAS' ? 'green' : 'red' }
        ]}>
          {data.status}
        </Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.rowInfo}>
          <Ionicons name="car-sport-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{data.platNomor} ({data.namaPelanggan})</Text>
        </View>
        <View style={styles.rowInfo}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{data.tanggal}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatRupiah(grandTotal)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- 3. KOMPONEN MODAL DETAIL ---
const InvoiceDetailModal = ({ visible, data, onClose, onEdit, onPrint }: any) => {
  if (!data) return null;
  const grandTotal = data.items.reduce((acc: number, item: any) => acc + item.jumlah, 0);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detail Transaksi</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.sectionBox}>
              <Text style={styles.label}>No. Invoice</Text>
              <Text style={styles.valueBold}>{data.nomorInvoice}</Text>
              
              <View style={styles.divider} />
              
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.label}>Pelanggan</Text>
                  <Text style={styles.value}>{data.namaPelanggan}</Text>
                  <Text style={styles.subValue}>{data.nomorPelanggan}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.label}>Kendaraan</Text>
                  <Text style={styles.value}>{data.platNomor}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Rincian Barang & Jasa</Text>
            {data.items.map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.itemTitle}>{item.deskripsi}</Text>
                  <Text style={styles.itemSub}>
                    {item.qty} x {formatRupiah(parseInt(item.harga))}
                  </Text>
                  {item.imageUri && (
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  )}
                </View>
                <Text style={styles.itemTotal}>{formatRupiah(item.jumlah)}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            
            <View style={styles.rowBetween}>
              <Text style={styles.bigTotalLabel}>Grand Total</Text>
              <Text style={styles.bigTotalValue}>{formatRupiah(grandTotal)}</Text>
            </View>

          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable style={[styles.btnAction, styles.btnEdit]} onPress={() => onEdit(data)}>
              <Ionicons name="create-outline" size={20} color="white" />
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>
            
            <Pressable style={[styles.btnAction, styles.btnPrint]} onPress={() => onPrint(data)}>
              <Ionicons name="print-outline" size={20} color="white" />
              <Text style={styles.btnText}>Cetak</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

// --- 4. SCREEN UTAMA (Home) ---
export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // ... state lainnya
  const [isPrinting, setIsPrinting] = useState(false); // <--- State baru
  
  const [keyword, setKeyword] = useState('');

  const filteredInvoices = DUMMY_INVOICES.filter((item) => {
    const searchLower = keyword.toLowerCase();
    return (
      item.nomorInvoice.toLowerCase().includes(searchLower) ||
      item.platNomor.toLowerCase().includes(searchLower) ||
      item.namaPelanggan.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenDetail = (item: any) => {
    setSelectedInvoice(item);
    setModalVisible(true);
  };

  const handleEdit = (item: any) => {
    setModalVisible(false);
    const dataString = JSON.stringify(item);
    router.push({
      pathname: '/editInvoice', 
      params: { invoiceData: dataString } 
    });
  };

  const handlePrint = async (item: any) => {
    // 1. CEK: Jika sedang nge-print, stop
    if (isPrinting) return;

    setIsPrinting(true); 
    console.log("Mulai proses cetak...");

    try {
      // --- PERSIAPAN DATA ---
      // Hitung Total Belanja dengan aman (handle jika data string/undefined)
      const totalSemua = item.items.reduce((acc: number, curr: any) => {
        return acc + (parseInt(curr.jumlah) || 0);
      }, 0);
      
      // Formatter untuk Rupiah
      const formatter = new Intl.NumberFormat('id-ID', { 
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
      });

      // --- TEMPLATE HTML LENGKAP ---
      const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
              
              /* Header Bengkel */
              .header { text-align: center; margin-bottom: 20px; border-bottom: 3px double #333; padding-bottom: 15px; }
              .header h1 { margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
              .header p { margin: 3px 0; font-size: 12px; color: #555; }
              
              /* Info Invoice & Pelanggan */
              .info-container { margin-bottom: 20px; font-size: 13px; }
              .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .label { font-weight: bold; color: #555; }
              
              /* Tabel Barang */
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { text-align: left; border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 8px 5px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
              td { border-bottom: 1px solid #ddd; padding: 8px 5px; font-size: 13px; vertical-align: top; }
              
              /* Helper Text Align */
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              
              /* Bagian Total */
              .total-section { margin-top: 20px; border-top: 2px solid #333; padding-top: 10px; }
              .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; }
              
              /* Footer */
              .footer { text-align: center; margin-top: 40px; font-size: 10px; color: #888; font-style: italic; }
            </style>
          </head>
          <body>
            
            <div class="header">
              <h1>BENGKEL MOBIL WILLY MOTOR</h1>
              <p>Jl. Raya Otomotif No. 88, Jakarta Selatan</p>
              <p>WhatsApp: 0812-3456-7890</p>
            </div>

            <div class="info-container">
              <div class="info-row">
                <span class="label">No. Invoice:</span>
                <span>${item.nomorInvoice}</span>
              </div>
              <div class="info-row">
                <span class="label">Tanggal:</span>
                <span>${item.tanggal}</span>
              </div>
              <div style="height: 10px;"></div> <div class="info-row">
                <span class="label">Pelanggan:</span>
                <span>${item.namaPelanggan || 'Umum'}</span>
              </div>
              <div class="info-row">
                <span class="label">Kendaraan:</span>
                <span>${item.platNomor || '-'}</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 45%;">Deskripsi</th>
                  <th style="width: 10%;" class="text-center">Qty</th>
                  <th style="width: 20%;" class="text-right">Harga</th>
                  <th style="width: 25%;" class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${item.items.map((subItem: any) => {
                  // Format angka per baris
                  const hargaSatuan = parseInt(subItem.harga) || 0;
                  const subTotal = parseInt(subItem.jumlah) || 0;
                  
                  return `
                    <tr>
                      <td>${subItem.deskripsi}</td>
                      <td class="text-center">${subItem.qty}</td>
                      <td class="text-right">${hargaSatuan.toLocaleString('id-ID')}</td>
                      <td class="text-right" style="font-weight:bold;">${subTotal.toLocaleString('id-ID')}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>GRAND TOTAL:</span>
                <span>${formatter.format(totalSemua)}</span>
              </div>
            </div>

            <div class="footer">
              <p>Terima kasih atas kepercayaan Anda.</p>
              <p>Garansi servis 1 minggu. Barang yang dibeli tidak dapat dikembalikan.</p>
            </div>

          </body>
        </html>
      `;

      // Eksekusi Print
      await Print.printAsync({ html: htmlContent });

    } catch (error) {
      console.error("ERROR PRINT:", error);
      Alert.alert("Gagal", "Terjadi kesalahan saat mencetak.");
    } finally {
      // 2. FINALLY: Buka kunci tombol
      setIsPrinting(false); 
    }
  };


  return (
    <View style={styles.container}>
      
      <View style={{ marginBottom: 15 }}>
        <SearchBar 
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Cari Invoice / Plat / Nama..."
          onClear={() => setKeyword('')} 
        />
      </View>

      <Text style={styles.screenTitle}>List Invoice</Text>
      
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InvoiceCard 
            data={item} 
            onPress={() => handleOpenDetail(item)} 
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="search-outline" size={50} color="#ccc" />
            <Text style={{ color: '#999', marginTop: 10 }}>Invoice tidak ditemukan</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <InvoiceDetailModal 
        visible={modalVisible}
        data={selectedInvoice}
        onClose={() => setModalVisible(false)}
        onEdit={handleEdit}
        onPrint={handlePrint} // <--- Fungsi Cetak dipasang disini
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 50,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign:'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceNumber: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardBody: { marginBottom: 10 },
  rowInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 8 },
  infoText: { color: '#666', fontSize: 14 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  totalLabel: { color: '#666' },
  totalValue: { fontWeight: 'bold', color: '#2e7d32', fontSize: 16 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { flex: 1 },
  sectionBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  label: { fontSize: 12, color: 'gray' },
  value: { fontSize: 14, fontWeight: '500', color: '#333' },
  valueBold: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subValue: { fontSize: 12, color: '#666' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  itemTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  itemSub: { fontSize: 12, color: 'gray', marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginTop: 8,
    backgroundColor: '#eee',
  },
  bigTotalLabel: { fontSize: 16, fontWeight: 'bold' },
  bigTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnEdit: { backgroundColor: '#FF9800' },
  btnPrint: { backgroundColor: '#2196F3' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});