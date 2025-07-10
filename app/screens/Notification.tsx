import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://192.168.0.104:3000/api/notifications`);
          const data = await res.json();
          setNotifications(data.notifications || []);
        } catch (err) {
          console.error('🔥 Error fetching notifications:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Notifications</Text>
      <ScrollView>
        {loading ? (
          <Text style={styles.text}>⏳ Loading...</Text>
        ) : notifications.length > 0 ? (
          notifications.map((note, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.text}>{note.message}</Text>
              <Text style={styles.date}>{note.date}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No notifications yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  text: { fontSize: 16, color: '#333' },
  date: { fontSize: 12, color: '#888', marginTop: 5 },
});
