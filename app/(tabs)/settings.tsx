import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('user');
      router.replace('/ALunch');
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  const settings = [
    { label: 'Profile', route: '../screens/profile' },
    { label: 'Security', route: '/screens/security' },
    { label: 'Privacy Policy', route: '/screens/privacy' },
    { label: 'Terms of Use', route: '/screens/term' },
    { label: 'Logout', route: 'logout' }, // just a key, not a route
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {settings.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.link}
          onPress={() => {
            if (item.label === 'Logout') {
              handleLogout(); // Call logout instead of navigation
            } else {
              handleNavigation(item.route);
            }
          }}
        >
          <Text
            style={[
              styles.linkText,
              item.label === 'Logout' ? { color: 'red' } : null,
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              styles.arrow,
              item.label === 'Logout' ? { color: 'red' } : null,
            ]}
          >
            &gt;
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E008E',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  link: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 18,
    color: '#ffffff',
  },
  arrow: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
