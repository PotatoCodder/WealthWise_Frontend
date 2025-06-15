import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const user = await AsyncStorage.getItem('user');

        setTimeout(() => {
          if (isLoggedIn === 'true' && user) {
            router.replace('/(tabs)/');
          } else {
            router.replace('/Login');
          }
        }, 1500); // gives time to show splash
      } catch (error) {
        console.error('Splash check error:', error);
        router.replace('/Login');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🌟 My App</Text>
      <ActivityIndicator size="large" color="#4E008E" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4E008E',
  },
});
