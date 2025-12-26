import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'react-native';
import { redCollor } from '../color';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitle : "WM Invoice",
        headerTitleAlign : "center",
        headerTitleStyle : {
          fontWeight : "bold",
          fontSize : 20,
          color : redCollor(),
        },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
           tabBarIcon: ()=>{ return <>
              <Image source={require('@/assets/images/icons/folder-icon.png')} style={{height: 40, width: 40}} />
          </> }
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Buat Invoice',
          tabBarIcon: ()=>{ return <>
              <Image source={require('@/assets/images/icons/add-button-icon.png')} style={{height: 40, width: 40}} />
          </> }
        }}
      />
       <Tabs.Screen
        name="send" 
        options={{
          title: 'send',
            tabBarIcon: ()=>{ return <>
                <Image source={require('@/assets/images/icons/price-list-icon.png')} style={{height: 40, width: 40}} />
            </> }
        }}
      />
    </Tabs>
  );
}
