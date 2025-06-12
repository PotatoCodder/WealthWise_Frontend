import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleNavigation = (route) => {
    router.push(route);
  };

  const settings = [
    { label: 'Profile', route: '/profile' },
    { label: 'Security', route: '/security' },
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms of Use', route: '/terms' },
    { label: 'Logout', route: '/logout' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {settings.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.link}
          onPress={() => handleNavigation(item.route)}
        >
          <Text style={styles.linkText}>{item.label}</Text>
          <Text style={styles.arrow}>&gt;</Text>
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
