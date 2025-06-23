import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CategoryDetails() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(userData || '{}');
      setUser(parsedUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const getCategoryIcon = (label) => {
    const icons = {
      Food: '🍔',
      Transport: '🚌',
      Medicine: '💊',
      Groceries: '🛒',
      Rent: '🏠',
      Gifts: '🎁',
      Savings: '💰',
      Entertainment: '🎉',
      More: '➕',
    };
    return icons[label] || '❓';
  };

  return (
    <View style={styles.mainView}>
      {/* 🔷 Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greetingText}>Hello, {user?.email?.split('@')[0] || 'User'}</Text>
        <Image
          source={require('../../assets/images/Icon-Notification.png')}
          style={styles.notificationIcon}
        />
      </View>

      {/* 🔷 Body Section */}
      <View style={styles.secondaryView}>
        {/* Grid Buttons */}
        <View style={styles.gridContainer}>
          {[
            'Food',
            'Transport',
            'Medicine',
            'Groceries',
            'Rent',
            'Gifts',
            'Savings',
            'Entertainment',
            'More',
          ].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridButton}
              onPress={() =>
                router.push({
                  pathname: '/screens/categoryFetch',
                  params: { category: label },
                })
              }
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>{getCategoryIcon(label)}</Text>
              </View>
              <Text style={styles.iconLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Expense List */}
        {loading ? (
          <ActivityIndicator size="large" color="#4E008E" />
        ) : (
          <ScrollView>
            {expenses.map((item, index) => (
              <View key={index} style={styles.expenseItem}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseDetails}>
                  {item.category} - {item.date}
                </Text>
                <Text style={styles.expenseAmount}>₱{item.amount}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/screens/categoryDetails')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#4E008E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 60,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  greetingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationIcon: {
    width: 34,
    height: 34,
  },

  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 40,
  },

  // 🔘 3x3 Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconEmoji: {
    fontSize: 26,
  },
  iconLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#4E008E',
  },

  // 💸 Expense List
  expenseItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseDetails: {
    color: '#555',
    marginBottom: 6,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E008E',
  },

  // ➕ Floating Button
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#4E008E',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
