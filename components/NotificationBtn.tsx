import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
export default function NotificationBtn() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push('/screens/Notification')}>
      <Image
        source={require('../assets/images/Icon-Notification.png')}
        style={styles.notificationIcon}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    notificationIcon: { 
      width: 34, 
      height: 34 
    },
})