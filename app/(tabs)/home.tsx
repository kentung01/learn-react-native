import { Image } from 'expo-image';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { redCollor } from '../color';

export default function HomeScreen() {

  const listItems = [
    'Infoice 1',
    'Infoice 2',
    'Infoice 3',
    'Infoice 4',
    'Infoice 5',
  ];

  const images = [
    require('@/assets/images/home.screen/main.jpeg'),
        require('@/assets/images/home.screen/slide1.png'),
            require('@/assets/images/home.screen/slide2.png')
  ];

  const width = Dimensions.get('window').width;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <View style={{ flex: 1 }}>
        <Carousel
            loop
            width={width}
            // height={width / 2}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ item }) => (
            <View style={{ flex: 1, borderWidth: 1, justifyContent: 'center' }}>
            {/* <Text style={{ textAlign: 'center', fontSize: 30 }}>{index}</Text> */}
             {<Image
              source={item}
              style={imageStyle.imageSize}
            />}
        </View>
        )}
        />
        </View>
      
      }>
      <ThemedView style={[styles.titleContainer, { marginTop: 0 }, { flexDirection: 'column', alignItems: 'center', gap: 10 }]}>
        <ThemedText type="subtitle" style={[styleText.collorRed]}>Invoice Terkini</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <View >
          {listItems.map((item, index) => (
            <Pressable key={index} style={(pressed) => [styles.box, pressed && { opacity: 0.5 }]} onPress={() => alert(`${item} pressed`)}>
              <View key={index} style={styles.box}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <Image source={require('@/assets/images/icons/document-icon.png')} style={{ width: 50, height: 50 }} />
                  <ThemedText style={styleText.leftAlign}>{item}</ThemedText>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <Pressable style={(pressed) => [styles.box, pressed && { opacity: 0.8 }]} onPress={() => alert(`Tambah Infoice pressed`)}>
           <View style={[{height: 50},{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}> <Image source={require('@/assets/images/icons/arrow-button-icon.png')} style={{height: 50, width: 50 }} /> 
             <ThemedText>Lihat lainya</ThemedText>
          </View>
        </Pressable>
     
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {/* <Pressable style={(pressed) => [styles.box, pressed && { opacity: 0.5 }]} onPress={() => alert(`Tambah Infoice pressed`)}>
           <View style={[{height: 50},{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}> <Image source={require('@/assets/images/icons/add-button-icon.png')} style={{height: 50, width: 50 }} /> 
             <ThemedText>Buat Invoice</ThemedText>
          </View>
        </Pressable> */}

        {/* <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link> */}

       
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  box: {
    width: '100%',

  },
});

const styleText = StyleSheet.create({
  leftAlign: {
    textAlign: 'left',
  },
  centerAlign: {
    textAlign: 'center',
    fontSize: 18,
  },
  collorRed: {
    color: redCollor(),
  },
});

const imageStyle = StyleSheet.create({
  imageSize: {
    height: 300,
  },
});
