import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import NotificationBtn from '@/components/NotificationBtn';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const router = useRouter();
  const [barData, setBarData] = useState({
    labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
    datasets: [{ data: [0, 0, 0, 0] }],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchedDate, setLastFetchedDate] = useState(null);

  const [balanceCash, setBalanceCash] = useState(0);
  const [balanceCard, setBalanceCard] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchBalanceAndExpense();
    }, [])
  );

  const fetchBalanceAndExpense = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString || '{}');
      const userId = user.email;

      const [expenseRes, balanceRes] = await Promise.all([
        fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`),
        fetch(`http://192.168.0.104:3000/api/get-balance?userId=${userId}`),
      ]);

      const expenseJson = await expenseRes.json();
      const balanceJson = await balanceRes.json();

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const thisMonthExpenses = expenseJson.expenses?.filter((item) => {
        const date = new Date(item.date + 'T00:00:00');
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }) || [];

      const total = thisMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      setTotalExpense(total);

      const balances = balanceJson.balances || [];
      const cashTotal = balances.filter((b) => b.type === 'Cash').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
      const cardTotal = balances.filter((b) => b.type === 'Card').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

      setBalanceCash(cashTotal);
      setBalanceCard(cardTotal);
    } catch (err) {
      console.error('🔥 Balance fetch error:', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) return;
      const { email: userId } = JSON.parse(user);

      const res = await fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`);
      const { expenses } = await res.json();

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const filtered = expenses.filter((e) =>
        typeof e.date === 'string' && e.date.startsWith(currentMonth)
      );

      const sorted = [...filtered].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (sorted.length > 0) {
        const latestDate = sorted[0].createdAt;
        if (latestDate === lastFetchedDate) return;
        setLastFetchedDate(latestDate);
      }

      const weeks = [0, 0, 0, 0];
      filtered.forEach((e) => {
        const day = parseInt(e.date.split('-')[2]);
        let weekIndex = Math.floor((day - 1) / 7);
        weekIndex = Math.min(weekIndex, 3);
        weeks[weekIndex] += Number(e.amount);
      });

      setBarData({
        labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
        datasets: [{ data: weeks }],
      });
    } catch (err) {
      console.error('🔥 Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchExpenses();
      await fetchBalanceAndExpense();
    } catch (err) {
      console.error('❌ Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.mainView}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8C52FF']}
            tintColor="#8C52FF"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.notificationRow}>
            <NotificationBtn />
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
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📊 This Month's Expenses</Text>

          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/screens/search')}>
              <Ionicons name="search" size={22} color="#4E008E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/screens/Calendar')}>
              <Ionicons name="calendar" size={22} color="#4E008E" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#8C52FF" style={{ marginTop: 40 }} />
          ) : (
            <BarChart
              data={barData}
              width={screenWidth - 40}
              height={220}
              yAxisLabel="₱"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(78, 0, 142, ${opacity})`,
                labelColor: () => '#888',
                style: { borderRadius: 16 },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#eee',
                },
              }}
              verticalLabelRotation={0}
              style={styles.chart}
            />
          )}

          <TouchableOpacity
            onPress={() => router.push('/screens/detailedAnalysis.tsx')}
            style={styles.analysisBtn}
          >
            <Text style={styles.analysisText}>Go to Detailed Analysis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: '#4E008E' },
  scroll: {
    flexGrow: 1,
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#4E008E',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  notificationRow: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  balanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 15,
  },
  verticalDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#C3A1FF',
  },
  balanceColumn: { alignItems: 'center', width: '45%' },
  balanceLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  balanceValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  breakdownText: { color: '#E0D6FF', fontSize: 13 },
  chartContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    paddingTop: 34,
    paddingBottom: 300,
    paddingHorizontal: 25,
    marginTop: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  chartTitle: {
    color: '#4E008E',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  chart: { borderRadius: 16 },
  iconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: '#EEE6FF',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  analysisBtn: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#8C52FF',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  analysisText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});