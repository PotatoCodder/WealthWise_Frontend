import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
        backgroundColor: '#4E008E',
        borderTopWidth: 0,
        height: 70,
        paddingBottom: Platform.OS === 'ios' ? 25 : 15,
        paddingTop: 10,
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 30 : 20,
        left: 0,
        right: 0,
        borderRadius: 15,
        marginHorizontal: 16,
      },

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/tabicons/Home.png')}
              style={{ width: 24, height: 24, tintColor: color, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/tabicons/Analysis.png')}
              style={{ width: 24, height: 24, tintColor: color, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Transaction',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/tabicons/Transactions.png')}
              style={{ width: 24, height: 24, tintColor: color, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/tabicons/Category.png')}
              style={{ width: 24, height: 24, tintColor: color, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTintColor: '#fff',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/tabicons/Profile.png')}
              style={{ width: 24, height: 24, tintColor: color, opacity: focused ? 1 : 0.6 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
