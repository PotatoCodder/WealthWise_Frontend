import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CategoryFetch() {
  const { category } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData || '{}');
        const id = user?.email;
        setUserId(id);

        if (!id) throw new Error('User not found in AsyncStorage');

        const res = await fetch(
          `http://192.168.0.105:3000/api/get-expenses-by-category?userId=${id}&category=${category}`
        );
        const data = await res.json();

        if (res.ok) {
          setExpenses(data.expenses || []);
        } else {
          console.error('Error:', data.error);
        }
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses for {category}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4E008E" />
      ) : expenses.length === 0 ? (
        <Text style={styles.noData}>No expenses found.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.expenseDetails}>
                ₱{item.amount} - {item.date}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 20,
  },
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
