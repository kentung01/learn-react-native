import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';



export default function TabTwoScreen() {

  return (
   <ScrollView style={{ height: 100 }}>
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', alignItems: 'center', padding: 20 }}>
      <View style={{ flex: 1, flexDirection: 'row', gap: 10, height: 30, width: '100%', backgroundColor: '', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Nomor Invoice</Text>
        <Text style={{ fontSize: 18 }}>BMWM-1234</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', gap: 10, height: 30, width: '100%', backgroundColor: '', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <TextInput
          style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'gray', padding: 5 }}
          placeholder="Masukkan Nomor Invoice"
        />
      </View>
    </View>
   </ScrollView>
  );
}

const styles = StyleSheet.create({
 
});
