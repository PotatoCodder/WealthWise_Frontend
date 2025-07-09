import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CategoryDetails() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceCash, setBalanceCash] = useState(0);
  const [balanceCard, setBalanceCard] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(userData || '{}');
        setUser(parsedUser);

        const userId = parsedUser?.email;

        const [balanceRes, expenseRes] = await Promise.all([
          fetch(`http://192.168.0.104:3000/api/get-balance?userId=${userId}`),
          fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`),
        ]);

        const balanceJson = await balanceRes.json();
        const expenseJson = await expenseRes.json();

        const balances = balanceJson.balances || [];
        const expenses = expenseJson.expenses || [];

        const cash = balances.filter((b) => b.type === 'Cash')
          .reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

        const card = balances.filter((b) => b.type === 'Card')
          .reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

        const total = expenses.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

        setBalanceCash(cash);
        setBalanceCard(card);
        setTotalExpense(total);
        setExpenses(expenses);
      } catch (error) {
        console.error('🔥 Error fetching balances/expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
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

      <View style={styles.balanceSummary}>
        <View style={styles.balanceColumn}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>₱{(balanceCash + balanceCard).toFixed(2)}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.balanceColumn}>
          <Text style={styles.balanceLabel}>Total Expense</Text>
          <Text style={styles.balanceValue}>₱{totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.balanceBreakdown}>
        <Text style={styles.breakdownText}>💵 Cash: ₱{balanceCash.toFixed(2)}</Text>
        <Text style={styles.breakdownText}>💳 Card: ₱{balanceCard.toFixed(2)}</Text>
      </View>

      <View style={styles.secondaryView}>
        <View style={styles.gridContainer}>
          {['Food','Transport','Medicine','Groceries','Rent','Gifts','Savings','Entertainment','More'].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridButton}
              onPress={() =>
                router.push({ pathname: '/screens/categoryFetch', params: { category: label } })
              }
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>{getCategoryIcon(label)}</Text>
              </View>
              <Text style={styles.iconLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4E008E" />
        ) : (
          <ScrollView>
            {expenses.map((item, index) => (
              <View key={index} style={styles.expenseItem}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseDetails}>{item.category} - {item.date}</Text>
                <Text style={styles.expenseAmount}>₱{item.amount}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: '#4E008E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 60,
  },
  profileImage: { width: 45, height: 45, borderRadius: 20 },
  greetingText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  notificationIcon: { width: 34, height: 34 },
  balanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#4E008E',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  balanceColumn: { alignItems: 'center', width: '45%' },
  verticalDivider: { width: 1, height: '60%', backgroundColor: '#C3A1FF' },
  balanceLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  balanceValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 10,
    backgroundColor: '#4E008E',
  },
  breakdownText: { color: '#D3D3D3', fontSize: 14 },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  gridButton: {
    flexBasis: '30%',
    maxWidth: '30%',
    alignItems: 'center',
    marginBottom: 25,
    aspectRatio: 1,
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
  iconEmoji: { fontSize: 26 },
  iconLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center', color: '#4E008E' },
  expenseItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  expenseTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  expenseDetails: { color: '#555', marginBottom: 6 },
  expenseAmount: { fontSize: 16, fontWeight: 'bold', color: '#4E008E' },
});
