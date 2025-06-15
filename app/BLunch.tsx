import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Lunch() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/ww.png')} />

      <Text style={styles.title}>Wealth Wise</Text>

      <Text style={styles.description}>Smart Spending Starts Here.</Text>
      <Text style={styles.description}>
        Predicting Your Path to Financial Freedom.
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => router.push('/Register')}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>Forgot Password?</Text>
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
  title: {
    fontSize: 52,
    fontWeight: '600',
    color: '#4E008E',
    marginBottom: 1,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 10,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#4E008E',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    width: 207,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4E008E',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 8,
    width: 207,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#4E008E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
    color: '#4E008E',
  },
});
