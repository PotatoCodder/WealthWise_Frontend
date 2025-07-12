import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import NotificationBtn from '@/components/NotificationBtn';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [username, setUsername] = useState('User');
  const [activeTab, setActiveTab] = useState('Balance');
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [totalCash, setTotalCash] = useState(0);
  const [totalCard, setTotalCard] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setUsername(user.name || user.email?.split('@')[0] || 'User');
        if (activeTab === 'Balance') {
          fetchBalanceData(user.email);
        } else if (activeTab === 'Expense') {
          fetchExpenses(user.email);
        }
      }
    };
    fetchUser();
  }, [activeTab]);

  const fetchBalanceData = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://192.168.0.104:3000/api/get-balance?userId=${userId}`);
      const data = await res.json();

      if (res.ok) {
        setBalances(data.balances || []);

        const cashTotal = data.balances
          .filter((item) => item.type.toLowerCase() === 'cash')
          .reduce((sum, item) => sum + parseFloat(item.amount), 0);

        const cardTotal = data.balances
          .filter((item) => item.type.toLowerCase() === 'card')
          .reduce((sum, item) => sum + parseFloat(item.amount), 0);

        setTotalCash(cashTotal);
        setTotalCard(cardTotal);
      } else {
        console.error('❌ Error fetching balance:', data.error);
      }
    } catch (err) {
      console.error('🔥 Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setExpenses(data.expenses || []);
        setGroupedExpenses(groupByMonth(data.expenses || []));
      } else {
        console.error('❌ API Error:', data.error);
      }
    } catch (err) {
      console.error('🔥 Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupByMonth = (list) => {
    return list.reduce((acc, item) => {
      const month = new Date(item.date).toLocaleString('default', {
        year: 'numeric',
        month: 'long',
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  };

  const renderContent = () => {
    if (activeTab === 'Balance') {
      return loading ? (
        <ActivityIndicator size="large" color="#4E008E" />
      ) : (
        <View style={styles.cardBox}>
          <FontAwesome5 name="wallet" size={40} color="#4E008E" style={{ marginBottom: 10 }} />
          <Text style={styles.balanceText}>Cash: ₱{totalCash.toFixed(2)}</Text>
          <Text style={styles.balanceText}>Card: ₱{totalCard.toFixed(2)}</Text>
        </View>
      );
    }

    if (activeTab === 'Total') {
      return (
        <View style={styles.cardBox}>
          <Ionicons name="construct" size={40} color="#FF6F61" style={{ marginBottom: 10 }} />
          <Text style={styles.placeholderText}>🚧 Total tab under construction</Text>
        </View>
      );
    }

    if (loading) {
      return <ActivityIndicator size="large" color="#4E008E" />;
    }

    if (expenses.length === 0) {
      return <Text style={styles.noData}>No expenses found.</Text>;
    }

    return (
      <ScrollView>
        {Object.entries(groupedExpenses).map(([month, items], index) => (
          <View key={index}>
            <Text style={styles.dateText}>{month}</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.expenseItem}>
                <MaterialIcons name="receipt" size={20} color="#4E008E" style={{ marginRight: 10 }} />
                <Text style={styles.entryText}>{item.title}: ₱{item.amount}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greetingText}>Hello, {username}</Text>
        <NotificationBtn />
      </View>

      <View style={styles.buttonRow}>
        {[
          { label: 'Balance', icon: <FontAwesome5 name="money-bill-wave" size={16} color="#fff" /> },
          { label: 'Expense', icon: <MaterialIcons name="money-off" size={20} color="#fff" /> },
          { label: 'Total', icon: <Ionicons name="ios-bar-chart" size={18} color="#fff" /> },
        ].map(({ label, icon }) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.iconButton,
              activeTab === label && { backgroundColor: '#8C52FF' },
            ]}
            onPress={() => setActiveTab(label)}
          >
            {icon}
            <Text style={styles.walletLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.secondaryView}>{renderContent()}</View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  walletLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  contentWrapper: { flex: 1, position: 'relative' },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 40,
  },
  cardBox: {
    alignItems: 'center',
    backgroundColor: '#F7F2FF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  dateText: {
    fontWeight: 'bold',
    backgroundColor: '#4E008E',
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 30,
    left: 30,
    bottom: 7,
  },
  entryText: {
    color: '#4E008E',
    fontSize: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE7FF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#4E008E',
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 10,
    textAlign: 'center',
  },
});
