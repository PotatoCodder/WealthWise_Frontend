import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ALunch() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      setTimeout(() => {
        if (isLoggedIn === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/BLunch');
        }
      }, 2000);
    };

    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/ww.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>Wealth Wise</Text>
      <Text style={styles.description}>Smart Spending Starts Here.</Text>
      <Text style={styles.description}>
        Predicting Your Path to Financial Freedom.
      </Text>

      <ActivityIndicator
        size="large"
        color="#4E008E"
        style={{ marginTop: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 52,
    fontWeight: '600',
    color: '#4E008E',
    marginBottom: 1,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
});
